



var Alert = function(type , text) {
	this._type = type;
	this._text = text;
	this._alertHtml = '<div class="alert alert-'+type+'">'+text+'</div>';
};

Alert.prototype.start = function(){
		$('.alert_section').append(this._alertHtml);
		$( ".alert" ).fadeOut( 3000 , function() {
    			
  		});	
};
