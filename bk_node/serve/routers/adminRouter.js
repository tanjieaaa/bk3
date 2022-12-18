const express = require('express')
const router = express.Router()
const {v4:uuidv4} = require('uuid')
const {db,genid} = require('../db/dbUtils')

router.post('/login',async (req,res)=>{
    let { account,password } = req.query
    console.log(account)
    let {err,message} = await db.async.query('SELECT * FROM admin WHERE account=? and password=?',[account,password])
    if(err == null && message.length > 0){
        let login_token = uuidv4()
        let update_token_sql = "update admin set token = ? where id = ?"
        await db.async.query(update_token_sql,[login_token,message[0].id])
        let login_info = message[0]
        login_info.password = ''
        login_info.token = login_token
        res.send({
            code:200,
            message:'登陆成功',
            data:login_info
        })
    }else{
        res.send({
            code:500,
            message:'登陆失败'
        })
    }
})

module.exports = router