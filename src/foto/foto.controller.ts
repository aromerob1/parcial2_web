import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { FotoService } from './foto.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { FotoDto } from './foto.dto/foto.dto';
import { FotoEntity } from './foto.entity/foto.entity';
import { plainToInstance } from 'class-transformer';

@Controller('fotos')
@UseInterceptors(BusinessErrorsInterceptor)
export class FotoController {
    constructor(private readonly fotoService: FotoService) {}
    @Get()
    async findAllFotos() {
      return await this.fotoService.findAllFotos();
    }
  
    @Get(':fotoId')
    async findFotoById(@Param('fotoId') fotoId: string) {
      return await this.fotoService.findFotoById(fotoId);
    }
  
    @Post()
    async createFoto(@Body() fotoDto: FotoDto) {
      const foto: FotoEntity = plainToInstance(FotoEntity, fotoDto);
      return await this.fotoService.createFoto(foto);
    }
  
    @Delete(':fotoId')
    @HttpCode(204)
    async deleteFoto(@Param('fotoId') fotoId: string) {
      return await this.fotoService.deleteFoto(fotoId);
    }
}
