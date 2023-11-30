import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ){}

    async findAllUsuarios(): Promise<UsuarioEntity[]> {
        return await this.usuarioRepository.find({ relations: ["redSocial, fotos"] });
    }

    async findUsuarioById(id: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id}, relations: ["redSocial, fotos"] } );
        if (!usuario)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
   
        return usuario;
    }

    async createUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        if (usuario.telefono.length != 10) {
            throw new BadRequestException('El telefono debe tener exactamente 10 caracteres');
        }
        return await this.usuarioRepository.save(usuario);
    }
}

