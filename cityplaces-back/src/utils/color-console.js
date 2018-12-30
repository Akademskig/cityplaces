
import chalk from 'chalk'
export class ColorConsole {
	constructor() { }

	red(msg) {
		console.log(chalk.red(msg))
	}
	blue(msg) {
		console.log(chalk.cyanBright(new Date(), '|'), chalk.blue(msg))
	}

	cyan(msg) {
		console.log(chalk.cyan(msg))
	}

	purple(msg) {
		console.log(chalk.cyanBright(new Date(), '|'), chalk.magenta(msg))
	}

	green(msg) {
		console.log(chalk.greenBright(msg))
	}
}