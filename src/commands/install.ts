import {Command} from '@oclif/core';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const project = 'chd-oclif';

export default class Add extends Command {
    static override description: string = 'Installation instructions for supported systems';

    static override examples: string[] = [
        '<%= config.bin %> <%= command.id %>'
    ];

    public async run(): Promise<void> {
        let dir = path.dirname(fileURLToPath(import.meta.url));
        dir = dir.substring(0, dir.indexOf(project) + project.length);

        if (process.platform === 'win32') {
            console.log(chalk.cyanBright('----------------'));
            console.log(chalk.cyanBright(' Command Prompt '));
            console.log(chalk.cyanBright('----------------'));
            console.log(chalk.cyanBright('Add the following directory to PATH'));
            console.log(chalk.cyanBright(dir));
            console.log('');
            console.log(chalk.cyanBright('----------------'));
            console.log(chalk.cyanBright('   Powershell   '));
            console.log(chalk.cyanBright('----------------'));
            console.log(
                chalk.cyanBright(
                    'Add the following to C:\\Users\\<User>\\Documents\\WindowsPowerShell\\profile.ps1'
                )
            );
            console.log(chalk.cyanBright(`Set-Alias chd '${dir}\\chd.ps1'`));
        } else {

            console.log(chalk.cyanBright(`To finish installation append the following to your relevant alias file:`));
            console.log(chalk.bgBlack(chalk.magenta(`alias chd='. ${dir}/chd.sh'\n`)));
        }
    }
}
