import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './redSocial.entity/redSocial.entity';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity])],
})
export class TrackModule {}
