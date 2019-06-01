var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/spider";
let dbase;

MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if (err) {
        console.log(err);
        throw err;
    }

    console.log('数据库spider创建成功');
    dbase = db.db('spider');
    dbase.createCollection('movies', {autoIndexId: true}, function(err, res){
        if (err) {
            console.log(err);
            throw err;
        }
        console.log('创建集合movies成功');
    })
});

insertManyData = (datas) => {
    dbase.collection('movies').insertMany(datas, function(err, res){
        if (err) {
            console.log(err);
            throw err;
        }
        console.log("插入的文档数量为: " + res.insertedCount);
    })
}

exports.insertManyData = insertManyData;