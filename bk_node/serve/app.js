const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const {db,genid} = require('./db/dbUtils')
const app = new express()
app.use(function(req,res,next){
    // 设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin','*')
    // 允许的header的类型
    res.header('Access-Control-Allow-Headers','*')
    res.header('Access-Control-Allow-Methods',"DELETE,PUT,POST,GET,OPTIONS")
    if(req.methods == "OPTIONS"){
        res.sendStatus(200) // 让options尝试请求快速结束
    }else{
        next()
    }
})

app.use(express.json())

// const ADMIN_PATH = '/_token'
// app.use(async (req,res,next)=>{
//     if(req.path.indexOf(ADMIN_PATH) != -1){
//         let {token} = req.headers
//         let admin_sql = "SELECT * FROM admin WHERE token=?"
//         let adminresult = await db.async.query(admin_sql,[token])
//         console.log(adminresult)
//         if(adminresult.message.length == 0){
//             res.send({
//                 code:403,
//                 message:'请先登录'
//             })
//             return
//         }else{
//             next()
//         }
//     }else{
//         next()
//     }
// })
app.use('/text',require('./routers/text'))
app.use('/admin',require('./routers/adminRouter'))
app.use('/category',require('./routers/categoryRouter'))
app.use('/blog',require('./routers/blogRouter'))

//上传图片
const update = multer({
    dest: "./public/upload/temp"
})
app.use(express.static(path.join(__dirname, "public")))
app.post("/rich_upload",update.any(), async (req, res) => {
    
    if (!req.files) {
        res.send({
            "errno": 1, 
            "message": "失败信息"
        })
        return;
    }

    let files = req.files;
    let ret_files = [];

    for (let file of files) {
        //获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        //随机文件名字
        let file_name = genid.NextId() + "." + file_ext

        //修改名字加移动文件
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/" + file_name
        )
        ret_files.push("/upload/" + file_name)
    }

    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url":ret_files[0], // 图片 src ，必须
        }
    })

})

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(80,()=>{
    console.log('http://localhost:80/')
})