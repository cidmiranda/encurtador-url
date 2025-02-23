import { User } from 'src/user/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId?: string

    @Column({ unique: true })
    urlCode: string;

    @Column()
    longUrl: string;

    @Column()
    shortUrl: string;

    @Column()
    clicks: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => User, (user) => user.urls, { nullable: true })
    @JoinColumn({ name: 'userId', referencedColumnName: "id" })
    user?: User
}