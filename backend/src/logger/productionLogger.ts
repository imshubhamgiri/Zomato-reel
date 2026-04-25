import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, splat, json , colorize} = format;

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const productionLogger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        colorize({ all: true }),
        splat(),
        timestamp(),
        json()
    ),
    defaultMeta: { service: 'foodinreels-api', env: 'production' },
    transports: [
        new transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logsDir, 'combined.log') }),
        new transports.Console()
    ]
});

export default productionLogger;