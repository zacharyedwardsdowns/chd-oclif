import {type Hook, loadHelpClass} from '@oclif/core';
import fs from 'fs';
import chalk from 'chalk';
import {Db} from '../../util/db.ts';
import {Util} from '../../util/util.ts';
import type {Directory} from '../../objects/directory.ts';

const slash: string = process.platform === 'win32' ? '\\' : '/';

const hook: Hook<'command_not_found'> = async function (options): Promise<void> {
    let extra: string = '';
    let name: string | undefined = process.argv[2];

    if (!name) {
        const Help = await loadHelpClass(this.config);
        await new Help(this.config).showHelp([])
        return;
    }

    if (name.includes('\\') || name.includes('/')) {
        if (process.platform === 'win32' && name.includes('/')) {
            name = name.replace(/\//g, '\\');
        }

        const index: number = name.indexOf(slash);
        extra = slash + name.slice(index + 1);
        name = name.slice(0, index);
    }

    try {
        let directory: Directory | undefined = Db.retrieveFromList(name);

        if (!directory) {
            console.log(chalk.yellowBright(`No directory named '${name}' exists`));
            return;
        }

        let path: string = directory.path;
        path += extra;

        if (!fs.existsSync(path)) {
            console.log(
                chalk.yellowBright(`The directory '${path}' does not exist`)
            );
            return;
        }

        console.log(path);
    } catch (error) {
        console.log(chalk.red('Failed to cd to the given directory!'));
        console.log(chalk.red('Check error.log for more details'));
        Util.log.error(error);
    }
};

export default hook;