let jwt = require('jsonwebtoken')
require('dotenv').config();

// yahan pr next parameter ka use , so that jb middleware 'auth' ka kaam ho jaye tb fir
// dushere routes pr (isStudent ya fir isAdmin pr chale jaye)
exports.auth = (req, res, next) => {
    try {
        // abhi hm authentication karenge... aur iske liye hame token ka need hoga
        

        // token 3 jagha se nikaal skte h , cookie me se , request ki body me se , ya fir pata nahi... ek ek jagah hmne token send kiya to h..
        let token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        

        // ye jo tarika header se token nikaalna isko sampakjhte h
        // hmane request ke header me Authorization key ka value leke aaye aur fir isko replace kr diye... 
        // aur fir hmane replace kr diya "Bearer " ko empty string se

        // ye krne se hame token milega
        if (!token) {
            return res.status(401).json({
                success: false,
                message: `Token is not present`,
            })
        }

        // token ko verify krna , <--- is step se authorization ho gaya
        try {
            // hm yahan pr token ko decode karenge

            let decoded_token = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded_token);

            // ab hm request ki body me ye docoded msg daal denge
            req.decoded_token = decoded_token; // <-- It may or may not work
            // but why we have inculded it, coz, aage jaake hm request
            // ki body me se hi nikaal lenge role kya h (student?  ya fir  admin? ya fir kya)

        } catch (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: `Error while decoding the token`,
            })
        }
        next(); // <-- ab next middle ware ki aoor
    }
    catch(error)
    {
        return res.status(400).json({
            success: false,
            mesage: `Something went wrong while authentication`,
        })
    }
}

// 2nd middleware // <-- ye wala middle ware authorization check kr rahe h
exports.isStudent = (req,res,next) => {
    try{
        // isme hm phele check karenge ki user student h ya nahi
        if(req.decoded_token.role !=='Student')
        {
            return res.status(400).json({

                success: false,
                message: `Student role is not valid`
            })
        }

        next();

    }
    catch(error)
    {
        return res.status(400).json({
            success: false,
            mesage: `Something went wrong verfying role for student`,
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        // isme hm phele check karenge ki user student h ya nahi
        if(req.decoded_token.role !=='Admin')
        {
            return res.status(400).json({

                success: false,
                message: `Admin role is not valid`
            })
        }

        next();

    }
    catch(error)
    {
        return res.status(400).json({
            success: false,
            mesage: `Something went wrong verfying role for admin`,
        })
    }
}
