import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity/album.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { FotoEntity } from '../foto/foto.entity/foto.entity';
import { FotoService } from '../foto/foto.service';

describe('AlbumService', () => {
  let service: AlbumService;
  let fotoService: FotoService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService, FotoService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    fotoService = module.get<FotoService>(FotoService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumsList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await repository.save({
        fechaInicio: faker.date.past(), 
        fechaFin: faker.date.future(), 
        titulo: faker.lorem.text()}); 
        albumsList.push(album);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  //create
  it('create should return a new album', async () => {
    const album: AlbumEntity = {
      id: "",
      fechaInicio: faker.date.past(), 
      fechaFin: faker.date.future(), 
      titulo: faker.lorem.text(), 
      fotos: []
    }
 
    const newAlbum: AlbumEntity = await service.createAlbum(album);
    expect(newAlbum).not.toBeNull();
 
    const storedAlbum: AlbumEntity = await repository.findOne({where: {id: newAlbum.id}})
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.fechaInicio).toEqual(newAlbum.fechaInicio)
    expect(storedAlbum.fechaFin).toEqual(newAlbum.fechaFin)
    expect(storedAlbum.titulo).toEqual(newAlbum.titulo)
  });

  it("create with empty title should return an exception", async () => {
    const album: AlbumEntity = {
      id: "",
      fechaInicio: faker.date.past(),
      fechaFin: faker.date.future(),
      titulo: "",
      fotos: [],
    };

    await expect(service.createAlbum(album)).rejects.toHaveProperty(
      "message",
      "El titulo no puede ser vacio"
    );

    const storedAlbum: AlbumEntity = await repository.findOne({
      where: { id: album.id },
    });
    expect(storedAlbum).toBeNull();
  });

  //findById
  it('findAlbumById should return a album by id', async () => {
    const storedAlbum: AlbumEntity = albumsList[0];
    const album: AlbumEntity = await service.findAlbumById(storedAlbum.id);
    expect(album).not.toBeNull();
    expect(album.fechaInicio).toEqual(storedAlbum.fechaInicio)
    expect(album.fechaFin).toEqual(storedAlbum.fechaFin)
    expect(album.titulo).toEqual(storedAlbum.titulo)
  });

  it('findAlbumById should throw an exception for an invalid album', async () => {
    await expect(() => service.findAlbumById("0")).rejects.toHaveProperty("message", "The album with the given id was not found")
  });

  //addPhotoToAlbum
  it('addPhotoToAlbum should add a photo to an album', async () => {
    const album: AlbumEntity = albumsList[0];
    const foto: FotoEntity = {
      id: "",
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      fecha: album.fechaInicio,
      usuario: null,
      album: null,
    };
    const newFoto: FotoEntity = await fotoService.createFoto(foto);

    const newAlbum: AlbumEntity = await service.addPhotoToAlbum(album.id, newFoto.id);
    expect(newAlbum).not.toBeNull();

    const fotoInAlbum = newAlbum.fotos.find(f => f.ISO === newFoto.ISO && f.velObturacion === newFoto.velObturacion && f.apertura === newFoto.apertura && f.fecha.getTime() === newFoto.fecha.getTime());
    expect(fotoInAlbum).toBeDefined();
  });

  it('addPhotoToAlbum should throw an exception for an invalid album', async () => {
    const foto: FotoEntity = {
      id: "",
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      fecha: faker.date.past(),
      usuario: null,
      album: null,
    };
    const newFoto: FotoEntity = await fotoService.createFoto(foto);

    await expect(() => service.addPhotoToAlbum("0", newFoto.id)).rejects.toHaveProperty("message", "The album with the given id was not found")
  });

  //delete
  it('delete should remove a album', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.deleteAlbum(album.id);
    const deletedAlbum: AlbumEntity = await repository.findOne({ where: { id: album.id } })
    expect(deletedAlbum).toBeNull();
  });

  it('delete should throw an exception for an invalid album', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.deleteAlbum(album.id);
    await expect(() => service.deleteAlbum("0")).rejects.toHaveProperty("message", "The album with the given id was not found")
  });
});
