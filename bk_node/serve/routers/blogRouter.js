const express = require('express')
const router = express.Router()
const {db,genid} = require('../db/dbUtils')

router.get('/search',async (req,res)=>{
    let {keyword,categroy_id,page,pageSize} = req.query

    page = page == null? 1:page
    pageSize = pageSize == null? 1:pageSize
    categroy_id = categroy_id == null? 0:categroy_id
    keyword = keyword == null? "":keyword   
    let params = []
    let whereSqlstr = []
    if(categroy_id != 0){
        whereSqlstr.push(' categroy_id=? ')
        params.push(categroy_id)
    }
    if(keyword != ""){
        whereSqlstr.push(" title LIKE ? OR content LIKE ? ")
        params.push('%'+keyword+'%')
        params.push('%'+keyword+'%')
    }
    let whereSql = ''
    if(whereSqlstr.length > 0){
        whereSql = " WHERE " + whereSqlstr.join(" AND ")
    }
    let searchSql = " SELECT * FROM blog " + whereSql + " ORDER BY create_name DESC LIMIT ?,? "
    let searchSqlparams = params.concat([(page-1)*pageSize,pageSize])

    let searchCountSql = "SELECT count(*) FROM blog " + whereSql
    let searchCountSqlparams = params

    let searchResult = await db.async.query(searchSql,searchSqlparams)
    let searchCountResult = await db.async.query(searchCountSql,searchCountSqlparams)
    console.log(searchResult,searchCountResult)
    if(searchResult.err == null && searchCountResult.err == null){
        res.send({
            code:200,
            message:'查询成功',
            data:{
                keyword,
                categroy_id,
                page,
                pageSize,
                message:searchResult.message,
                count:searchCountResult.message[0].count
            }
        })
    }else{
        res.send({
            code:500,
            message:'查询失败'
        })
    }
})

router.delete('/delete',async (req,res)=>{
    const {id} = req.query
    const delete_sql = 'DELETE FROM blog WHERE id=?'
    let {err,message} = await db.async.query(delete_sql,id)
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

router.post('/update',async (req,res)=>{
    const {id,title,categroy_id,content} = req.query
    let create_name = new Date().getTime()
    const update_sql = 'UPDATE blog SET categroy_id=?,title=?,content=?,create_name=? WHERE id=?'
    let params = [categroy_id,title,content,create_name,id]
    let {err,message} = await db.async.query(update_sql,params)
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

router.post('/add',async (req,res)=>{
    const {title,categroy_id,content} = req.query
    let create_name = new Date().getTime()
    const insert_sql = 'INSERT INTO blog(id,categroy_id,title,content,create_name) VALUES(?,?,?,?,?)'
    let params = [genid.NextId(),categroy_id,title,content,create_name]
    let {err,message} = await db.async.query(insert_sql,params)
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