const router = require('express').Router();
const UserForm = require('../models/UserForm');
const Callback = require('../models/Callback');
const multer = require('multer');
const verifyToken = require('../middlewares/verifyToken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary using environment variables
cloudinary.config({  
    cloud_name: 'dw1isccze', 
    api_key: 876615558131526, 
    api_secret: 'av927t74R8DBcWSyHW-imNciIcQ' 
});

const uploadFileToCloudinary = async (filePath) => {
    try {
        const res = await cloudinary.uploader.upload(filePath, { folder: 'Job' });
        return res.secure_url;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
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

router.post('/callback', async(req, res) => {
    try{
        const {number} = req.body;

        const call = new Callback({
            number
        });

        const savedCall = await call.save();
        
        res.status(201).json(savedCall);
    } catch (error) {
        console.error('Error creating callback:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get('/callback', async (req, res) => {
    try {
        const calls = await Callback.find().sort({createdAt: -1});
        res.status(200).json(calls);
    } catch (error) {
        console.error('Error fetching callback:');
    }
});

router.put('/callback/:id',async (req, res) => {
    try {
        const call = await Callback.findById(req.params.id);
        call.hasBeenCalled = true;
        const updatedCall = await call.save();
        res.status(200).json(updatedCall);
    } catch (error) {
        console.error('Error updating callback:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post('/form' ,upload.single('resume'), async (req, res) => {
    try {
      const { fullName, email, phone, designation, experience, field, linkedin, cities, stayUpdated } = req.body;
      const resumeUrl = await uploadFileToCloudinary(req.file.path);
      const userForm = new UserForm({
        fullName,
        email,
        phone,
        designation,
        experience,
        field,
        linkedin,
        cities, // Assuming cities is an array
        resume: resumeUrl,
        stayUpdated,
      });
      const savedUserForm = await userForm.save();
      res.status(201).json(savedUserForm);
    } catch (error) {
      console.error('Error creating user form:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get('/all',  async (req, res) => {
    try {
        const forms = await UserForm.find().sort({ timestamp: -1 });
        res.status(200).json(forms);
    } catch (error) {
        console.error('Error fetching user forms:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  


module.exports = router;    