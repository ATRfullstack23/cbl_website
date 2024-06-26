ImagePopup = function () {
    this.container = $( this._selectors.container );
    this.image = this.container.find( this._selectors.image );
    this.imageDetails = this.container.find( this._selectors.imageDetails );
    this.imageSrc = null;
    this.currentModule = null;
    this.currentRowId = null;
    this.currentColumn = null;
    this.initialized = false;
    this.currentTimeout = 0;
    return this;
}

ImagePopup.prototype = {
    _selectors: { container: '#divImagePopupContainer', closeButton: '#closeButton', image: '#imgOriginal', imageDetails: '#divImageDetails' },
    show: function (imageSrc, imageName) {
        this.image.removeAttr('src').css('opacity', 0);
        if (!this.initialized) {
            this.initialized = true;
            this.container.on('click', function (eve) {
                if ($(eve.target).is('img')){
                    return;
                }
                if ($(eve.target).is('.link-download')){
                    return;
                }
                if ($(eve.target).is('a')){
                    return;
                }
                _imagePopup.hide();
            });
            this.image.load(function () {
                var image = $(this);
                // image.setCenter({ parent: $(window) });
                image.animate({ opacity: 1 }, 500);

                // _imagePopup.imageDetails.setCenter({ parent: $(window) });
                // _imagePopup.imageDetails.css({ top: image.offset().top + image.outerHeight() });
            });
        }
        this.imageSrc = imageSrc;
        this.imageDetails.html('<div class="link-download">Download File: <a title="Click to Download" target="_blank" download="' + imageName + '" href="' + imageSrc + '">' + imageName + '<img src="Images/download.png" style="margin-left:2px; vertical-align:bottom;" /></a></div>');
        this.container.show();
        this.image.attr('src', this.imageSrc).css({ maxHeight: $(window).height() - 75, maxWidth: $(window).width() - 75 });
    },
    hide: function () {
        this.container.hide();
    }
}