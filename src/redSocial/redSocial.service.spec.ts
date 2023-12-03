import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedSocialEntity } from './redSocial.entity/redSocial.entity';
import { RedSocialService } from './redSocial.service';
import { faker } from '@faker-js/faker';

describe('RedSocialService', () => {
  let service: RedSocialService;
  let repository: Repository<RedSocialEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RedSocialService],
    }).compile();

    service = module.get<RedSocialService>(RedSocialService);
    repository = module.get<Repository<RedSocialEntity>>(getRepositoryToken(RedSocialEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //create
  it('create should return a new redSocial', async () => {
      const redSocial: RedSocialEntity = {
        id: "",
        nombre: faker.company.name(),
        slogan: faker.lorem.sentence({min: 20, max: 30}),
        usuarios: [],
      }
   
      const newRedSocial: RedSocialEntity = await service.createRedSocial(redSocial);
      expect(newRedSocial).not.toBeNull();
   
      const storedRedSocial: RedSocialEntity = await repository.findOne({where: {id: newRedSocial.id}})
      expect(storedRedSocial).not.toBeNull();
      expect(storedRedSocial.nombre).toEqual(newRedSocial.nombre)
      expect(storedRedSocial.slogan).toEqual(newRedSocial.slogan);
  });

  it('create with empty slogan should throw an exception', async () => {
    const redSocial: RedSocialEntity = {
      id: "",
      nombre: faker.company.name(),
      slogan: "",
      usuarios: [],
    }
 
    await expect(service.createRedSocial(redSocial)).rejects.toHaveProperty("message", "El slogan no puede estar vacio.");


    const storedRedSocial: RedSocialEntity = await repository.findOne({
      where: { id: redSocial.id },
    });
    expect(storedRedSocial).toBeNull();
  });
});
