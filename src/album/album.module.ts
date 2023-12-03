import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FotoService } from 'src/foto/foto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './album.entity/album.entity';
import { FotoEntity } from '../foto/foto.entity/foto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity, FotoEntity]) 
  ],
  providers: [AlbumService, FotoService],
  controllers: [AlbumController]
})
export class AlbumModule {}
