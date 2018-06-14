var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/myproject';
var sd = require('silly-datetime');


router.get('/', function(req, res, next) {
	if(!req.cookies.userTel) {
		res.redirect('/users/login');
	} else {
		res.render('index', {
			title: '首页',
			currentUser: req.cookies.userTel,
			currentName: req.cookies.userName
		});
	}
    
});

router.get('/meetshow', function(req, res, next) {
	MongoClient.connect(url, function(err, client) {
		if(err) {
			console.log('数据库连接失败');
		} else {
			console.log('数据库连接成功');

			var colMeet = client.db('myproject').collection('meet');
			var colUsers = client.db('myproject').collection('users');

			var nowDate = sd.format(new Date(), 'YYYY-MM-DD');

			colMeet.aggregate([
				{'$match': {
					'meetDate': {'$gte': nowDate}
				}},
				{'$sort': {
					'meetDate': 1
				}},
				{'$lookup': {
					'localField': 'meetTel',
					'from': 'users',
					'foreignField': 'tel',
					'as': 'userInfo'
				}},
				{'$project': {
					'meetRoom': 1,
					'meetDate': 1,
					'meetTime': 1,
					'meetTheme': 1,
					'meetRemark': 1,
					'meetTel': 1,
					'userInfo.name': 1,
					'userInfo.unit': 1
				}}
				]).toArray(function(err, docs) {
					if(err) {
						console.log('聚合失败');
					} else {
						res.json(docs);
					}
				});

			client.close();
			
			
		}
	});
});



router.post('/meetsave', function(req, res, next) {
	var resData = {
		'code': 0,
		'message': '订会成功'
	}


	MongoClient.connect(url, function(err, client) {
		if(err) {
			console.log('数据库连接失败');
			return;
		} else {
			console.log('数据库连接成功');

			var meetCol = client.db('myproject').collection('meet');
			meetCol.find({
				'meetDate': req.body.meetDate,
				'meetTime': req.body.meetTime,
				'meetRoom': req.body.meetRoom
			}).toArray(function(err, docs) {

				if(err) {
					console.log('查询失败');
				} else {
					console.log('查询成功');

					if(docs != '') {
						console.log('会议重复');

						resData.code = 1;
						resData.message = '会议重复，预订失败！';
						res.json(resData);
					} else {
						meetCol.insertOne({
							'meetRoom': req.body.meetRoom,
							'meetDate': req.body.meetDate,
							'meetTime': req.body.meetTime,
							'meetTheme': req.body.meetTheme,
							'meetRemark': req.body.meetRemark,
							'meetTel': req.cookies.userTel
						}, function(err, result) {
							if(err) {
								console.log('会议存入数据库失败');
								console.log(err);
							} else {
								console.log('会议存入数据库成功');

								res.json(resData);

								

							}
						});
					}
				}
				client.close();
			});
			
		}
	});


});

module.exports = router;