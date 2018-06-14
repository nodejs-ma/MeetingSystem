window.onload = function() {
	var form = document.getElementsByTagName('form')[0];
	var btn = document.getElementsByTagName('button')[0];

	btn.onclick = function(event) {
		// 阻止表单提交
		var event = event || window.event;
        event.preventDefault();   // 兼容标准浏览器
        window.event.returnValue = false;   // 兼容IE6-8

        // 验证是否为空
		if(form.tel.value == '' || form.pwd.value == '' || form.name.value == '' || form.unit.value == '') {
			alert('不能为空');
			return;
		}

		// 验证手机号
		var pattern = RegExp(/^[1][0-9]{10}$/);
		if (pattern.test(form.tel.value) == false) {
			alert('请输入正确的手机号码');
			return;
		}

		var pattern2 = new RegExp(/^[\w]{6,10}$/);
		if(pattern2.test(form.pwd.value) == false) {
			alert('密码在6到10位之间');
			return;
		}

		// ajax提交数据到后台
		var formData = new FormData();
		formData.append('tel', form.tel.value);
		formData.append('pwd', form.pwd.value);
		formData.append('name', form.name.value);
		formData.append('unit', form.unit.value);
		var xhr = new XMLHttpRequest();
		xhr.open('post', '/users/register/save', true);    //true为异步
		// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'json';       //接收到的数据格式
		xhr.onerror = function() {
			alert('请求失败' + xhr.status);
		} 
		xhr.onload = function() {
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
				alert(xhr.response.message);    //xhr.response为返回的数据
			}
		}
		xhr.send(formData);
	}
}