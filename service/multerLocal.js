import multer from 'multer';
import { AppError } from '../utils/classError.js';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';



export const validExtension = {
    image: ["image/png"],
    pdf: ["application/pdf"],
    video: ["video/mp4", "video/mkv"],
}


// export const multerLocal = (customValidation = ["image/png"], customPath = "Generals") => {
//     const allPath = path.resolve(`uploads/${customPath}`)
//     if (!fs.existsSync(allPath)) {
//         fs.mkdirSync(allPath, { recursive: true })
//     }

//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, allPath)
//         },

//         filename: function (req, file, cb) {
//             cb(null, nanoid(5) + file.originalname)
//         }
//     })

//     const fileFilter = function (req, file, cb) {
//         if (customValidation.includes(file.mimetype)) {
//             return cb(null, true)
//         }
//         cb(new AppError("This file is not supported"), false)
//     }

// const upload = multer({fileFilter, storage})
// return upload
// }


export const multerHost = (customValidation = ["image/png", "image/jpeg", "image/jpg"]) => {

    const storage = multer.diskStorage({});

    const fileFilter = function (req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            return cb(null, true);
        }
        cb(new AppError("This file is not supported"), false);
    }

    const upload = multer({fileFilter, storage});
    return upload;
}
