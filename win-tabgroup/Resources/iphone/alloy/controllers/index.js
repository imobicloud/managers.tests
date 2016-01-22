function Controller() {
    function init() {
        var plugins = require("managers/plugins");
        Alloy.Globals.toggleAI = plugins.toggleAI;
        Alloy.Globals.updateNav = plugins.updateNav;
        var oWindowManager = require("managers/window"), winManager = new oWindowManager(plugins.windowChanged);
        Alloy.Globals.WinManager = winManager;
        winManager.load({
            url: "main_window"
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    init();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;