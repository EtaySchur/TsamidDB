<?php
	require 'models/mainModel.php';
	$data = json_decode(file_get_contents("php://input"));
	
	
	
	
	if(isset ($data->action) && !empty ($data->action)){

		switch ($data->action){
			case 'getAllUsers' :    echo json_encode(MainModel::getAllUsersFromParse());
									break;
		}
	}

?>
