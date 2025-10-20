const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Woderlust',
    // format: ["png","jpg"], // supports promises as well
    public_id: (req, file) => `${Date.now()}_${file.originalname.split('.')[0]}`,
  },
});


module.exports={storage};