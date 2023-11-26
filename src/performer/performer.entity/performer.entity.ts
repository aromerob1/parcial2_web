import { AlbumEntity } from '../../album/album.entity/album.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class PerformerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => AlbumEntity, (album) => album.performers)
    @JoinTable()
    albums: AlbumEntity[];
}
