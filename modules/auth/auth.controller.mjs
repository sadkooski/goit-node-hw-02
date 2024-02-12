import jwt from 'jsonwebtoken';
import User from '../users/user.schema.mjs';
import gravatar from 'gravatar';
import Jimp from 'jimp';
import path from 'path';
import fs from 'fs';
import nanoid from 'nanoid';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function register(req, res, next) {
try {
    const {email, password, subscription} = req.body
    
    if ( !email || !password ) {
        return res.status(400).json({ message: "missing required field" });
      }
    const avatarURL = gravatar.url(email)
    const verificationToken = nanoid();
    const user = new User({
        password: req.body.password,
        email: email,
        subscription: subscription,
        avatarURL: avatarURL,
        verificationToken: verificationToken,
        verify: false
     })

    if (!user.checkIfUserExists(email)) {
       return res.status(409).json({ message: "Email in use" })
    }

     user.setPassword(req.body.password)
    
  const verifyLink = `${req.protocol}://${req.get('host')}/auth/users/verify/${verificationToken}`;
     const msg = {
        to: 'mrproskar@gmail.com',
        from: 'mrproskar@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: `Click the link below to verify your email:\n${verifyLink}`,
        html: `<p>Click the link below to verify your email:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`
      };
      await sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch(error => {
        console.error(error);
      });
    
     await user.save()
     return res.status(201).json({ user: email, subscription: subscription, avatarURL: avatarURL })}

     catch (err) {
    console.log(err)
       next(err)
     }
    } 

export async function login(req, res) {
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
        
export async function logOut(req, res, next) {
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

export async function getUserData(req, res ,next) {
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

export async function updateAvatar(req, res, next) {
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

export async function verify(req, res) {
    try {
        const verificationToken  = req.params.verificationToken;
        console.log('teoken', verificationToken)
        const user = await User.findOne({verificationToken: verificationToken});

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.verificationToken = 0;
        user.verify = true;
        await user.save();

        return res.status(200).json({ message: 'Verification successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function resend(req, res) {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: "Missing required field email" });
        }

        const user = await User.findOne({email: email});
        if (user.verify === true) {
            return res.status(400).json({ message: "Verification has already been passed" });
        }

            const verifyLink = `${req.protocol}://${req.get('host')}/auth/users/verify/${user.verificationToken}`;
            const msg = {
               to: 'mrproskar@gmail.com',
               from: 'mrproskar@gmail.com',
               subject: 'Sending with SendGrid is Fun',
               text: `Click the link below to verify your email:\n${verifyLink}`,
               html: `<p>Click the link below to verify your email:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`
             };
             await sgMail
             .send(msg)
             .then(() => {
               console.log('Email sent');
             })
             .catch(error => {
               console.error(error);
             });

        return res.status(200).json({ message: "Verification email sent" })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

