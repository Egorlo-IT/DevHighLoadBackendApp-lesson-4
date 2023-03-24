import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { CategoriesModule } from './categories/categories.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgConfigService } from '../pgConfigService';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    NewsModule,
    CategoriesModule,
    MailModule,
    UsersModule,
    AuthModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: '.development.env',
    // }),
    // TypeOrmModule.forRootAsync({
    //   useClass: PgConfigService,
    //   inject: [PgConfigService],
    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
