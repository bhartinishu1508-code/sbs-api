const mongoose=require('mongoose')
const contactSchema=new mongoose.Schema({
    fullName:String,
    email:String,
    phone:String,
    address:String,
    gender:String
})


module.exports=mongoose.model('contact',contactSchema)