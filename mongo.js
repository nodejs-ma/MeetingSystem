var MongoClient = require('mongodb').MongoClient;

// myproject是要连接的数据库，如果不存在则创建
var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, client) {
	if(err) {
		console.log('数据库连接失败');
		return;
	} else {
		console.log('数据库连接成功');

		var db = client.db('myproject');

		// 插入数据
/*		db.collection('users').insertOne({
			'username': '张三',
			'sex': '男',
			'age': '23',
			'tel': '8890'
		}, function(err, result) {
			if(err) {
				console.log('插入失败');
			} else {
				console.log('插入成功');
				console.log(result);
				
			}
			client.close();
		});*/

		// 查询数据
/*		db.collection('users').find({}).toArray(function(err, docs) {
			if(err) {
				console.log('查找失败');
			} else {
				console.log('查找成功');
				console.log(docs[0].age);
			}
		});*/

		// 删除users集合
		/*db.collection('users').drop();
*/

		// 聚合
		db.collection('meet').aggregate([
			{'$limit': 1},
			{'$lookup': {
				'localField': 'meetTel',
				'from': 'users',
				'foreignField': 'tel',
				'as': 'userInfo'
			}},
			{'$project': {
				'meetTel': 1,
				'meetRoom': 1,
				'userInfo.tel': 1,
				'userInfo.name': 1
			}}
			]).toArray(function(err, docs){
			console.log(docs[0].userInfo[0].name);
		});
		




	}
});

