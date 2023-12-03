import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { AlbumService } from './album.service';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AlbumEntity } from './album.entity/album.entity';
import { AlbumDto } from './album.dto/album.dto';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}

    @Get(':albumId')
  async findAlbumById(@Param('albumId') albumId: string) {
    return await this.albumService.findAlbumById(albumId);
  }

  @Post()
 async createAlbum(@Body() albumDto: AlbumDto) {
   const album: AlbumEntity = plainToInstance(AlbumEntity, albumDto);
   return await this.albumService.createAlbum(album);
 }

 @Delete(':albumId')
  @HttpCode(204)
  async deleteAlbum(@Param('albumId') albumId: string) {
    return await this.albumService.deleteAlbum(albumId);
  }

  @Post(':albumId/fotos/:fotoId')
   async addPhotoToAlbum(@Param('albumId') albumId: string, @Param('fotoId') fotoId: string){
       return await this.albumService.addPhotoToAlbum(albumId, fotoId);
   }
}
