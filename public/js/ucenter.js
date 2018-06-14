window.onload = function() {
	var btnChange = document.getElementById('btnChange');
	var btnOut = document.getElementById('btnOut');
	var shade = document.getElementById('shade');
	var btnSure = document.getElementById('btnSure');
	var btnCancel = document.getElementById('btnCancel');
	var myForm = document.getElementById('myForm');
	var myUl = document.getElementById('myUl');

	// 修改资料
	btnChange.onclick = function() {
		shade.style.display = 'block';
	}

	// 放弃修改
	btnCancel.onclick = function(e) {
		e.preventDefault();
		shade.style.display = 'none';
	}

	// 确定修改
	btnSure.onclick = function(e) {
		e.preventDefault();

		if(myForm.myPwd.value == '' || myForm.myName.value == '' || myForm.myUnit.value == '') {
			alert('不能为空');
			return;
		}

		var pattern = new RegExp(/^[\w]{6,10}$/);
		if(pattern.test(myForm.myPwd.value) == false) {
			alert('密码在6到10位之间');
			return;
		}

		var formData = new FormData();
		formData.append('pwd', myForm.myPwd.value);
		formData.append('name', myForm.myName.value);
		formData.append('unit', myForm.myUnit.value);
		var xhr = new XMLHttpRequest();
		xhr.open('post', '/users/ucenter/update', true);
		xhr.responseType = 'json';
		xhr.onerror = function() {
			alert('请求失败' + xhr.status);
		}
		xhr.onload = function() {
			if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
				alert(xhr.response.message);
				if(xhr.response.code == 0) {
					location.href = 'http://www.1cee.com:3000/users/login';
				}

			}
		}
		xhr.send(formData);
	}

	// 退出登录
	btnOut.onclick = function() {
		var xhr = new XMLHttpRequest();
		xhr.open('get', '/users/ucenter/out', true);
		xhr.responseType = 'json';
		xhr.onerror = function() {
			alert('请求失败' + xhr.status);
		}
		xhr.onload = function() {
			if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
				alert(xhr.response.message);
				if(xhr.response.code == 0) {
					location.href = 'http://www.1cee.com:3000/users/login';
				}

			}
		}
		xhr.send(null);
	}


	// 加载我订的会
	function myMeeting() {

		

		var xhr = new XMLHttpRequest();
		xhr.open('get', '/users/ucenter/mymeeting', true)
		xhr.responseType = 'json';
		xhr.onerror = function() {
			alert('请求失败' + xhr.status);
		}
		xhr.onload = function() {
			if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
				// alert(xhr.response[0]._id);
				for(i = 0; i < xhr.response.length; i++) {
					myUl.innerHTML += '<li>' + xhr.response[i].meetRoom + '&nbsp;&nbsp;' + xhr.response[i].meetDate + '&nbsp;&nbsp;' + xhr.response[i].meetTime + '&nbsp;&nbsp;【' + xhr.response[i].meetTheme + '】&nbsp;&nbsp;<button onclick="del(this)" value="' + xhr.response[i]._id + '">删除</button>'
				}
				
			}
		}
		xhr.send(null);
	}
	myMeeting();





}


// 删除会议
function del(that) {
	// alert(that.value);

	var url = '/users/ucenter/del?id=' + that.value;

	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = 'json';
	xhr.onerror = function() {
		alert('请求失败' + xhr.status);
	}
	xhr.onload = function() {
		if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
			alert(xhr.response.message);
			if(xhr.response.code == 0) {
				location.reload();
			}

		}
	}
	xhr.send(null);
}