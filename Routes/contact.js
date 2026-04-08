const express = require('express')
const Router = express.Router()
const Contact = require('../models/Contact')


// add contact
Router.post('/add-contact',(req,res)=>{
   console.log(req.body)
const newContact = new Contact({
    fullName:req.body.fullName,
    email:req.body.email,
    phone:req.body.phone,
    address:req.body.address,
    gender:req.body.gender
})



newContact.save()
.then((result)=>{
    console.log('data saved')
    res.status(200).json({
        msg:'data saved'
    })
})
.catch((err)=>{
    console.log(err)
    res.status(500).json({
        error:'something is wrong'
    })
})

})

// get all contact 
Router.get('/all-contact',async(req,res)=>{
    try{
        const allContact = await Contact.find()
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
        const id = req.params.id
        const data = await Contact.findById(id).select("_id fullName email phone address ")
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
        const contact = await Contact.find({gender:req.params.g})
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
       await Contact.deleteOne({_id:req.params.id})
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


// delete many data
Router.delete('/:id',async(req,res)=>{
    try{
       await  Contact.deleteMany({_id:res.params.id ,})
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
module.exports = Router