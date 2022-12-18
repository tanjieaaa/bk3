const express = require('express')
const router = express.Router()
const {db,genid} = require('../db/dbUtils')

router.get('/text',(req,res)=>{
    // db.query("SELECT * FROM admin",(err,message)=>{
    //     if(err){

    //     }else{
    //         console.log(message)
    //     }  
    // })
    db.async.query("SELECT * FROM admin").then(e=>{
        console.log(e)
    })
    res.send({
        id:genid.NextId()
    })
})

module.exports = router