const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'taskFiles';
        let allowedFormats = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx', 'svg', 'pptx', 'txt', 'zip'];
        let resourceType = 'raw';

        if (file.fieldname === 'profilePic') {
            folder = 'profilePics';
            allowedFormats = ['jpg', 'jpeg', 'png'];
            resourceType = 'image';
        }

        return {
            folder: folder,
            allowed_formats: allowedFormats,
            resource_type: resourceType, // <-- this line is important
            transformation:
                file.fieldname === 'profilePic'
                    ? [{ width: 500, height: 500, crop: 'limit' }]
                    : undefined,
        };
    },
});
