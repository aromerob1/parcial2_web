import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { AlbumEntity } from './album/album.entity/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotoEntity } from './foto/foto.entity/foto.entity';
import { RedSocialEntity } from './redSocial/redSocial.entity/redSocial.entity';
import { UsuarioEntity } from './usuario/usuario.entity/usuario.entity';
import { FotoModule } from './foto/foto.module';
import { RedSocialModule } from './redSocial/redSocial.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RedSocialController } from './redSocial/redSocial.controller';

@Module({
  imports: [AlbumModule, FotoModule, RedSocialModule, UsuarioModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'album',
      entities: [AlbumEntity, FotoEntity, RedSocialEntity, UsuarioEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
