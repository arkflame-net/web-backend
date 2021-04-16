import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

  private getNestedConstrains (error) {
    const { constraints, children } = error;
    if (constraints == null && (children && children.length >= 1)) {
      return this.getNestedConstrains(children[0])
    } else if (constraints != null) {
      return constraints;
    } else {
      return {
        unknownError: "Oops, something has failed."
      }
    }
  }

  private getErrorFromValidation (errors) {
    const firstError = errors[0];
    const constraints = this.getNestedConstrains(firstError);
    const message = constraints[Object.keys(constraints)[0]];
    return message;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const message = this.getErrorFromValidation(errors);
      throw new BadRequestException(message, 'VALIDATION_FAILED');
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
