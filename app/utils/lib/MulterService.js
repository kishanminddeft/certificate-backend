const multer = require('multer');
const enums = require('../../../enum');

class MulterService {
    createUploadInstance(fieldName, maxFileSizeInMb, multipleFiles = false) {
        const storageDisk = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, process.cwd() + '/uploads');
            },
            filename: (req, file, callback) => {
                callback(null, new Date().getTime() + '_' + file.originalname);
            },
        });

        const fileFilterDisk = function (req, file, cb) {
            let allowedMimes = [];
            let errMsg =
                'Invalid file type. Only __REPLACE_MSG__ files are allowed';

            if (file.fieldname === 'video') {
                allowedMimes = enums.supportedVideoType;
                errMsg = errMsg.replace('__REPLACE_MSG__', 'MP4');
            } else {
                allowedMimes = enums.supportedImageType;
                errMsg = errMsg.replace('__REPLACE_MSG__', 'JPG, JPEG, PNG');
            }

            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(
                    {
                        success: false,
                        message: errMsg,
                    },
                    false,
                );
            }
        };

        const oMulterObjDisk = {
            storage: storageDisk,
            fileFilter: fileFilterDisk,
            limits: {
                fileSize: maxFileSizeInMb * 1024 * 1024, // 10mb
            },
        };

        if (multipleFiles) {
            // return multer(oMulterObjDisk).any();
            return multer(oMulterObjDisk).fields([
                {
                    name: 'image',
                    maxCount: 1,
                },
                {
                    name: 'video',
                    maxCount: 1,
                },
            ]);
        } else {
            return multer(oMulterObjDisk).single(fieldName);
        }
    }
}

// const services = {};

// services.createUploadInstance = (
//     fieldName,
//     maxFileSizeInMb,
//     multipleFiles = false,
// ) => {
//     const storageDisk = multer.diskStorage({
//         destination: (req, file, callback) => {
//             callback(null, process.cwd() + '/uploads');
//         },
//         filename: (req, file, callback) => {
//             callback(null, new Date().getTime() + '_' + file.originalname);
//         },
//     });

//     const fileFilterDisk = function (req, file, cb) {
//         let allowedMimes = [];
//         let errMsg =
//             'Invalid file type. Only __REPLACE_MSG__ files are allowed';

//         if (file.fieldname === 'video') {
//             allowedMimes = enums.supportedVideoType;
//             errMsg = errMsg.replace('__REPLACE_MSG__', 'MP4');
//         } else {
//             allowedMimes = enums.supportedImageType;
//             errMsg = errMsg.replace('__REPLACE_MSG__', 'JPG, JPEG, PNG');
//         }

//         if (allowedMimes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(
//                 {
//                     success: false,
//                     message: errMsg,
//                 },
//                 false,
//             );
//         }
//     };

//     const oMulterObjDisk = {
//         storage: storageDisk,
//         fileFilter: fileFilterDisk,
//         limits: {
//             fileSize: maxFileSizeInMb * 1024 * 1024, // 10mb
//         },
//     };

//     if (multipleFiles) {
//         // return multer(oMulterObjDisk).any();
//         return multer(oMulterObjDisk).fields([
//             {
//                 name: 'image',
//                 maxCount: 1,
//             },
//             {
//                 name: 'video',
//                 maxCount: 1,
//             },
//         ]);
//     } else {
//         return multer(oMulterObjDisk).single(fieldName);
//     }
// };

module.exports = new MulterService();
