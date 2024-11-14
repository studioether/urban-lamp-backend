import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    constructor(private configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get<string>('database.url')
                }
            }
        })
    }

    async onModuleInit() {
        await this.$connect()
    }
}
