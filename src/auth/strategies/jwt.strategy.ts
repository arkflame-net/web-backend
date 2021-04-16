import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionService } from "../../modules/session/session.service";
import { User } from '../../modules/user/user.model';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(
        request,
        validationPayload: { id: string },
        done,
    ): Promise<void> {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        const user = await this.userService.getByID(validationPayload.id);

        const isValid = await this.sessionService.isValidToken(
            !user ? 'not exist' : user._id,
            token,
        );
        if (isValid) {
            done(null, user);
        } else {
            done(new UnauthorizedException('The session has expired'), null);
        }
    }
  }
