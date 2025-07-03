const globalCache = require('./lib/node_cache');
const sequelize = require('./lib/postgres');
const multerService = require('./lib/MulterService');
const nodeMailerService = require('./lib/NodeMailerService');
const uploaderService = require('./lib/UploaderService');

module.exports = {
    multerService,
    uploaderService,
    nodeMailerService,
    globalCache,
    sequelize,
};
