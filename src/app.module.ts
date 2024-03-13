import { GoogleStrategy } from './google.strategy';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { test } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres:secret@127.0.0.1:5432/google_auth',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'secret',
      database: 'google_auth',
      synchronize: false, 
      entities: [__dirname + '/entity/*.entity.{ts,js}']
    }),
    TypeOrmModule.forFeature([test]),
  JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: 'Hello',
        signOptions: { expiresIn: '1d' }, // You can adjust the expiration time as needed
      }),
    }),],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
