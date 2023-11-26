import { PerformerEntity } from '../../performer/performer.entity/performer.entity';
import { TrackEntity } from '../../track/track.entity/track.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';

@Entity()
export class AlbumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    caratula: string;

    @Column()
    fechaLanzamiento: Date;

    @Column()
    descripcion: string;

    @OneToMany(() => TrackEntity, (track) => track.album)
    tracks: TrackEntity[];

    @ManyToMany(() => PerformerEntity, (performer) => performer.albums)
    performers: PerformerEntity[];
}
