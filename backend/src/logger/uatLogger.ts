import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, splat, json } = format;

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const uatLogger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        splat(),
        timestamp(),
        json()
    ),
    defaultMeta: { service: 'foodinreels-api', env: 'uat' },
    transports: [
        new transports.File({ filename: path.join(logsDir, 'uat-error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logsDir, 'uat-combined.log') }),
        new transports.Console()
    ]
});

export default uatLogger;
