var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/myproject';
var sd = require('silly-datetime');

router.get('/', function(req, res, next) {
    res.send('users');
});

router.get('/register', function(req, res, next) {
	res.render('register', { title: '注册页面' });
});

router.post('/register/save', function(req, res, next) {
	var resData = {
		'code': 0,
		'message': '注册成功，请登陆'
	}

	MongoClient.connect(url, function(err, client) {
		if(err) {
			console.log('数据库连接失败');
		} else {
			console.log('数据库连接成功');

			var colUsers = client.db('myproject').collection('users');
			colUsers.find({ 'tel': req.body.tel }).toArray(function(err, docs) {
				if(err) {
					console.log('查询失败');
				} else {
					console.log('查询成功');

					if(docs != '') {
						console.log('手机号已存在，不能注册');
						console.log(docs);

						resData.code = 1;
						resData.message = '手机号已被注册';
						res.json(resData);
					} else {
						console.log('手机号不存在，可以注册')

						colUsers.insertOne({
							'tel': req.body.tel,
							'pwd': req.body.pwd,
							'name': req.body.name,
							'unit': req.body.unit
						}, function(err, result) {
							if(err) {
								console.log('注册失败');
							} else {
								console.log('注册成功');

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


router.get('/login', function(req, res, next) {
	res.render('login', { title: '登录页面' });
});

router.post('/login/check', function(req, res, next) {
	var resData = {
		'code': 0,
		'message': '登录成功'
	}

	MongoClient.connect(url, function(err, client) {
		if(err) {
			console.log('数据库连接失败');
		} else {
			var colUsers = client.db('myproject').collection('users');

			colUsers.find({ 'tel': req.body.tel }).toArray(function(err, docs) {
				if(err) {
					console.log('查询失败');
				} else {
					if(docs == '') {
						resData.code = 1;
						resData.message = '手机号不存在';
						res.json(resData);
					} else if(docs[0].pwd != req.body.pwd) {
						resData.code = 2;
						resData.message = '密码不正确';
						res.json(resData);
					} else {
						res.cookie('userTel', req.body.tel);
						res.cookie('userPwd', req.body.pwd);
						res.cookie('userName', docs[0].name);
						res.cookie('userUnit', docs[0].unit);
						res.json(resData);
					}
				}
				client.close();
			});
		}
	});
});


router.get('/ucenter', function(req, res, next) {
	res.render('ucenter', {
		title: '个人中心',
		myTel: req.cookies.userTel,
		myPwd: req.cookies.userPwd,
		myName: req.cookies.userName,
		myUnit: req.cookies.userUnit
	});
});

router.post('/ucenter/update', function(req, res, next) {
	var resData = {
		'code': 0,
		'message': '修改成功，请重新登录'
	}

	MongoClient.connect(url, function(err, client) {
		if(err) {
			console.log('数据库连接失败');
		} else {
			var colUsers = client.db('myproject').collection('users');
			colUsers.updateMany({'tel': req.cookies.userTel}, {
				'$set': {
					'pwd': req.body.pwd,
					'name': req.body.name,
					'unit': req.body.unit
				}
			}, function(err, result) {
				if(err) {
					console.log(err);
					resData.code = 1;
					resData.message = '修改失败',
					res.json(resData);
				} else {
					res.clearCookie('userTel');
					res.clearCookie('userPwd');
					res.clearCookie('userName');
					res.clearCookie('userUnit');
					res.json(resData);
				}
				client.close();
			});
			
		}
	});
});


router.get('/ucenter/out', function(req, res, next) {
	var resData = {
		'code': 0,
		'message': '已退出登录！'
	}
	res.clearCookie('userTel');
	res.clearCookie('userPwd');
	res.clearCookie('userName');
	res.clearCookie('userUnit');
	res.json(resData);
});

router.get('/ucenter/mymeeting', function(req, res, next) {
	var nowDate = sd.format(new Date(), 'YYYY-MM-DD');

	MongoClient.connect(url, function(err, client) {
		if(err) {
			console.log('数据库连接失败');
		} else {
			var colMeet = client.db('myproject').collection('meet');
			colMeet.find({
				'meetTel': req.cookies.userTel,
				'meetDate': {'$gte': nowDate}
			}).sort({
				'meetDate': 1
			}).toArray(function(err, docs) {
				client.close();

				if(err) {
					console.log('查找失败');
				} else {
					res.json(docs);
				}
			});
		}
	});
});

router.get('/ucenter/del', function(req, res, next) {
	var resData = {
		'code': 0,
		'message': '删除成功'
	}

	MongoClient.connect(url, function(err, client) {
		if(err) {
			console.log('数据库连接失败');
		} else {
			var colMeet = client.db('myproject').collection('meet');
			colMeet.deleteOne({'_id': ObjectId(req.query.id)}, function(err, docs) {
				client.close();

				if(err) {
					console.log('删除失败');
				} else {
					res.json(resData);
				}
			});
		}
	});
});


module.exports = router;