const { messageHelper } = require('../../../helpers');
const multerService = require('./MulterService');

const imageInstance = multerService.createUploadInstance('uploadfile', 5);

const imageVideoInstance = multerService.createUploadInstance('', 20, true);

class UploaderService {
    uploadFile(fileType = 'image') {
        return (req, res, next) => {
            if (fileType === 'image') {
                return imageInstance(req, res, function (error) {
                    if (error) {
                        return res.reply(
                            messageHelper.badRequest(error.message),
                        );
                    }
                    return next(null, null);
                });
            } else if (fileType === 'image+video') {
                return imageVideoInstance(req, res, function (error) {
                    if (error) {
                        return res.reply(
                            messageHelper.badRequest(error.message),
                        );
                    }
                    return next(null, null);
                });
            } else {
                return next(null, null);
            }
        };
    }
}

// const services = {};

// services.uploadFile = (fileType = 'image') => {
//     return (req, res, next) => {
//         if (fileType === 'image') {
//             return imageInstance(req, res, function (error) {
//                 if (error) {
//                     return res.reply(messageHelper.badRequest(error.message));
//                 }
//                 return next(null, null);
//             });
//         } else if (fileType === 'image+video') {
//             return imageVideoInstance(req, res, function (error) {
//                 if (error) {
//                     return res.reply(messageHelper.badRequest(error.message));
//                 }
//                 return next(null, null);
//             });
//         } else {
//             return next(null, null);
//         }
//     };
// };

module.exports = new UploaderService();
