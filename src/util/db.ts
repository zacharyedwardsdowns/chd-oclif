import {type Directory} from '../objects/directory.ts';
import chalk from 'chalk';
import {Util} from './util.ts';
import BetterSQLite3, {type Statement, type Database} from 'better-sqlite3';

export abstract class Db {
    private static database: Database | undefined;

    static {
        try {
            // Create db and table if they don't exist
            this.database = new BetterSQLite3(Util.databaseFile);
            this.database.exec('CREATE TABLE IF NOT EXISTS chdlist(name TEXT PRIMARY KEY, path TEXT NOT NULL)');
        } catch (error) {
            this.logError(error);
        }
    }

    public static retrieveEntireList(): Directory[] | undefined {
        if (this.database) {
            const statement: Statement<[], Directory> = this.database.prepare('SELECT name, path FROM chdlist');
            return statement.all();
        } else {
            this.logUninitialized();
        }
    }

    public static retrieveFromList(name: string): Directory | undefined {
        if (this.database) {
            const statement: Statement<[string], Directory> = this.database.prepare('SELECT name, path FROM chdlist WHERE name = ?');
            return statement.get(name);
        } else {
            this.logUninitialized();
        }
    }

    public static retrieveFromListByPath(path: string): Directory | undefined {
        if (this.database) {
            const statement: Statement<[string], Directory> = this.database.prepare('SELECT name, path FROM chdlist WHERE path = ?');
            return statement.get(path);
        } else {
            this.logUninitialized();
        }
    }

    public static addToList(name: string, path: string): void {
        if (this.database) {
            const statement: Statement<[string, string]> = this.database.prepare('INSERT INTO chdlist (name, path) VALUES (?, ?)');
            statement.run(name, path);
        } else {
            this.logUninitialized();
        }
    }

    public static deleteFromList(name: string): void {
        if (this.database) {
            const statement: Statement<[string]> = this.database.prepare('DELETE FROM chdlist WHERE name = ?');
            statement.run(name);
        } else {
            this.logUninitialized();
        }
    }

    public static renameKeyInList(name: string, newName: string): void {
        if (this.database) {
            const statement: Statement<[string, string]> = this.database.prepare('UPDATE chdlist SET name = ? WHERE name = ?');
            statement.run(newName, name);
        } else {
            this.logUninitialized();
        }
    }

    private static logUninitialized(): void {
        const errorMessage = 'Database connection is not initialized.';
        console.log(chalk.red(errorMessage));
        Util.log.error(errorMessage);
    }

    private static logError(error: any): void {
        console.log(chalk.red('Failed to setup the SQLite database'));
        console.log(chalk.red('Check error.log for more details'));
        Util.log.error(error);
    }
}