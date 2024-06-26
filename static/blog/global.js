var blog;
var _ui;
var _utils;
var _imagePopup;
$( function () {
    _ui = new UiUtils();
    _utils = new Utils();
    _imagePopup = new ImagePopup();
} );

function closeBlogView() {
    parentSubModuleConfig.parentSubModule.setDisplayMode(parentSubModuleConfig.parentSubModule.displayMode);
    $( parentSubModuleConfig.mainDoc.body ).find( '#iframe_' + parentSubModuleConfig.hyperlinkColumn.uniqueName ).remove();
}