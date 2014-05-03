$( document ).ready(function() {
	var userNameElemnt = $('#username');
	var passwordElement = $('#password');
	
	$('#login').click(function(){
		var userName = $(userNameElemnt).val();
		var password = $(passwordElement).val();
		$.ajax({url: 'models/model.php',
         data: {username:userName , password:password},
         type: 'post',
         success: function(data) {
			 alert(data);
                      document.location.href = 'manage.php';
                  },
			error : function(data){
				$('#userDetailsError').css('display' , 'block');
			}	  
});
	});

});
