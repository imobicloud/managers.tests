exports.load = function() {
	// window will run when window is created
};

exports.cleanup = function() {
	// this will run when open a child window
};

exports.reload = function() {
	// this will run when child window is close and this window focused
};

exports.unload = function() {
	// this will run when this window is closed
};

function openWin4(e) {
  	Alloy.Globals.WinManager.load({
  		url: 'win_4',
  		reset: true
  	});
}