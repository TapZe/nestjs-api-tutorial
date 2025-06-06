import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources:{
                db:{
                    url: config.getOrThrow<string>('DATABASE_URL')
                }
            }
        });
    }

    cleanDB() {
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany(),
        ])
    }
}
