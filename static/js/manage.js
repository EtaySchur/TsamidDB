
function tableTitlesBuilder(params){
	
	
	var titleRow = document.createElement('tr');
	titleRow.className = "title_row row-fluid";
	
	$(params).each(function(key , data){
		var title = document.createElement('td');
		title.className = "title col-md-4";
		$(title).text(data);
		titleRow.appendChild(title);
	});
	
	return titleRow;
	
}


function userRowHtmlBuilder(data){
	var table = document.createElement('table');
	table.className = "table table-hover table-bordered col-md-16";
	
	var tableBody = document.createElement('tbody');
	
	var titlesArray = new Array();
	
	titlesArray[0] = 'Select';
	titlesArray[1] = 'User Name';
	titlesArray[2] = 'User ACL';
	titlesArray[3] = 'User Email';
	
	
	tableBody.appendChild(tableTitlesBuilder(titlesArray));
	
	var usersList = document.createElement('div');
	usersList.className = "users_list col-md-16";
	
	$(data['results']).each(function(key , data){

		var element = document.createElement('tr');
		element.className = "user_row row-fluid";
		
		var checkBox = document.createElement('td');
		checkBox.className = "check_box col-md-4";
		
		var inputCheckBox = document.createElement('input');
		$(inputCheckBox).attr('type' , 'checkbox');
		
		checkBox.appendChild(inputCheckBox);
		
		
		var userName = document.createElement('td');
		userName.className = "user_name col-md-4";
		$(userName).text(data['username']);
		
		var userACL = document.createElement('td');
		userACL.className = "user_acl col-md-4";
	
		var inputAclText = document.createElement('input');
		inputAclText.readOnly = true;
		inputAclText.className = 'form-control';

		$(inputAclText).attr('type' , 'text');
		$(inputAclText).attr('value' , data['acl_level']);
		
		userACL.appendChild(inputAclText);
		
		element.appendChild(checkBox);
		element.appendChild(userName);
		element.appendChild(userACL);
		tableBody.appendChild(element);
	});
	
	table.appendChild(tableBody);
	return table;
}



function jsonParser(data , type ){
	console.log(data);
	var dataArray = JSON.parse(data);
	switch (type){
		case 'usersList' :return userRowHtmlBuilder(dataArray);
							break;
	}	
}



$( document ).ready(function() {

	$('#manage_users').click(function(){
		$('.menu_category').removeClass('active');
		$(this).addClass('active');
		$.ajax({
			url: 'controller.php',
			data: {
				action:'getAllUsers'
			},
			type: 'post',
			success: function(usersArray) {
				var usersListHtml = jsonParser(usersArray , 'usersList');
				$('.main_content').append(usersListHtml);
			},
			error : function(data){
				alert('query fail');
			}	  
		});
	});

});