const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const routes = require('./routes');
const config = require('../../config/config');
const { log } = require('../../helpers');

class Router {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.corsConfig = {
            origin: '*',
            methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
        };
    }

    initialize() {
        this.configureMiddleware();
        this.startServer();
    }

    configureMiddleware() {
        this.app.disable('etag');
        this.app.enable('trust proxy');
        this.app.use(cors(this.corsConfig));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(bodyParser.json({ limit: '16mb' }));
        this.app.use(
            bodyParser.urlencoded({
                limit: '16mb',
                extended: true,
                parameterLimit: 50000,
            }),
        );

        if (config.NODE_ENV !== 'prod') {
            this.app.use(
                morgan('dev', {
                    skip: (req) =>
                        req.path === '/health-check' ||
                        req.path === '/favicon.ico',
                }),
            );
        }
        this.app.use(express.static('./seeds'));
        this.app.use(this.handleRequest.bind(this));
        this.app.use('/api/v1', routes);
        this.app.use('*', this.notFoundHandler.bind(this));
        this.app.use(this.errorLogger.bind(this));
        this.app.use(this.globalErrorHandler.bind(this));
    }

    startServer() {
        this.server.timeout = 10000;
        console.warn(`${config.SITE_NAME}-Backend`);
        this.server.listen(config.PORT, '0.0.0.0', () =>
            log.green(`Listening on port ${config.PORT}`),
        );
    }

    handleRequest(req, res, next) {
        req.remoteAddress =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (req.path === '/health-check') {
            return res.status(200).json({ message: 'OK' });
        }
        res.reply = ({ code, message }, data = {}, headers = {}) => {
            res.status(code).set(headers).json({ message, data });
        };
        next();
    }

    notFoundHandler(req, res) {
        res.status(404).json({ message: 'Route not found' });
    }

    errorLogger(err, req, res, next) {
        log.error(`${req.method} ${req.url}`);
        log.error('Request body:', req.body);
        log.error('Error stack:', err.stack);
        next(err);
    }

    globalErrorHandler(err, req, res) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = new Router();
