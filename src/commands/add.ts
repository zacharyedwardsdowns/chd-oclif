import {Args, Command} from '@oclif/core';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import confirm from '@inquirer/confirm';
import {Util} from '../util/util.ts';
import {Db} from '../util/db.ts';
import type {Directory} from '../objects/directory.ts';

export default class Add extends Command {
    static override description: string = 'Adds directory to list so it can be accessed via alias';

    static override examples: string[] = [
        '<%= config.bin %> <%= command.id %> alias ./directory'
    ];

    static override args = {
        name: Args.string({description: 'alias for directory'}),
        directory: Args.string({description: 'directory to add to the list'})
    };

    public async run(): Promise<void> {
        const {args} = await this.parse(Add);
        const {name, directory} = args;

        if (!name || !directory) {
            console.log(chalk.yellowBright('Must provide both a name and directory'));
            return;
        }

        if (Util.commands.includes(name)) {
            console.log(chalk.yellowBright('Name cannot be an existing chd command'));
            console.log(chalk.gray('Commands:'), chalk.gray(...Util.commands));
            return;
        }

        if (name.includes('\\') || name.includes('/')) {
            console.log(
                chalk.yellowBright('Name cannot include the characters \'\\\' or \'/\'')
            );
            return;
        }

        if (!directory || !fs.existsSync(directory)) {
            console.log(chalk.yellowBright('Must provide a valid directory'));
            return;
        }

        return this.addHelper(name, path.resolve(directory));
    }

    private async addHelper(name: string, absolute: string): Promise<void> {
        let directory: Directory | undefined;
        let doReturn: boolean = false;

        try {
            directory = Db.retrieveFromList(name);
        } catch (error) {
            this.logError(error);
            return;
        }

        if (directory) {
            console.log(chalk.yellowBright(`The name '${name}' already exists`));
            doReturn = true;
        } else {
            try {
                directory = Db.retrieveFromListByPath(absolute);
            } catch (error) {
                this.logError(error);
                return;
            }

            if (directory) {
                doReturn = await this.inquireDuplicate(directory.name);
            }
        }

        if (doReturn) {
            console.log(chalk.gray('Directory was not added'));
            return;
        }

        try {
            Db.addToList(name, absolute);
        } catch (error) {
            this.logError(error);
            return;
        }

        console.log(
            chalk.greenBright(`You may now use 'chd ${name}' to cd to '${absolute}'`)
        );
    }

    private async inquireDuplicate(name: string): Promise<boolean> {
        console.log(
            chalk.yellowBright(`This directory already exists under '${name}'\n`)
        );

        try {
            const answer: boolean = await confirm({message: 'Would you like to have it under both names?'});
            console.log('');
            return !answer;
        } catch (error: any) {
            console.log(chalk.red('Failed to load prompt...'));
            console.log(chalk.red('Check error.log for more details\n'));
            Util.log.error(error);
            return true;
        }
    }

    private logError(error: any): void {
        console.log(chalk.red('Failed to add directory'));
        console.log(chalk.red('Check error.log for more details'));
        Util.log.error(error);
    }
}
