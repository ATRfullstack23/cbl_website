function CustomXMLHttpRequest( method, url, async, comment ) {
    var req = new XMLHttpRequest();
    if ( method ) {
        req.open( method, url, async );
        if ( method == 'POST' )
            req.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
    }
    return req;
}

function decode( str ) {
    for ( var key in _encoding ) {
        if ( str.indexOf( _encoding[key].encoded ) != -1 ) {
            var reg = new RegExp( _encoding[key].encoded, 'g' );
            str = str.replace( reg, _encoding[key].decoded );
        }
    }
    return str;
}

Utils = function () {

}

Utils.prototype = {
    getQueryStrings: function () {
        var assoc = {};
        var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
        var queryString = location.search.substring(1);
        var keyValues = queryString.split('&');

        for (var i in keyValues) {
            var key = keyValues[i].split('=');
            if (key.length > 1) {
                assoc[decode(key[0])] = decode(key[1]);
            }
        }
        return assoc;
    },

    getSubstring: function (mainStr, startStr, endStr) {
        var start = mainStr.indexOf(startStr) + startStr.length;
        var end = mainStr.indexOf(endStr);
        return mainStr.substring(start, end);
    },

    getLastEditDateString: function (lastEditDate) {
        var value = lastEditDate.toLocaleString();
        var year = 31536000;
        var month = 259200;
        var day = 86400;
        var hour = 3600;
        var minute = 60;
        var now = new Date();
        var diffTime = now.getTime() - lastEditDate.getTime();
        var diffSecond = Math.round(diffTime / 1000);
        //more than a year
        if (diffSecond > year) {
            value = '';
        }
        //more than a month
        if (diffSecond > month) {
            value = Math.round(diffSecond / day) + ' month(s) ago';
        }
        //more than a day
        if (diffSecond > day) {
            value = Math.round(diffSecond / day) + ' day(s) ago';
        }        
        //within a day
        else if (diffSecond > hour) {
            value = Math.round(diffSecond / hour) + ' hour(s) ago';
        }    
        //within an hour
        else if (diffSecond > minute) {
            value = Math.round(diffSecond / minute) + ' minute(s) ago';
        }
        //within a minute
        else {
           value = 'just now';
        }

        return value;
    },
}

function isThumbnailCreationSupportedForExtension(actualExtension) {
    if(!actualExtension){
        return false;
    }
    if (actualExtension == 'jpg' || actualExtension == 'jpeg' || actualExtension == 'png' || actualExtension == 'gif') {
        return true;
    }
    return false;
}

function getImageInfoFromFile(file, getImageInfoFromFileCallback) {
    var fr = new FileReader;

    var fileName = file.name;
    var extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();


    var result = {
        filename :  fileName,
        extension :  extension,
    }


    if(!isThumbnailCreationSupportedForExtension(extension)){
        getImageInfoFromFileCallback(null, result);
        return;
    }

    fr.onload = function() { // file is loaded
        var img = new Image;

        img.onload = function() {
            result.width = img.width;
            result.height = img.height;
            if(result.width > result.height){
                result.orientation = 'landscape';
            }
            else if(result.width === result.height){
                result.orientation = 'square';
            }
            else{
                result.orientation = 'portrait';
            }

            getImageInfoFromFileCallback(null, result);
        };

        img.src = fr.result;
    };

    fr.readAsDataURL(file);
}


function findObjectInArray(array, properties, value) {
    return $.grep(array, function (n, i) {
        return n[properties] == value;
    });
};


