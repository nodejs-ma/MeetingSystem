window.onload = function() {

	var form = document.getElementsByTagName('form')[0],
		remark = document.getElementById('remark'),
		btn = document.getElementsByTagName('button')[0],
		meetUl = document.getElementById('meetUl');


	var d = new Date(),
		yyyy = d.getFullYear(), 
		mm = d.getMonth(),
		dd = d.getDate();

	mm += 1;
	if(mm < 10) {
		mm = '0' + mm;
	}

	if(dd < 10) {
		dd = '0' + dd;
	}
	
	var today = yyyy + '-' + mm + '-' + dd;
	
	form.date.min = today;


	btn.onclick = function(e) {
		e.preventDefault();


		if(form.room.value  == '' || form.date.value == '' || form.time.value == '' || form.theme.value == '') {
			alert('请输入必要的会议信息！');
			return;
		}

		var formData = new FormData();
		formData.append('meetRoom', form.room.value);
		formData.append('meetDate', form.date.value);
		formData.append('meetTime', form.time.value);
		formData.append('meetTheme', form.theme.value);
		formData.append('meetRemark', remark.value);
		var xhr = new XMLHttpRequest();
		xhr.open('post', '/meetsave', true);
		xhr.responseType = 'json';
		xhr.onerror = function() {
			alert('请求失败');
		}
		xhr.onload = function() {
			if(xhr.status >= 200 && xhr.status <= 304) {
				alert(xhr.response.message);
				if(xhr.response.code == 0) {
					location.reload();
				}
				
			}
		}
		xhr.send(formData);
	}




	function meetShow() {
		var xhr = new XMLHttpRequest();
		xhr.open('get', '/meetshow', true);
		xhr.responseType = 'json';
		xhr.onerror = function() {
			alert('请求失败');
		}
		xhr.onload = function() {
			if(xhr.status >= 200 && xhr.status <= 304) {
				var x = xhr.response;
				for(i = 0; i < xhr.response.length; i++) {
					meetUl.innerHTML += '<li>' 
										+	'<div class="room">' + x[i].meetRoom + '&nbsp;&nbsp;&nbsp;&nbsp;' + x[i].meetDate + '&nbsp;&nbsp;<span class="jtime">' + x[i].meetTime + '</span></div>'
										+	'<div class="theme">【' + x[i].meetTheme + '】</div>'
										+	'<div class="remark">' + '&nbsp;备注：' + x[i].meetRemark + '</div>'
										+	'<div class="human">' + '订会人：' + x[i].userInfo[0].name + '（' + x[i].userInfo[0].unit + '）' + x[i].meetTel + '</div>'
									+	'</li>';
				}

			}
		}
		xhr.send(null);
	} 

	meetShow();
}