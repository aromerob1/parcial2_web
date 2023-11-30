import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedSocialService } from './redSocial.service';
import { RedSocialEntity } from './redSocial.entity/redSocial.entity';

@Module({
  providers: [RedSocialService],
  imports: [TypeOrmModule.forFeature([RedSocialEntity])],
})
export class RedSocialModule {}
