// Libraries
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

// App modules
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from "./modules/categories/category.module";
import { ProductModule } from './modules/products/product.module';
import { PurchaseItemModule } from './modules/purchaseitems/purchaseitem.module';
import { PurchaseModule } from "./modules/purchases/purchase.module";
import { RoleModule } from "./modules/roles/role.module";
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import {
  ApplicationType,
  GoogleRecaptchaModule,
  GoogleRecaptchaNetwork,
} from '@nestlab/google-recaptcha';

// App controllers and services
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpErrorFilter } from "./shared/http-error.filter";
import { LoggingInterceptor } from "./shared/logging.interceptor";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),

    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src', 'graphql', 'schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV == 'development',
      debug: process.env.NODE_ENV == 'development',
    }),

    GoogleRecaptchaModule.forRoot({
      secretKey: process.env.RECAPTCHA_SECRET,
      response: (req) => {
          const token = (req.headers.recaptcha || '').toString();
          return token;
      },
      skipIf: process.env.NODE_ENV !== 'production',
      applicationType: ApplicationType.GraphQL,
      network: GoogleRecaptchaNetwork.Recaptcha,
      agent: null,
  }),

    AuthModule,
    CategoryModule,
    ProductModule,
    PurchaseModule,
    PurchaseItemModule,
    RoleModule,
    UserModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ],
})
export class AppModule {}
