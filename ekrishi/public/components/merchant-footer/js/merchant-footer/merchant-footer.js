define(['jquery'], function($){

	// popup windown when clicking on feedback link
	$(".feedbackPopup").click(function(e) {

		var accNumber = $("#accNumber").attr("data-accNumber"), //Account encripted number
			country = $("#country").attr("data-country"), //Country code
			locale = $("#locale").attr("data-locale"), // locale
			url="https://www.paypal-survey.com/survey/selfserve/9dc/130514?country="+country+"&lang="+locale+"&id="+accNumber; //Survey URL

		e.preventDefault();
		window.open(url, '', "height=500,width=1000");
	});
});
