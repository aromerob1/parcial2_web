import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { faker } from '@faker-js/faker';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    try {
      repository.clear();
      usuariosList = [];
      for (let i = 0; i < 5; i++) {
        const usuario: UsuarioEntity = await repository.save({
          nombre: faker.person.fullName(),
          telefono: faker.phone.number(),
        });
        usuariosList.push(usuario);
      }
    } catch (error) {
      console.error('Error during test setup:', error);
    }
  };

  //create
  it('create should return a new usuario', async () => {
    const usuario: UsuarioEntity = {
      id: "",
      nombre: faker.person.fullName(),
      telefono: "1234567890",
      fotos: [],
      redSocial: null,
    };

    const newUsuario: UsuarioEntity = await service.createUsuario(usuario);
    expect(newUsuario).not.toBeNull();

    const storedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: newUsuario.id },
    });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.nombre).toEqual(newUsuario.nombre);
    expect(storedUsuario.telefono).toEqual(newUsuario.telefono);
  });

  it('create with telefono length not equal to 10 should throw an exception', async () => {
      const usuario: UsuarioEntity = {
        id: "",
        nombre: faker.person.fullName(),
        telefono: "12345",
        fotos: [],
        redSocial: null,
      };
   
      await expect(service.createUsuario(usuario)).rejects.toHaveProperty("message", "El telefono debe tener exactamente 10 caracteres");


      const storedUsuario: UsuarioEntity = await repository.findOne({
        where: { id: usuario.id },
      });
      expect(storedUsuario).toBeNull();
  });

  //findById
  it('findUsuarioById should return a usuario by id', async () => {
      const storedUsuario: UsuarioEntity = usuariosList[0];
      const usuario: UsuarioEntity = await service.findUsuarioById(storedUsuario.id);
      expect(usuario).not.toBeNull();
      expect(usuario.nombre).toEqual(storedUsuario.nombre)
      expect(usuario.telefono).toEqual(storedUsuario.telefono)
  });

  it('findUsuarioById with wrong id should throw an exception', async () => {
    await expect(() => service.findUsuarioById("0")).rejects.toHaveProperty("message", "The user with the given id was not found")
  });

  //findAll
  it('findAll should return all usuarios', async () => {
      const usuarios: UsuarioEntity[] = await service.findAllUsuarios();
      expect(usuarios).not.toBeNull();
      expect(usuarios.length).toEqual(usuariosList.length);
  });

});
