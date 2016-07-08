// var Alloy = require('alloy');

function WindowManager() {
	var UICache,
		events = {};
	
	init();
		
	// PRIVATE FUNCTIONS ========================================================
	
	function init() {
		var UIManager = require('managers/ui');
		UICache = new UIManager();
		UICache
			.on('ui:show', winLoaded)
			.on('ui:hide', winDestroy);
		
		//
		
		Ti.API.info('Window Manager: initialized');
	}

	function winLoaded(params, e) {
		fireEvent('window:show', params);
		
		var win = params.controller.getView();
		
		/*
		 NOTES:
		 - To use managers with widget: nl.fokkezb.drawer / NappDrawer, view this demo
                https://github.com/ptquang86/menu
         - To use managers with widgets that return a window
                exports.getView = function() {
                    return $.widgetName.windowId;
                };
		 * */
		
		win.addEventListener('open', windowOpened);
		
		// cleanup cache, in case of window is closed not by Window Manager
		win.addEventListener('close', windowClosed);
		
		if (win.apiName == 'Ti.UI.iOS.NavigationWindow') {
			params.navigationWindow = win;
		}
		
		// make window visible
		if (params.controller.doShow == null) {
			if (OS_IOS && win.apiName != 'Ti.UI.TabGroup' && win.apiName != 'Ti.UI.iOS.NavigationWindow') {
				if (params.reset) {
					createNavigationWindow(params, win);
				} else {
					var navigationWindow = getNavigationWindow();
					if (navigationWindow) {
						navigationWindow.openWindow(win, params.openAnimation);
					} else {
						createNavigationWindow(params, win);
					}
				}
			} else {
				win.open(params.openAnimation);
			}
		} else {
			params.controller.doShow(params, win);
		}
		
		// handle back event
		OS_ANDROID && win.addEventListener('androidback', androidback);
	}
	
	function winDestroy(params, e) {
		if (params._alreadyClosed !== true) {
			fireEvent('window:hide', params);
			
			var win = params.controller.getView();
			
			win.removeEventListener('close', windowClosed);
			
			if (params.controller.doHide == null) {
				if (OS_IOS && win.apiName != 'Ti.UI.TabGroup' && win.apiName != 'Ti.UI.iOS.NavigationWindow') {
					if (params.navigationWindow) {
						params.navigationWindow.close(params.closeAnimation);
					} else {
						var navigationWindow = getNavigationWindow();
						navigationWindow.closeWindow(win, params.closeAnimation);
					}
				} else {
					// Caution: if win is TabGroup, make sure exitOnClose is false, or it will cause error on Android
					win.close(params.closeAnimation);
				}
			} else {
				params.controller.doHide(params, win);
			}
		}
	}
	
	function windowOpened(e) {
	  	var cache = getCache(-1);
	  	
	  	// TODO: Deprecated
	  	var init = cache.controller.init;
	  	if (init) {
	  		cache.controller.load = init;
	  		Ti.API.error('Window Manager: [exports.init] callback is deprecated.\nPlease use [exports.load] callback instead.');
	  	}
	  	
	  	var load = cache.controller.load;
	  	load && load(cache);  
	}
	
	function windowClosed(e) {
	  	var cache = getCache(-1),
	  		iosback = cache.controller.iosback;
	  	cache._alreadyClosed = true;
	  	loadPrevious(OS_IOS && iosback ? iosback() : null);
	}
	
	function createNavigationWindow(params, win) {
	  	var navigationWindow = Ti.UI.iOS.createNavigationWindow({ window: win });
		params.navigationWindow = navigationWindow;
		navigationWindow.open(params.openAnimation);
	}
	
	function getNavigationWindow() {
	  	var cache = getCache(),
	  		navigationWindow;
	  	for (var i = cache.length - 1; i >= 0; i--) {
	  		var params = cache[i];
			if (params.navigationWindow) {
				navigationWindow = params.navigationWindow;
				break;
			} else if (params.controller.getNavigationWindow) {
				navigationWindow = params.controller.getNavigationWindow();
				break;
			}
		};
		return navigationWindow;
	}
	
	/*
	 params ={
		url: '',			// the url of the window
		data: {},			// data for that window
		reset: false,		// remove previous windows or not, default is false
		openAnimation: null // open animation
		closeAnimation: null // close animation
	 }
	 * */
	function load(params) {
		UICache.load(params);
	};
	
	function getCache(index) {
		return UICache.getCache(index);
	}

	function remove(start, end) {
		// TODO: Deprecated
		Ti.API.error('Window Manager: [remove] function is deprecated.\nPlease use [splice(start, count)] function instead.');
	  	UICache.remove(start, end);
	  	Ti.API.info('Window Manager: Remove from ' + start + ' to ' + end);
	}
	
	function splice(start, count) {
		UICache.splice(start, count);
	}

	function reset() {
	  	UICache.reset();
	}

	/*
	 params:
	 - data: new data for current win
	 - count: number of previous wins will be removed
	 * */
	function loadPrevious(data, count, isReload) {
		return UICache.loadPrevious(data, count, isReload);
	}	
	
	function loadPreviousOrReset(data, count, isReload) {
		// TODO: Deprecated
	  	Ti.API.error('Window Manager: [loadPreviousOrReset] function is deprecated.\nPlease use [loadPrevious] or [reset] function instead.');
		
		if ( count >= getCache().length ) {
			reset();
		} else {
			loadPrevious(data, count, isReload) || reset();	
		}
	}

	/*
	 exit app
	 * */
	function exit() {
		reset();

		// force exit app on Android
		if (OS_ANDROID) {
			var activity = Ti.Android.currentActivity;
			activity && activity.finish();
		}

		Ti.API.info('Window Manager: Exit!');
	}
	
	function androidback(e) {
		var controller = getCache(-1).controller;
		if (controller.androidback && controller.androidback() === false) {
			return;
		}
	
		if (getCache().length > 1) {
			loadPrevious();
		} else {
			fireEvent('window:exit');
		}
	}
	
	function on(type, callback) {
	  	if (events[type]) {
	  		events[type].push(callback);
	  	} else {
	  		events[type] = [callback];
	  	}
	  	return this;
	}
	
	function fireEvent(type, data) {
	  	var callbacks = events[type];
	  	if (callbacks) {
	  		for(var i=0,ii=callbacks.length; i<ii; i++){
				callbacks[i](data, { type: type });
			};
	  	}
	}
	
	// PUBLIC FUNCTIONS ========================================================
	
	return {
		on: on,
		load: load,
		loadPrevious: loadPrevious,
		loadPreviousOrReset: loadPreviousOrReset,
		getCache: getCache,
		remove: remove,
		splice: splice,
		reset: reset,
		exit: exit
	};
};

module.exports = WindowManager;