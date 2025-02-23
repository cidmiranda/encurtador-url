import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { UrlModule } from './url/url.module';
import { configValidationSchema } from './config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Url } from './url/url.entity';
import { User } from './user/user.entity';
import { PostgresConfigService } from './config/postgres.config.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UrlModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
