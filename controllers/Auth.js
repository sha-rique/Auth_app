let bcrypt = require('bcrypt')
let User = require('../models/User')
let jwt = require(`jsonwebtoken`)
require(`dotenv`).config();


exports.signup = async (req, res) => {
    try {

        let { name, email, password, role } = req.body;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already Exixt'
            })
        }

        // seccure password
        let hashed_password;
        try {
            // is method se hm password ko hash krte h... isme 2 argument jaynge... 1st is jo password h wo, and 2nd is number of rounds
            hashed_password = await bcrypt.hash(password, 10); // <--  yahan pr stratagy ye bhi ho sakta h.. ki hm 3 se 4 baar try karen... 
            // password ko hash krne ka , fir jaake error message show kare.
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: `Error in hasing password`,
            });
        }

        // create entry in db
        let user = await User.create(
            {
                name,
                email,
                password: hashed_password,
                role
            }
        )

        return res.status(200).json({
            success: true,
            message: `User added successfly`
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            success: false,
            message: `Error in registering user, try again later`,
        });
    }
    


}

exports.login= async (req, res) => {
    try{
        let {email, password} = req.body;
        if (!email || !password)
        {
            return res.status(400).json({
                success: false,
                message :`Please enter all details`
            })
        }

        let user = await User.findOne({email});

        if(!user)
        {
            return res.status(401).json({
                success: false,
                message : `User not register, Please SignUp first`,
            })
        };

        let payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        // now we will do password verification
        // with the help of verification function of bcrypt
        if(await bcrypt.compare(password,user.password))
        {
            // agar password corret hua to... login karayenge...
            // to fir cokkies , jwt wagera banana hoga...

            // sign function me 2 parameters use hoga... 1.Payload  2.jwt secrter
            let token = jwt.sign(payload,process.env.secret,{
                expiresIn: "2hr" 
            });

            // hm user ka file ko object me convert karnge..
            user= user.toObject();
            // ab hm token ko user ka OBJECT me store karenge
            user.token=token;
            //  aur password bhi hata denge.. so that jb responce send kare... to fir passsword uske sath na chala jaye
            user.password= undefined;

            // hme cookie ke liye option bhi banana hoga...
            let option = {
                // is option me hm cookie ka expire time likhenge...
                expires : new Date( Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }


            // ab hm cookie banayenge 
            res.cookie("token", token, option).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in successfully",
            })


        }
        else
        {
            return res.status(403).json({
                succes: false,
                message : `Password not match`
            })
        }
    }
    catch (err)
    {
        console.log(err)
        return res.status(400).json({
            success: false,
            message: `Error in registering user, try again later`,
        });
    }
}