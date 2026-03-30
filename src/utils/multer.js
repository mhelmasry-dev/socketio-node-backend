import multer from 'multer';
import path from 'path';

const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg', '.jfif'];
export const fileValidation = {
    image: [
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'image/jpg', 
        'image/bmp', 
        'image/webp', 
        'image/tiff', 
        'image/svg+xml', 
        'image/jfif',
        'image/pjpeg', 
        'application/octet-stream' // إضافة هذا النوع لتغطية الملفات غير المحددة
    ],
    file: [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'text/plain', 
        'application/rtf', 
        'application/vnd.oasis.opendocument.text'
    ],
    video: [
        'video/mp4', 
        'video/x-msvideo', 
        'video/x-matroska', 
        'video/webm', 
        'video/quicktime', 
        'video/mpeg', 
        'video/ogg'
    ]
};

export function fileUpload(customValidation = []) {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        console.log(`File mimetype: ${file.mimetype}`);
        console.log(`File extension: ${ext}`);

        if (customValidation.includes(file.mimetype) || allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(`In-valid file format: ${file.mimetype} with extension ${ext}`, false);
        }
    }

    const upload = multer({ fileFilter, storage });
    return upload;
}
