import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UserModule, UserAuthModule, } from './modules';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  SequelizeModule.forRoot({
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    // models: [Menu],
    autoLoadModels: true,
    synchronize: true,
  }),
    UserModule,
    UserAuthModule,
  // UserModule,
  // UserAuthModule,
  ScheduleModule.forRoot(),
  MailerModule.forRoot({
    transport: {
      host: process.env.GMAIL_SERVICE_HOST,
      port: Number(process.env.GMAIL_SERVICE_PORT),
      // tls: {
      //   ciphers: 'SSLv3',
      // },
      secure: process.env.GMAIL_SERVICE_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER_NAME, // generated ethereal user
        pass: process.env.GMAIL_USER_PASSWORD, // generated ethereal password
      },
    },
    defaults: {
      from: process.env.SMTP_FROM || '"nest-modules" <modules@nestjs.com>',
    },
    template: {
      dir: __dirname + '/mailer/templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
