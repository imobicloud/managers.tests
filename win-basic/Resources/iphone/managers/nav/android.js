function createMenuItems(e) {
    var array = (nav.leftNavButtons || []).concat(nav.rightNavButtons || []);
    array.forEach(function(button) {
        null == button.showAsAction && (button.showAsAction = Ti.Android.SHOW_AS_ACTION_ALWAYS);
        var menuItem = e.menu.add(button);
        button.callback && menuItem.addEventListener("click", button.callback);
    });
}

function updateActionBar(actionBar) {
    if (nav.title) {
        actionBar.title = nav.title;
        actionBar.setDisplayShowTitleEnabled(true);
    }
    if (nav.titleImage) {
        actionBar.icon = nav.titleImage;
        actionBar.setDisplayShowHomeEnabled(true);
    }
    nav.backgroundImage && (actionBar.backgroundImage = nav.backgroundImage);
    if (nav.homeAction) actionBar.onHomeIconItemSelected = nav.homeAction; else if (nav.backAction) {
        actionBar.displayHomeAsUp = true;
        actionBar.onHomeIconItemSelected = nav.backAction;
    }
}

var nav;

exports.load = function(win, _nav) {
    nav = _nav;
    var activity = win.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = createMenuItems;
        if (activity.actionBar) {
            updateActionBar(activity.actionBar);
            activity.invalidateOptionsMenu();
        }
    }
};