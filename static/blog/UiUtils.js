UiUtils = function () {
    return this;
}

UiUtils.prototype = {
    setToCenterOfParent: function ( obj, parentObj ) {
        var height = $( obj ).height();
        var width = $( obj ).width();
        if ( parentObj == window ) {
            $( obj ).css( 'top', ( $( parentObj ).height() / 2 ) - ( height / 2 ) );
            $( obj ).css( 'left', ( $( parentObj ).width() / 2 ) - ( width / 2 ) );
        }
        else {
            $( obj ).css( 'top', ( $( parentObj ).height() / 2 ) - ( height / 2 ) + $( parentObj ).position().top );
            $( obj ).css( 'left', ( $( parentObj ).width() / 2 ) - ( width / 2 ) + $( parentObj ).position().left );
        }
    }
}