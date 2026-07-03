
require('dotenv').config();
const express = require('express')
const app = express()
const userRoute = require('./Routes/user')
const contactRoute = require('./Routes/contact')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

// mongoose.connect('')
// .then(()=>{
//     console.log('connect with database')
// })
// .catch((err)=>{
//     console.log(err)
//     console.log('something is  wrong')
// })

const  connectWithDatabase = async()=>{
    
    try{
       await mongoose.connect(process.env.MONGODB_URL)
    console.log('connected with database')
 
    }
    catch(err){
        console.log('something is wrong')
        console.log(err)

    }
}

connectWithDatabase()


app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/user',userRoute)
app.use('/contact',contactRoute)
// app.get('/student',(req,res)=>{
//     console.log("student ka get request aaya hai")
//     res.status(200).json({
//         student:[
//             {
//                 id:1,
//                 name:"Rahul Kumar",
//                 admNo:123
//             },
//             {
//                 id:2,
//                 name:"Karan Kumar",
//                 admNo:485
//             },
//             {
//                 id:3,
//                 name:"Amit Kumar",
//                 admNo:5884
//             }
            

//         ]
//     })
    
// })


module.exports = app