const console = require('console');
const config = require('../../config/config');

class Logger {
    constructor() {
        this.colors = {
            black: '[30m',
            red: '[31m',
            green: '[32m',
            yellow: '[33m',
            blue: '[34m',
            magenta: '[35m',
            cyan: '[36m',
            white: '[37m',
        };

        // Assign console methods to the logger
        this.#consoleMethods();
    }

    #consoleMethods() {
        this.console = console.log;
        this.error = console.error;
        this.warn = console.warn;
        this.table = console.table;
        this.info = console.info;
        this.trace = console.trace;

        // Conditional debug logging
        if (config.NODE_ENV !== 'prod') {
            this.debug = this;
        }
    }

    #prepare(color, ...logs) {
        const formattedLogs = [];
        for (const log of logs) {
            formattedLogs.push(`\x1b${color}`);
            formattedLogs.push(
                typeof log === 'object' ? JSON.stringify(log, null, 2) : log,
            );
        }
        formattedLogs.push('\x1b[0m');
        this.console(...formattedLogs);
    }

    #logWithColor(color, ...logs) {
        if (this.colors[color]) {
            this.#prepare(this.colors[color], ...logs);
        } else {
            this.console(...logs); // Fallback to default console log if color not found
        }
    }

    black(...logs) {
        this.#logWithColor('black', ...logs);
    }

    red(...logs) {
        this.#logWithColor('red', ...logs);
    }

    green(...logs) {
        this.#logWithColor('green', ...logs);
    }

    yellow(...logs) {
        this.#logWithColor('yellow', ...logs);
    }

    blue(...logs) {
        this.#logWithColor('blue', ...logs);
    }

    magenta(...logs) {
        this.#logWithColor('magenta', ...logs);
    }

    cyan(...logs) {
        this.#logWithColor('cyan', ...logs);
    }

    white(...logs) {
        this.#logWithColor('white', ...logs);
    }
}

module.exports = new Logger();
