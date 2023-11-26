import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity/track.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
