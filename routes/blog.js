const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const Blog = require('../models/Blog');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary using environment variables
cloudinary.config({  
    cloud_name: 'dw1isccze', 
    api_key: 876615558131526, 
    api_secret: 'av927t74R8DBcWSyHW-imNciIcQ' 
});

const uploadImageToCloudinary = async (filePath) => {
    try {
        const res = await cloudinary.uploader.upload(filePath, { folder: 'blog' });
        return res.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/create',upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const thumbnailPath = req.file?.path || '';
        const thumbnailUrl = await uploadImageToCloudinary(thumbnailPath);
        const blog = new Blog({
            title,
            content,
            thumbnail: thumbnailUrl,
        });
        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/all' ,async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:id',async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.status(200).json(blog);
    } catch (err){
        console.log(err)
    }
});

router.delete('/delete/:id',async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json(blog);
    } catch (err){
        console.log(err)
    }
})

module.exports = router;
