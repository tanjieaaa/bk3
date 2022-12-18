const express = require('express')
const router = express.Router()
const {db,genid} = require('../db/dbUtils')

router.get('/list',async (req,res)=>{
    const select_sql = "SELECT * FROM category"
    let {err,message} = await db.async.query(select_sql)
    if(err == null){
        res.send({
            code:200,
            message:'查询成功',
            data:message
        })
    }else{
        res.send({
            code:500,
            message:'查询失败'
        })
    }
})


router.delete('/_token/delete',async (req,res)=>{
    let {id} = req.query
    const delete_sql = "DELETE FROM category WHERE id=?"
    let {err,message} = await db.async.query(delete_sql,[id])
    if(err == null){
        res.send({
            code:200,
            message:'删除成功'
        })
    }else{
        res.send({
            code:500,
            message:'删除失败'
        })
    }
})

router.put('/_token/update',async (req,res)=>{
    let {id,name} = req.query
    const update_sql = "UPDATE category SET name=? WHERE id=?"
    let {err,message} = await db.async.query(update_sql,[name,id])
    if(err == null){
        res.send({
            code:200,
            message:'更新成功'
        })
    }else{
        res.send({
            code:500,
            message:'更新失败'
        })
    }
})

router.post('/_token/add',async (req,res)=>{
    let {name} = req.query
    const insert_sql = "INSERT INTO category (id,name) VALUES (?,?)"
    let {err,message} = await db.async.query(insert_sql,[genid.NextId(),name])
    if(err == null){
        res.send({
            code:200,
            message:'添加成功'
        })
    }else{
        res.send({
            code:500,
            message:'添加失败'
        })
    }
})

module.exports = router