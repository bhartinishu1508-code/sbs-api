const express = require('express')
const Router = express.Router()
const Contact = require('../models/Contact')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

// add contact
// Router.post('/add-contact',(req,res)=>{
//    console.log(req.body)
// const newContact = new Contact({
//     fullName:req.body.fullName,
//     email:req.body.email,
//     phone:req.body.phone,
//     address:req.body.address,
//     gender:req.body.gender
// })
// newContact.save()
// .then((result)=>{
//     console.log('data saved')
//     res.status(200).json({
//         msg:'data saved'
//     })
// })
// .catch((err)=>{
//     console.log(err)
//     res.status(500).json({
//         error:'something is wrong'
//     })
// })

// })

// add contact
Router.post('/add-contact',async(req,res)=>{
    try {
        console.log(req)
        const uploadedResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
        console.log(uploadedResult)

        // console.log(req.headers.authorization.split(" ")[1])
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        console.log(tokenData)

       
        const newContact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            gender:req.body.gender,
            userId:tokenData.userId,
            imageId:uploadedResult.public_id,
            imageUrl:uploadedResult.secure_url
        })
        
        const newData = await newContact.save()
        res.status(200).json({
            result:newData
        })

    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


// get all contact 
Router.get('/all-contact',async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const allContact = await Contact.find({userId:tokenData.userId}).select("_id fullName email phone address gender userId imageId imageUrl ").populate('userId','fullName email')
        res.status(200).json({
            contacts:allContact
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }

})

// get contact by id
// Router.get('/contactById/:id/',(req,res)=>{
//     console.log(req.paramsid)
// }
// )

// get  contact by id
Router.get('/contactById/:id',async(req,res)=>{
    try{
        // console.log(req.params)
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const id = req.params.id
        // const data = await Contact.findById(id).select("_id fullName email phone address grnder userId ")
        const data = await Contact.find({_id:req.params.id,userId:tokenData.userId})
        res.status(200).json({
            contact:data
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
         error:err
        })
    }

})


// get contact by gender
Router.get('/gender/:g',async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const contact = await Contact.find({gender:req.params.g,userId:tokenData.userId})
        res.status(200).json({
            contact:contact
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


// Delete contact by id
Router.delete('/:id',async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const contact = await Contact.findById(req.params.id)
        if(contact.userId != tokenData.userId){
            return res.status(500).json({
                error:'invailed user'
            })
        }

       await cloudinary.uploader.destroy(contact.imageId)
       await Contact.deleteOne({_id:req.params.id,userId:tokenData.userId})
        res.status(200).json({
            msg:'data deleted'
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


// delete many data by id
Router.delete('/:id',async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
       await  Contact.deleteMany({_id:res.params.id,userId:tokenData.userId})
       res.status(200).json({
        msg:'all contact deleted by this gender'
       })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})
// delete many  data by gender
Router.delete('/byGender/:gender',async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        await Contact.deleteMany({gender:req.params.gender,userId:tokenData.userId})
        res.status(200).json({
            msg:"all contact of this gender deleted....."
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


// Upadate api  

Router.put('/update/:id',async(req,res)=>{
    try{
    console.log(req.body)
    const token = req.headers.authorization.split(" ")[1]
    const tokenData = await jwt.verify(token,process.env.SEC_KEY)
    const contactData = await Contact.findById(req.params.id)

    if(contactData.userId!= tokenData.userId){
        return res.status(500).json({
            msg:"you dont have permission to updated  this data"
        })
    }
    const newData={
        fullName:req.body.fullName,
        email:req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        gender:req.body.gender,
        userId:req.body.userId
    }
    if(req.files && req.files.photo){
      await cloudinary.uploader.destroy(contactData.imageId)
      const file = req.files.photo
     const result =  await cloudinary.uploader.upload(file.tempFilePath)
     newData.imageId = result.public_id
     newData.imageUrl = result.secure_url
    }
    else{
        newData.imageUrl = contactData.imageUrl;
        newData.imageId = contactData.imageId
    }
    
   
  const updatedContact = await Contact.findByIdAndUpdate(req.params.id,newData,{new:true})
    res.status(200).json({
        msg:"data updated",
        result:updatedContact

    })
}
catch(err){
console.log(err)
res.status(500).json({
    error:err
})

}
})

module.exports = Router