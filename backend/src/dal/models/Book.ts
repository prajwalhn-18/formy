import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    author: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ default: false })
    hasParts: boolean;

    @Column({ type: "text", nullable: true })
    frontmatter: string;

    @Column({ type: "text", nullable: true })
    backmatter: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany("Part", "book", { cascade: true })
    parts: any[];

    @OneToMany("Chapter", "book", { cascade: true })
    chapters: any[];
}
