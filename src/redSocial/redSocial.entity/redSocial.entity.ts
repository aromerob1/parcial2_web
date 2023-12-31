import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class RedSocialEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    slogan: string;

    @OneToMany(() => UsuarioEntity, (usuario) => usuario.redSocial)
    usuarios: UsuarioEntity[];
}
