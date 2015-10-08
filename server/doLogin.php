<?php


if(!empty($_REQUEST['user_name']) && !empty($_REQUEST['password']))
{
	if($_REQUEST['user_name']=='fouad' and $_REQUEST['password']=='masa2at')
	{
		$array['CenterID']=2;
		$array['CenterName']='Center 0111';
		$array['TeacherID']=4;
	}
	else
	{
		$array['CenterID']=0;
		$array['TeacherID']=0;
	}
}
else
{
	$array['CenterID']=0;
	$array['TeacherID']=0;
}

echo $_GET['callback'].'('.json_encode($array).')';
?>
