import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedSocialService } from './redSocial.service';
import { RedSocialEntity } from './redSocial.entity/redSocial.entity';
import { RedSocialController } from './redSocial.controller';

@Module({
  providers: [RedSocialService],
  imports: [TypeOrmModule.forFeature([RedSocialEntity])],
  controllers: [RedSocialController],
})
export class RedSocialModule {}
