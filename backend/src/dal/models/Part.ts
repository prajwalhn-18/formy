import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity()
export class Part {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column()
    order: number;

    @ManyToOne("Book", "parts", { onDelete: "CASCADE" })
    @JoinColumn({ name: "bookId" })
    book: any;

    @Column()
    bookId: number;

    @OneToMany("Chapter", "part", { cascade: true })
    chapters: any[];
}
