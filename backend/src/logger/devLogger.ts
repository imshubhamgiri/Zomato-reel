import { createLogger, format, transports } from 'winston';

const { combine, timestamp, colorize, errors, splat, printf } = format;

const consoleFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaKeys = Object.keys(meta);
    const metaText = metaKeys.length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} [${level}] ${stack ?? message}${metaText}`;
});

const devLogger = createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(
        errors({ stack: true }),
        splat(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize({ all: true }),
        consoleFormat
    ),
    transports: [new transports.Console()]
});

export default devLogger;