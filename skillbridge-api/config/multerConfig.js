const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Ensure the image upload directory exists
const imageUploadPath = path.join(__dirname, '../uploads/course-images');
if (!fs.existsSync(imageUploadPath)) {
    fs.mkdirSync(imageUploadPath, { recursive: true });
}

// Ensure the video upload directory exists
const videoUploadPath = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(videoUploadPath)) {
    fs.mkdirSync(videoUploadPath, { recursive: true });
}

// Storage configuration for images
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageUploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Storage configuration for videos
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, videoUploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter for images
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    } 
};

// File filter for videos
const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

// Create multer instances
const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadVideo = multer({
    storage: videoStorage,
    fileFilter: videoFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Export both upload configurations
module.exports = { uploadImage, uploadVideo };
