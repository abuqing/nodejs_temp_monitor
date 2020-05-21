//routes/index.js
var express = require('express');
var router = express.Router();
var moment = require('moment'); //date format library
const fs = require('fs');
const csv = require('csv'); //'npm install csv' https://github.com/adaltas/node-csv

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/mydb";

/* GET home page. */
router.get('/', function(req, res, next) {
	MongoClient.connect(url, function(err, client) {
		console.log("MongoDB Connect");
		const db = client.db('mydb');
		const collection = db.collection('test');
		// find
		collection.find()
			.limit(10)
			.sort({date:-1})
			.project({ '_id': 0})
			.toArray(function(err, docs) {
				if(docs){
					console.log(docs);
					res.render('index', {boardList: docs , title : "express"});
					//Close MongoDB
					client.close();
					console.log("MongoDB Close");
				}
			});
	});

const assert = require('assert');

// Connect to MongoDB
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("MongoDB Connect");
    const db = client.db('mydb');
	const collection = db.collection('test');
	
	const query = {}; //name: 'john'
	
    collection.find(query)
    .sort({date:-1})
    .limit(99)
    .toArray(function(err, docs) {
        if(docs){
            assert.equal(null, err);
            // client.close();
            // console.log("MongoDB Close");
            
            const len = Object.keys(docs).length;
            console.log(len);
            
            var temp = new Array();
            for (i = 0; i < len; i++) {
                if (docs[i] != null) {
                    var newLength = temp.push(docs[i].Celsius)
                    }
                } 
            // document.getElementById("celsius").value=temp;
            // console.log(temp);
            // res.render('index', {temp: temp,});
            
            // Export to csv file
            fs.writeFile('./public/javascripts/temp.csv',temp,(error)=>{
            console.log('Exported temp.csv ');
            })
           
            var humi = new Array();
            for (i = 0; i < len; i++) {
                if (docs[i] != null) {
                    var newLength = humi.push(docs[i].Humidity)
                    }
                } 
            // document.getElementById("celsius").value=temp;
            console.log(humi);
            // res.render('index', {humi: humi,});
            // export csv file
            fs.writeFile('./public/javascripts/humi.csv',humi,(error)=>{
                console.log('Exported humi.csv ');
                })

            var chartDate = new Array();
            for (i = 0; i < len; i++) {
                if (docs[i] != null) {
                    var newLength = chartDate.push(docs[i].date.toLocaleString())
                    }
                } 
            // document.getElementById("celsius").value=temp;
            console.log(chartDate);
            // res.render('index', {chartDate: chartDate,humi: humi,temp: temp});
            // export csv file
            fs.writeFile('./public/javascripts/chartDate.csv',chartDate,(error)=>{
            console.log('Exported chartDate.csv ');
            })
            
        }
	})
	
});
});

router.post('/', function(req, res, next) {
	var deldate = req.body.deldate;
	var createdAt = moment().format('YYYY-MM-DD HH:mm:ss'); // Date format 2020-05-11 21:22:59
	console.log("Delete from " + deldate);
	console.log(createdAt);
  
	MongoClient.connect(url, function(err, client){
		console.log("connected to db")
		const db = client.db("mydb")
		const collection = db.collection('test');
		collection.deleteMany({date:{$lte: new Date(deldate+"T00:00:00Z")}});
		//Close MongoDB
		client.close();
		console.log("MongoDB Close");
		res.redirect('back');
	});
});

router.get('/delall', (req, res) => {
	MongoClient.connect(url, function(err, client){
		console.log("connected to db")
		const db = client.db("mydb")
		const collection = db.collection('test');
		collection.deleteMany({});
		//Close MongoDB
		client.close();
		console.log("MongoDB Close");
		res.redirect('back');
	});
})


module.exports = router;
