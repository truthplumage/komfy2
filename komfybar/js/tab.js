
$(document).ready(function(){
	
	$('div.tabs div').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('div.tabs div').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

});
