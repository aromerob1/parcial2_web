import { FotoEntity } from '../../foto/foto.entity/foto.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { RedSocialEntity } from '../../redSocial/redSocial.entity/redSocial.entity';

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
