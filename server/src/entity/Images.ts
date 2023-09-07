import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Images {

    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    Original_image: string = '';

    @Column()
    Compressed_image: string = '';

}
