window.onload = function() {
	
	var form = document.getElementsByTagName('form')[0],
		btn = document.getElementsByTagName('button')[0];

		btn.onclick = function(event) {
			event.preventDefault();

			// 验证空值
			if(form.tel.value == '' || form.pwd.value == '') {
				alert('不能为空');
				return;
			}

			// ajax提交数据
			var formData = new FormData();
			formData.append('tel', form.tel.value);
			formData.append('pwd', form.pwd.value);
			var xhr = new XMLHttpRequest();
			xhr.open('post', '/users/login/check', true);
			xhr.responseType = 'json';
			xhr.onerror = function() {
				alert('请求失败' + xhr.status);
			}
			xhr.onload = function() {
				if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
					alert(xhr.response.message);
					if(xhr.response.code == 0) {
						location.href = 'http://www.1cee.com:3000/';
					}
					
				}
			}
			xhr.send(formData);

		}

}