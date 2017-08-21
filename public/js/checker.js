
// check blank input field
function blankCheck(inputId,btnId){
	$(inputId).keypress(function() {
		var value = $(inputId).val();
		if (!value){
			$(btnId).prop('disabled', true);    
       		$(btnId).prop("title","Fill up above fields!");
		}
		else{
			$(btnId).prop("disabled",false);
			$(btnId).removeProp("title");
		}
	});
}