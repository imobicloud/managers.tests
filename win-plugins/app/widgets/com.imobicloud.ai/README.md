# Titanium UI - Activity Indicator

xml
	
	<Widget id=“ai” src="com.imobicloud.ai" visible="true" message="Please wait..." onTimeout=“aiTimeout”/>
	
js
	
	// show AI with custom message
	$.ai.show({ message: 'Loading...' });
	
	// show AI, auto hide after 5 seconds
	$.ai.show({ message: 'Loading...', timeout: 5000 });
	
	// hide AI
	$.ai.hide();

	function aiTimeout(){
		var dialog = Ti.UI.createAlertDialog({
			buttonNames : ['OK'],
			message : 'Activity timeout',
			title : 'Error'
		});
		dialog.show();
	}

Changes Log:

- December 1, 2015: 
  + remove toggle
  + add show, hide
  + add timeout event