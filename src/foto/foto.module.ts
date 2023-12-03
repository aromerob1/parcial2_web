import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { FotoService } from './foto.service';
import { FotoEntity } from './foto.entity/foto.entity';
import { AlbumService } from 'src/album/album.service';
import { FotoController } from './foto.controller';
import { AlbumEntity } from '../album/album.entity/album.entity';

@Module({
  providers: [FotoService, AlbumService],
  imports: [TypeOrmModule.forFeature([FotoEntity, AlbumEntity])],
  controllers: [FotoController],
})
export class FotoModule {}
