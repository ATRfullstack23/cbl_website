function ImageFromClipboard() {
    var self = this;
    self.uniqueId = 'IFC_' + Math.floor( Math.random( 100000 ) * 1000000 );
    self.initialize();
    return self;
}


ImageFromClipboard.prototype = {
    initialize: function () {
        var self = this;
        self.createElements();
        self.bindEvents( true );
    },
    bindEvents: function ( all ) {
        var self = this;
        $( document ).on( 'paste.ifc', function () {
            var items = event.clipboardData.items;
            var isImage = items[0].type.indexOf( 'image' ) != -1;
            var blob = items[0].getAsFile();
            var reader = new FileReader();
            reader.onload = function ( event ) {
                if ( isImage ) {
                    if ( self.jcrop ) {
                        self.jcrop.destroy();
                    }
                    self.currentImage = event.target.result;
                    var img = new Image;
                    img.onload = function () {
                        self.currentImageAsImg = img;
                    };
                    img.src = self.currentImage;
                    self.imgMain.css( 'position', 'relative' );
                    self.imgMain.get( 0 ).onload = function () {
                        self.divMain.setCenter( { axis: 'y' } ).css( 'top', '10px' );
                        var width = self.imgMain.width() + 'px';
                        var height = self.imgMain.height() + 'px';
                        self.imgMain.css( { position: 'absolute', minWidth: width, minHeight: height } );
                        self.imgMain.Jcrop( {
                            onSelect: function ( cords ) {
                                self.cords = cords;
                                var myCanvas = document.getElementById( 'canvasMain' );
                                $( myCanvas ).attr( { width: cords.w, height: cords.h } );
                                var ctx = myCanvas.getContext( '2d' );
                                ctx.clearRect( 0, 0, myCanvas.width, myCanvas.height );
                                self.ctx = ctx;
                                self.ctx.drawImage( self.currentImageAsImg, cords.x, cords.y, cords.w, cords.h, 0, 0, cords.w, cords.h );
                            }
                        }, function () {
                            self.jcrop = this;
                        } );
                    };
                    self.imgMain.attr( 'src', self.currentImage );
                }
            };
            reader.readAsDataURL( blob );
            setTimeout( function () {
                window.parentSubModuleConfig.parentSubModule.notifier.show( 'Click and drag on the image to crop' );
            }, 100 );
        } );
        if ( !all )
            return;
        self.container.setMaximized();
        self.btnOk.on( 'click', function () {
            if ( self.save() ) {
                self.btnOk.prop( 'disabled', true );
                self.btnCancel.prop( 'disabled', true );
                self.hide();
            }
        } );
        self.btnCancel.on( 'click', function () {
            self.hide();
        } );
    },
    show: function ( callback ) {
        var self = this;
        self.reset();
        self.bindEvents();
        self.container.show();//.setMaximized( true );
        // self.divMain.setCenter();
        self.callback = callback;
        window.parentSubModuleConfig.parentSubModule.notifier.show( 'Press ctrl + v to insert screenshort' );
        if ( self.jcrop ) {
            self.jcrop.destroy();
            self.imgMain.css( 'position', 'relative' );
        }
    },
    hide: function () {
        var self = this;
        self.container.hide();
        $( document ).off( 'paste.ifc' );
    },
    save: function () {
        var self = this;
        if ( !self.imgMain.attr( 'src' ) )
            return false;
        var dataUri = self.imgMain.attr( 'src' );
        if ( self.cords && ( self.cords.h > 10 || self.cords.w > 10 ) ) {
            dataUri = self.canvasMain.get( 0 ).toDataURL();
        }

        var fileName = 'Screenshot_' + new Date().getTime() + ".png";

        var blob = self.dataURItoBlob( dataUri );

        blob.lastModifiedDate = new Date();
        blob.name = fileName;

        blog.formView.enableDisableSubmit( true );
        blog.parentSubModule.uploadFile(blob, {
            onProgress: function (progressPercent) {
                console.log('onProgress : ' + progressPercent);
            },
            onLoad: function (response) {
                console.log('onLoad : ', response);
                blog.formView.enableDisableSubmit(false);
                if(response.success){
                    // element.data('fileUploadResult', response)
                    self.callback( dataUri, fileName, blob, response )
                }
            }
        });





        // var req = new XMLHttpRequest();
        // var fileName = 'Screenshot_' + Math.floor( Math.random( 100000 ) * 1000000 ) + ".png";
        // req.open( 'POST', Server.FileUploadUrl, true );
        // req.setRequestHeader( 'Content-Type', 'png' );
        // req.setRequestHeader( 'X-File-Name', fileName );
        // req.setRequestHeader( 'X-Rows-Id', blog.rowId );
        // blog.formView.enableDisableSubmit( true );
        // req.onreadystatechange = function () {
        //     if ( req.readyState == 4 ) {
        //         blog.formView.enableDisableSubmit( false );
        //         self.callback( dataUri, fileName );
        //     }
        // }
        // req.send( blob );
        return true;
    },
    reset: function () {
        var self = this;
        self.imgMain.removeAttr( 'src' );
        self.btnOk.prop( 'disabled', false );
        self.btnCancel.prop( 'disabled', false );
    },
    dataURItoBlob: function ( dataURI ) {
        var binary = atob( dataURI.split( ',' )[1] );
        var array = [];
        for ( var i = 0; i < binary.length; i++ ) {
            array.push( binary.charCodeAt( i ) );
        }
        return new Blob( [new Uint8Array( array )], { type: 'image/png' } );
    },
    createElements: function () {
        var self = this;
        var divContainer = $( document.createElement( 'div' ) ).attr( 'id', self.uniqueId ).addClass( 'div-ifc-container' );
        divContainer.html( self._html ).hide().appendTo( document.body );
        self.container = divContainer;
        self.divMain = divContainer.find( '#divMain' );
        self.tableMain = divContainer.find( '#tableMain' );
        self.imgMain = divContainer.find( '#imgMain' );
        self.btnOk = divContainer.find( '#btnOk' );
        self.btnCancel = divContainer.find( '#btnCancel' );
        self.canvasMain = divContainer.find( '#canvasMain' );
    },
    _html: '<div id="divMain">' +
            '<table id="tableMain">' +
                '<tr>' +
                    '<td>' +
                    '<div style="position:relative">' +
                        '<img id="imgMain" class="image-ifc"></img>' +
                    '</div>' +
                    '<canvas id="canvasMain" style="display:none;"></canvas>' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' +
                    '<div style="text-align: center;background:rgba(0,0,0,.1);">' +
                        '<input type="button" class="button-normal" value="Ok" id="btnOk" />' +
                        '<input type="button" class="button-normal" value="Cancel" id="btnCancel" />' +
                    '</div>' +
                    '</td>' +
                '</tr>' +
            '</table>' +
        '</div>'
}

