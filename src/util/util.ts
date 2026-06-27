import fs from 'fs';
import path from 'path';
import {type Logger, transports, createLogger, format} from 'winston';

const {combine, timestamp, json, errors} = format;

export abstract class Util {
    public static commands: string[];
    public static log: Logger;
    public static userDataDir: string;
    public static databaseFile: string;

    static {
        // Set the user data directory based on the platform.
        if (process.platform === 'win32') {
            this.userDataDir = `${process.env.APPDATA}\\chd-oclif`;
        } else {
            this.userDataDir =
                process.platform === 'darwin'
                    ? `${process.env.HOME}/Library/Preferences/chd-oclif`
                    : `${process.env.HOME}/.local/share/chd-oclif`;
        }

        // Initialize list of existing commands.
        this.commands = fs.readdirSync(path.join(import.meta.dirname, '../commands'))
            .filter((file: string) => path.extname(file)?.toLowerCase() === '.ts') || [];

        // Initialize log configuration.
        this.log = createLogger({
            format: combine(timestamp(), errors({stack: true}), json()),
            transports: new transports.File({
                filename: this.userDataDir + '/log/error.log',
                level: 'error'
            })
        });

        // Initialize database file path.
        if (process.platform === 'win32') {
            this.databaseFile = this.userDataDir + '\\chd.db';
        } else {
            this.databaseFile = this.userDataDir + '/chd.db';
        }
    }
}