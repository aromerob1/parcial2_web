import { PerformerEntity } from '../../performer/performer.entity/performer.entity';
import { TrackEntity } from '../../track/track.entity/track.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';

@Entity()
export class FotoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    ISO: number;

    @Column()
    velObturacion: number;

    @Column()
    apertura: number;

    @Column()
    fecha: Date;

    

    @OneToMany(() => TrackEntity, (track) => track.album)
    tracks: TrackEntity[];

    @ManyToMany(() => PerformerEntity, (performer) => performer.albums)
    performers: PerformerEntity[];
}
