import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Url } from 'src/url/url.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE'),
            synchronize: true,
            entities: [Url, User],
            logging: true,
            subscribers: [],
            migrations: [],
        };
    }
}