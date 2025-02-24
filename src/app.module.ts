import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
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
