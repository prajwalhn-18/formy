import { DataSource } from "typeorm";
import { User } from "./models/User.js";
import { Book } from "./models/Book.js";
import { Part } from "./models/Part.js";
import { Chapter } from "./models/Chapter.js";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: true,
    logging: false,
    entities:  [User, Book, Part, Chapter],
    logger: "advanced-console"
});