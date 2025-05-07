const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'taskFiles';
        let allowedFormats = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx', 'svg', 'pptx', 'txt', 'zip'];

        if (file.fieldname === 'profilePic') {
            folder = 'profilePics';
            allowedFormats = ['jpg', 'jpeg', 'png'];
        }

        return {
            folder: folder,
            allowed_formats: allowedFormats,
            transformation: file.fieldname === 'profilePic'
                ? [{ width: 500, height: 500, crop: 'limit' }]
                : undefined,
        };
    },
});

module.exports = storage;
