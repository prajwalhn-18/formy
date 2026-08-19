import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Chapter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: "text" })
    content: string;

    @Column()
    order: number;

    @ManyToOne("Book", "chapters", { onDelete: "CASCADE" })
    @JoinColumn({ name: "bookId" })
    book: any;

    @Column()
    bookId: number;

    @ManyToOne("Part", "chapters", { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "partId" })
    part: any;

    @Column({ nullable: true })
    partId: number;
}
