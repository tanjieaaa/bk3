const mysql = require('mysql')
const Genid = require('../utils/SnowFlake')

const genid = new Genid({WorkerId:1})

const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin123',
    database:'blog'
})

db.async = {}
db.async.query = (sql,params=[])=>{
    return new Promise((resolve,reject)=>{
        db.query(sql,params,(err,message)=>{
            resolve({err,message})
        })
    })
}
// db.query('SELECT * from admin',(err,result)=>{
//     if(err){
//         console.log(err)
//     }else{
//         console.log(result)
//     }
// })

module.exports = {
    db,
    genid
}