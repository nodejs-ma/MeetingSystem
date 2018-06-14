var express = require('express');
// var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser')
var app = express();

// 模板引擎
app.engine('html', require('ejs').renderFile);
app.set('views', './views');
app.set('view engine', 'html');

// 静态目录
app.use(express.static('public'));

// 处理multipart/form-data类型的表单数据
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().array());

// 解析cookie
app.use(cookieParser());

// 路由分模块
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'))

// 404页面
app.get('*', function(req, res) {
	res.send('404 not found');
});

app.listen(3000, function() {
	console.log('listening...');
});