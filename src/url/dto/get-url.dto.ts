import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetURLDto {
    @ApiProperty()
    id: number;
}