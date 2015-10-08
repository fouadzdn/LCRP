<?php
$array[]=array('id'=>1,'image'=>'images/studentimages/1.jpg','title'=>'student 1','checkin=>','checkout=>');
$array[]=array('id'=>2,'image'=>'images/studentimages/1.jpg','title'=>'student 2');
$array[]=array('id'=>3,'image'=>'images/studentimages/1.jpg','title'=>'student 3');
$array[]=array('id'=>4,'image'=>'images/studentimages/1.jpg','title'=>'student 4');
$array[]=array('id'=>5,'image'=>'images/studentimages/1.jpg','title'=>'student 5');
$array[]=array('id'=>6,'image'=>'images/studentimages/1.jpg','title'=>'student 6');
echo $_GET['callback'].'('.json_encode($array).')';
?>
