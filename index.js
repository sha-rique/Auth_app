let express = require('express');
let app= express();

require(`dotenv`).config();
let PORT= process.env.PORT || 5000;

let cookie_parser= require(`cookie-parser`);

app.use(cookie_parser());
app.use(express.json());

// let db= require(`./config/database`);
// db.connect();

let authRoutes= require(`./routes/user`);

app.use(`/api/v1/auth`, authRoutes);


app.listen(PORT, ()=>{
    console.log(`Auth Server is running on port ${PORT}`);
})


app.get('/', (req,res) =>{
    res.send(`The app is running on port ${PORT}`);
})