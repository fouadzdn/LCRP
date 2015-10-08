
var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	sURLVariables = sPageURL.split('&'),
	sParameterName,
	i;
	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};

function getClassesByTeacherID(TeacherID,CenterID)
{
	var classes_html='';
	$('.loader').css('display','inline-block');
	$.ajax({
		type: "POST"
		,url: MainURL + "/ieducoreapps/teacherapp/classinfo.php/jsonp?callback=?"
		,dataType: "jsonp"
		,data:{"employee_id":TeacherID,"center_id":CenterID}
		,success:function(data) {
			// alert(JSON.stringify(data));
			
		for (var i in data){
			index_class[i] = data[i].ClassID;
			classes_html += '<div class="row row-classes" data-id="'+data[i].ClassID+'" >';
			// prev_class
			classes_html += '<div class="col-xs-2 pull-middle">';
			if ( i > 0 ) {
					classes_html += ' <div class="col-xs-6 prev_class_icon" style="color: rgb(203, 62, 58);">';
					classes_html += '<a href="#" onclick="prev_class('+i+');">';
					classes_html += '<i class="fa fa-arrow-left fa-3x"></i></a></div>';
				}
				classes_html += '</div>';

				classes_html += '<div class="col-xs-3 pull-middle image-responsive img-rounded class_icon img-circle img-responsive" >';
				classes_html += '<a href="#" onclick="actual_class('+i+');">';
				classes_html += '<div class="square1 class_icon" style="background-image: url('+data[i].ClassLogo+'); "></div>';
				classes_html += '</a>';
				classes_html += '</div>';
				classes_html += '<div class="col-xs-4 pull-middle">';
				classes_html += '<h2>'+data[i].ClassName+'</h2><h3>'+data[i].ChildCount+' Children</h3>';
				classes_html += '</div>';

				// next_class
				classes_html += '<div class="col-xs-3 pull-middle">';
			if ( i < data.length-1 ) {
					classes_html += ' <div class="col-xs-6 next_class_icon" style="color: rgb(203, 62, 58);">';
					classes_html += '<a href="#" onclick="next_class('+i+');">';
					classes_html += '<i class="fa fa-arrow-right fa-3x"></i></a></div>';
				}
				classes_html += '</div>';
				
				classes_html += '</div>';
			} // for classes rows
			
			$(".place_holder_container_classes").html(classes_html);
			$(".loader").fadeOut('slow');
			prev_class(1); // show first class

		} // success
	});
}
			
function getChildrenByClassID(CenterID,ClassID)
{

//alert('center='+CenterID+' classid='+ClassID);

$('.loader').css('display','inline-block');
var $children_html = $('<ul class="list-group" />');
$.ajax({
	method: "POST"
	,url: MainURL + "/ieducoreapps/teacherapp/childinfo.php/jsonp?callback=?"
	,dataType: "jsonp"
	,data:{"center_id":CenterID,"class_id":ClassID}
	,success:function(data) {
		for (var i in data){
			// alert(JSON.stringify(data[i]));
			index_children[i] = data[i].ChildID;
			var sessions='';
			for(var j in data[i].sessions)
			{
				sessions += '<a class="list-group-item"><h5>'+data[i].sessions[j].SessionName1+'<br>'+data[i].sessions[j].SessionName2+'</h5></a>';
			}
			$children_html.append('<li class="list-group-item">'
				 +'<div class="row" data-id="'+data[i].ChildID+'" >'
				 +'<div class="col-xs-3 pull-middle image-responsive img-rounded class_icon img-circle img-responsive" >'
				 +'<a style="display:block;"  >'
				 +'<div class="child_square class_icon" style="background-image: url('+data[i].ChildPicture+'); ">'
				 +'</div>'
				 +'</a>'
				 +'</div>'
				 +'<div class="col-xs-4 pull-middle">'
				 +'<h2>'+data[i].ChildName+'</h3>'
				 +'<h3>'+data[i].ChildAllergy+'</h3>'
				 +'<h3>'+data[i].ChildIllness+'</h3>'
				 +'<h3>'+data[i].ChildBirthDate+'</h3>'
				 +'</div>'
				 +'<div class="col-xs-5 pull-middle">'
				 +'<div class="list-group">'
				 +'<a class="list-group-item active">'
				 +'<h4 class="list-group-item-heading">Sessions</h4>'
				 +'</a>'
				 +sessions
				 +'</div>'
				 +'</div>'
				 +'</div>'
				 +'</li>');
			}
			$(".place_holder_container_children").html($children_html);
			$(".loader").fadeOut('slow');
		}
	});
}


////////////////////////////////////////////////////////
var formatTime = (function () {
    function addZero(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }

    return function (dt) {
        var formatted = '';

        if (dt) {
            var hours24 = dt.getHours();
            var hours = ((hours24 + 11) % 12) + 1;
            formatted = [formatted, [addZero(hours), addZero(dt.getMinutes())].join(":"), hours24 > 11 ? "pm" : "am"].join(" ");            
        }
        return formatted;
    }
})();

Date.prototype.yyyymmdd = function() {         
        var yyyy = this.getFullYear().toString();                                    
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd  = this.getDate().toString();             
                            
        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
}; 


function validate_button_att_in_out()
{
	for (var i in index_att_in){
		if ( index_att_in[i] == '') {
			// do nothing
		}
		else {
			if ( index_att_out[i] == '' ) {
				$("#button_in_"+i).removeClass('btn-success');
			}
		}
	}
	return false;
}

function check_in_child(k)
{
	idchild = index_children[k];
//	alert('check_IN: k='+k+' , idchild='+idchild);

	if ( index_att_in_stat[k] != 0 ) return false; 
	
	index_att_in_stat[k] = 1;
	index_att_in[k] = formatTime(new Date());
//	alert('check_IN: k='+k+' , idchild='+idchild+' , time='+index_att_in[k]);
	
	$("#button_in_"+k).removeClass('btn-success');
	
	return false;
}

function check_out_child(k)
{
	idchild = index_children[k];
//	alert('check_OUT: k='+k+' , idchild='+idchild);
	
	if ( index_att_out_stat[k] != 0 ) return false; 
	index_att_out_stat[k] = 1;
	index_att_out[k] = formatTime(new Date());
//	alert('check_OUT: k='+k+' , idchild='+idchild+' , time='+index_att_out[k]);
	
	$("#button_out_"+k).removeClass('btn-danger');

	return false;
}


function check_in_out_save()
{
// if index_att_out_stat or index_att_in_stat = 1
// send index_att_out and index_att_in 

}


function getChildrenByClassIDAtt(CenterID,ClassID)
{
//alert('center='+CenterID+' classid='+ClassID);
$('.loader').css('display','inline-block');


var div_button_save_att = '<div class="row data-id=000">'
			+'<div class="col-xs-8 pull-middle" style="margin-top:2%;"></div>'
			+'<div class="col-xs-4 pull-middle" style="margin-top:2%;">'
	+'<a href="#" onclick="check_in_out_save();">'
			+'<h3><button type="button" class="btn btn-default btn-success "><i class="fa fa-arrow-up fa-2x"></i></button>SAVE</h3>'
	+'</a>'
			+'</div></div>';

var children_att_html = '<ul class="list-group" />';

var att_date = '2015-10-01'; // new date()
dd = new Date();
att_date = dd.yyyymmdd();
//// ///////////////// $('#today').html(d.yyyymmdd());
var data  = {"center_id": CenterID,"class_id":ClassID,"att_date":att_date};

	$.ajax({
		method: "POST"
		,url: MainURL + "/ieducoreapps/teacherapp/childatt.php/jsonp?callback=?"
		,dataType: "jsonp"
		,data: data
		,success:function(data) {
/////////////////////			alert(JSON.stringify(data));

			for (var i in data){
				index_children[i] = data[i].ChildID;
				index_att_in[i] = '';
				index_att_out[i] = '';
				index_att_in_stat[i] = 0;
				index_att_out_stat[i] = 0;
				
				if(data[i].AttOUT !== null)
				{
	index_att_out[i] = data[i].AttOUT;
				}
				if(data[i].AttIN !== null)
				{
	index_att_in[i] = data[i].AttIN;
				}
//				$children_att_html.append('<li class="list-group-item">'
				 children_att_html += '<li class="list-group-item">'
					 +'<div class="row" data-id="'+data[i].ChildID+'" >'
					 +'<div class="col-xs-2 pull-middle image-responsive img-rounded class_icon_link img-circle img-responsive" >'
					 +'<a style="display:block;" >'
					 +'<div class="child_square class_icon" style="background-image: url('+data[i].ChildPicture+'); ">'
					 +'</div>'
					 +'</a>'
					 +'</div>'
					 +'<div class="col-xs-4 pull-middle" style="margin-top:2%;">'
					 +'<h2>'+data[i].ChildName+'</h3>'
					 +'<h3>'+data[i].ChildBirthDate+'</h3>'
					 +'</div>'
					 +'<div class="col-xs-5 pull-middle" style="margin-top:2%;">'
						 +'<div>'
//						 +'<div class="btn-group btn-group-justified " role="group" aria-label="">'
					+'<a href="#" onclick="check_in_child('+i+');">'
						 +'<div class="btn-group" role="group">'
	//						+'<input type="time" class="checkTime" name="checkInTime"  value="'+checkInTime+'" id="checkInTime" />'
						 +'<button id="button_in_'+i+'" type="button" class="btn btn-default btn-success "><i class="fa fa-sign-in fa-3x"></i></button>'
						 +' </div>'
						 +' </a>'
					 +'<div class="col-xs-1"></div>'
					+'<a href="#" onclick="check_out_child('+i+');">'
						 +'<div class="btn-group" role="group">'
//						 +' <div class="btn-group btn-group-justified" role="group">'
	//						+'<input type="time" class="checkTime" name="checkOutTime" value="'+checkOutTime+'" id="checkOutTime" />'
						 +' <button id="button_out_'+i+'" type="button" class="btn btn-default btn-danger "><i class="fa fa-sign-out fa-3x"></i></button>'
						 +'</div>'
						 +'</a>'
//						 +'</div>'
						 +'</div>'
					 +'</div>'
					 +'</div>'
					 +'</li>';
			}
			$(".place_holder_container_children").html('');
			$(".place_holder_container_children").html(div_button_save_att + children_att_html);

/*			var mytime = $(".checkTime")[0];
			if(mytime.type !== 'time') {//if browser doesn't support "time" input
				$(".checkTime").timepicker({
					minuteStep: 1,
					showSeconds: true,
					showMeridian: false,
					template: 'modal'
				});
			}*/
			$(".loader").fadeOut('slow');
			validate_button_att_in_out();
		}
	});
}	
		