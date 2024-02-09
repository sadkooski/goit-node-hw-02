const jwt = require('jsonwebtoken')
const  User  = require('../users/user.schema')
const gravatar = require('gravatar')
const Jimp = require('jimp')
const path = require('path');
const fs = require('fs');

async function register(req, res, next) {
try {
    const {email, password, subscription} = req.body
    
    if ( !email || !password ) {
        return res.status(400).json({ message: "missing required field" });
      }

    const avatarURL = gravatar.url(email)

    const user = new User({
        password: req.body.password,
        email: email,
        subscription: subscription,
        avatarURL: avatarURL
     })

    if (!user.checkIfUserExists(email)) {
       return res.status(409).json({ message: "Email in use" })
    }
     user.setPassword(req.body.password)

     await user.save()
     return res.status(201).json({ user: email, subscription: subscription, avatarURL: avatarURL })} 
     catch (err) {
    console.log(err)
       next(err)
     }
    } 

    async function login(req, res) {
        const {email, password} = req.body
        const user = await User.findOne({ email })
        
        if (!user) {
            return res.status(400).json({ message: error.details[0].message })
        }
        if (!user.validPassword(password)) {
            return res.status(401).json({
                "message": "Email or password is wrong"})  
        }
        
        const token = jwt.sign({
        id: user._id }, process.env.JWT_SECRET)
        
        user.token = token;
        await user.save();

        return res.json({
            data: {
                token,
            },
        })
        }
        
async function logOut(req, res, next) {
    try {
   const user = await User.findById(req.user._id);

   if(!user) {
    return res.status(401).json({message:"Not authorized"})
   }
   user.token = null;
   await user.save();
   res.status(204)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Wystąpił błąd podczas wylogowywania użytkownika.' })
    }
}

async function getUserData(req, res ,next) {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.status(200).json({
            email: user.email,
            subscription: user.subscription
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych użytkownika.' });
    }
}

async function updateAvatar(req, res, next) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const image = await Jimp.read(req.file.path);
        await image.resize(250, 250).writeAsync(req.file.path);

        const uniqueFileName = `${req.user.userId}-${Date.now()}${path.extname(req.file.originalname)}`;

        fs.renameSync(req.file.path, `public/avatars/${uniqueFileName}`);

        req.user.avatarURL = `/avatars/${uniqueFileName}`;

        user.avatarURL = req.user.avatarURL;
        await user.save();

        res.status(200).json({ avatarURL: req.user.avatarURL });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    login, 
    register,
    logOut,
    getUserData,
    updateAvatar,
}