import { Module } from '@nestjs/common';
import { PerformerAlbumService } from './performer-album.service';
import { AlbumEntity } from 'src/album/album.entity/album.entity';
import { PerformerEntity } from 'src/performer/performer.entity/performer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity, PerformerEntity])],
  providers: [PerformerAlbumService]
})
export class PerformerAlbumModule {}
