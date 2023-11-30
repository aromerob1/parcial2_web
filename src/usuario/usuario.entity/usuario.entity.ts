import { FotoEntity } from 'src/foto/foto.entity/foto.entity';
import { AlbumEntity } from '../../album/album.entity/album.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { RedSocialEntity } from 'src/redSocial/redSocial.entity/redSocial.entity';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    telefono: string;

    @OneToMany(() => FotoEntity, (foto) => foto.usuario)
    fotos: FotoEntity[];

    @ManyToOne(() => RedSocialEntity, (redSocial) => redSocial.usuarios)
    redSocial: RedSocialEntity;
}
