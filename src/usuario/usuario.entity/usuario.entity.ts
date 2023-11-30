import { AlbumEntity } from '../../album/album.entity/album.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    nombre: string;

    @Column()
    telefono: string;

    @ManyToMany(() => AlbumEntity, (album) => album.performers)
    @JoinTable()
    albums: AlbumEntity[];
}
