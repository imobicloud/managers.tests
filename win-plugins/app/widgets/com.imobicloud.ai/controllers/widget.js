/*
 args = {
 	visible: false,
 	message: null,
 	timeout: 0
 }
 * */
var args = arguments[0] || {},
	timeout;

init();
function init() {
  	if (args.visible) {
		showAI(args);
	}
}

function unload() {
  	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
}

exports.unload = unload;

/*
 params = {
 	message: null,
 	timeout: 0
 }
 * */
function showAI(params) {
	unload();
	
	if (params == null) { params = {}; }
	params.message && ($.loadingMessage.text = params.message);
	
	$.loadingSpinner.show();
	$.ai.visible = true;
	
	if (params.timeout) {
		timeout = setTimeout(function(){ 
			hideAI();
			$.trigger('timeout'); 
		}, params.timeout);
	}
};
exports.show = showAI;

function hideAI() {
  	$.loadingSpinner.hide();
	$.ai.visible = false;
}

exports.hide = function() {
	unload();
	hideAI();
};