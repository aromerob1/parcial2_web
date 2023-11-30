import { Module } from '@nestjs/common';
import { PerformerService } from './performer.service';
import { PerformerEntity } from './usuario.entity/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [PerformerService],
  imports: [TypeOrmModule.forFeature([PerformerEntity])], 
})
export class PerformerModule {}
