import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { UsuarioService } from './usuario.service';

@Module({
  providers: [UsuarioService],
  imports: [TypeOrmModule.forFeature([UsuarioEntity])], 
})
export class PerformerModule {}
