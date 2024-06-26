 //Plugin List:
//.addOption, add option for select element.
//.addOptionMonthly, add option for select element in monthly.
//.addOptionWeekly, add option for select element in days weekly.
//.addOptionYearly, add option for select element in yearly.
//.bindEnterButton, bind enter key to call specified button.
//.checked, Set input element and beneath to checked.
//.disabled, Set input element and beneath to disabled condition.
//.enabled, Set input element and beneath to enabled condition.
//.inlineLabel, Set inline placeholder label for information.
//.popupArrow, Create a triangle arrow besides element.
//.readOnly, Set input element and beneath to read only.
//.setCenter, Set element position to center.
//.setMaximized, Set element to maximum width/height.
//.setNumeric, Set input element to allow numeric only.
//.typeValue, Set value gradually one by one until the value is finished.
//.waitScreen, Display waiting & loading screen on the element used to disabled the element within.
;(function ($) {
    //value: option value.
    //text(optional): option display text. default take text from value.
    //index(optional): to insert option at specified index number. zero-based number. Auto append if option is less than index. default append at last index.
    $.fn.addOption = function (value, text, index) {
        var element = $(this);

        if (value == null)
            return element;
            
        //validate is select/dropdownlist element
        if (!element.is('select'))
            return element;

        //validate if option value exists
        if (element.find('option[value="' + value + '"]').length)
            return element;

        if (text == null || text == '')
            text = value;
                
        var option = '<option value="' + value + '">' + text + '</option>';
        //index is numeric && has enough option to insert in between
        if (index != null && $.isNumeric(index) && element.find('option').length > index)
            element.find('option').eq(index).before(option);
        else
            element.append(option);

        return element;
    };

    //options(optional): 
    ////valueFormat: month format for option value, default is MMMM.
    ////textFormat: month format for option text display, default is MMMM.
    ////defaultToCurrent: true to set default value to current month, default is false.
    ////caseFormat: 'lower' to set value & text to lower case, 'upper' to set both to upper case, default is null.
    $.fn.addOptionMonthly = function (options) {
        var defaults = { valueFormat: 'MMMM', textFormat: 'MMMM', defaultToCurrent: false, caseFormat: null };
        var settings = $.extend({}, defaults, options);
        
        return this.each(function() {
            var element = $(this);
            
            //validate is select/dropdownlist element
            if (!element.is('select'))
                return element;

            var formatM = ['1','2','3','4','5','6','7','8','9','10','11','12'];
            var formatMM = ['01','02','03','04','05','06','07','08','09','10','11','12'];
            var formatMMM = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var formatMMMM = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            
            var value = [];
            if (settings.valueFormat.toUpperCase() == 'M')  value = formatM; 
            else if (settings.valueFormat.toUpperCase() == 'MM')  value = formatMM;  
            else if (settings.valueFormat.toUpperCase() == 'MMM')  value = formatMMM;  
            else if (settings.valueFormat.toUpperCase() == 'MMMM')  value = formatMMMM;  

            var text = [];
            if (settings.textFormat.toUpperCase() == 'M')  text = formatM; 
            else if (settings.textFormat.toUpperCase() == 'MM')  text = formatMM;  
            else if (settings.textFormat.toUpperCase() == 'MMM')  text = formatMMM;  
            else if (settings.textFormat.toUpperCase() == 'MMMM')  text = formatMMMM;  

            //bind html
            for (var count = 0; count < value.length; count++) {
                var thisValue = value[count];
                var thisText = text[count];

                if (settings.caseFormat && settings.caseFormat.toLowerCase() == 'lower') {
                    thisValue = thisValue.toLowerCase();
                    thisText = thisText.toLowerCase();
                }
                else if (settings.caseFormat && settings.caseFormat.toLowerCase() == 'upper') {
                    thisValue = thisValue.toUpperCase();
                    thisText = thisText.toUpperCase();
                }

                element.addOption(thisValue, thisText);
            }

            //set value to current date
            if (settings.defaultToCurrent) {
                var currentMonth = new Date().getMonth();
                var currentValue = element.find('option').eq(currentMonth).val();
                element.val(currentValue);
            }

            return element;
        });
    };    
    
    //options(optional): 
    ////valueFormat: month format for option value, default is MMMM.
    ////textFormat: month format for option text display, default is MMMM.
    ////defaultToCurrent: true to set default value to current day, default is false.
    ////caseFormat: 'lower' to set value & text to lower case, 'upper' to set both to upper case, default is null.
    ////firstDay: 'sunday' to set first option as sunday instead of default 'monday'.
    $.fn.addOptionWeekly = function (options) {
        var defaults = { valueFormat: 'dddd', textFormat: 'dddd', defaultToCurrent: false, caseFormat: null, firstDay: 'Monday' };
        var settings = $.extend({}, defaults, options);
        
        return this.each(function() {
            var element = $(this);
            
            //validate is select/dropdownlist element
            if (!element.is('select'))
                return element;

            var formatDDD = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
            var formatDDDD = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
            
            var value = [];
            if (settings.valueFormat.toLowerCase() == 'ddd')  value = formatDDD; 
            else if (settings.valueFormat.toLowerCase() == 'dddd')  value = formatDDDD;  

            var text = [];
            if (settings.textFormat.toLowerCase() == 'ddd')  text = formatDDD; 
            else if (settings.textFormat.toLowerCase() == 'dddd')  text = formatDDDD;  

            //bind html
            for (var count = 0; count < value.length; count++) {
                var thisValue = value[count];
                var thisText = text[count];

                if (settings.caseFormat && settings.caseFormat.toLowerCase() == 'lower') {
                    thisValue = thisValue.toLowerCase();
                    thisText = thisText.toLowerCase();
                }
                else if (settings.caseFormat && settings.caseFormat.toLowerCase() == 'upper') {
                    thisValue = thisValue.toUpperCase();
                    thisText = thisText.toUpperCase();
                }

                element.addOption(thisValue, thisText);
            }
            
            //set first day
            if (settings.firstDay.toLowerCase() == 'sunday') {
                var sunday = element.find('option').eq(6);
                var sundayValue = sunday.val();
                var sundayText = sunday.text();
                
                sunday.remove();
                element.addOption(sundayValue, sundayText, 0);
            }

            //set value to current date
            if (settings.defaultToCurrent) {
                var currentDay = new Date().getDay();
                var currentValue = element.find('option').eq(currentDay).val();
                element.val(currentValue);
            }

            return element;
        });
    };

    //options(optional): 
    ////valueFormat: month format for option value, default is MMMM.
    ////textFormat: month format for option text display, default is MMMM.
    ////defaultToCurrent: true to set default value to current month, default is false.
    ////numberOfSelection: the number of selection in select option
    ////minYear: minimum year in select option
    ////maxYear: maximum year in select option
    $.fn.addOptionYearly = function (options) {
        var defaults = { valueFormat: 'YYYY', textFormat: 'YYYY', defaultToCurrent: false, numberOfSelection: 10, minYear: null, maxYear: null };
        var settings = $.extend({}, defaults, options);
        
        return this.each(function() {
            var element = $(this);
            
            //validate is select/dropdownlist element
            if (!element.is('select'))
                return element;

            var value = [];
            var text = [];

            var range = 0;
            var startYear = 0;
            var currentYear = new Date().getYear() + 1900;

            //Calculate range & startYear for selection
            if (settings.minYear != null && settings.maxYear != null) {
                range = parseInt(settings.maxYear) - parseInt(settings.minYear);
                startYear = parseInt(settings.minYear);
            }
            else if (settings.minYear != null && settings.maxYear == null) {
                range = settings.numberOfSelection;
                startYear = parseInt(settings.minYear);
            }
            else if (settings.minYear == null && settings.maxYear != null) {
                range = settings.numberOfSelection;
                startYear = parseInt(settings.maxYear) - range;
            }
            else if (settings.minYear == null && settings.maxYear == null) {
                range = settings.numberOfSelection;
                startYear = currentYear - (range / 2);
            }

            if (range != null && range < 0)
                return element;

            //bind html
            for (var count = 0; count < range; count++) {
                var thisYear = startYear + count;
                var thisValue = (settings.valueFormat == 'YYYY') ? thisYear : thisYear.toString().substring(2);
                var thisText = (settings.textFormat == 'YYYY') ? thisYear : thisYear.toString().substring(2);
                element.addOption(thisValue, thisText);
            }

            //set value to current date
            if (settings.defaultToCurrent) {
                var currentMonth = new Date().getYear();
                var currentValue = element.find('option').eq(currentMonth).val();
                element.val(currentValue);
            }

            return element;
        });
    };    

    //button: button to triggered when entered key
    $.fn.bindEnterButton = function (button) {
        var element = $(this);
        var button = $(button);

        element.off('keypress.enter');
        element.on('keypress.enter', function(event){
            if (event.which != 13)
                return;
                
            button.click(); 
        });

        return element;
    };

    //isChecked(optional): true to checked otherwise false, default is true.
    $.fn.checked = function (isChecked) {
        var element = $(this);
        var checked = true;

        if (isChecked == false)
            checked = false;
            
        element.prop('checked', checked);
        element.find('input[type=checkbox],input[type=radio]').prop('checked', checked);

        return element;
    };
    
    $.fn.disabled = function () {
        var element = $(this);
        var disabled = true;
        
        if (element.is('div[contenteditable]'))
           element.attr('contenteditable', !disabled);

        element.prop('disabled', disabled);
        element.find('div[contenteditable]').attr('contenteditable', !disabled);
        element.find('input').prop('disabled', disabled);
        element.find('select').prop('disabled', disabled);
        element.find('textarea').prop('disabled', disabled);

        return element;
    };

    //isEnabled(optional): true to enabled otherwise false, default is true.
    $.fn.enabled = function (isEnabled) {
        var element = $(this);
        var disabled = false;
        
        if (isEnabled == false)
            disabled = true;
        
        if (element.is('div[contenteditable]'))
           element.attr('contenteditable', !disabled);

        element.prop('disabled', disabled);
        element.find('div[contenteditable]').attr('contenteditable', !disabled);
        element.find('input').prop('disabled', disabled);
        element.find('select').prop('disabled', disabled);
        element.find('textarea').prop('disabled', disabled);

        return element;
    };

    //text: information to display in inline placeholder.
     $.fn.inlineLabel = function (text) {
        var element = $(this);
        var id = 'inlineLabel_' + element.attr('id');
        var template = '<label id="' + id + '"></label>';
        
        if (text == null)
            return;

        //validate is text/select element
        if (!element.is('input:text,input:password,textarea,select'))
            return element;

        if (element.siblings('#' + id).length == 0)
            element.after(template);

        //set inline label css
        var label = element.siblings('#' + id);
        label.css('position', 'absolute');
        label.css('cursor', 'text');
        label.css('padding', element.css('padding'));
        label.css('top', (element.offset().top) + 'px');
        label.css('left',(element.offset().left) + 'px');
        label.css('opacity', 0.5);

        //calculate real position after setting css
        var top = (label.offset().top > element.offset().top) ? label.offset().top - element.offset().top : element.offset().top - label.offset().top;
        var left = (label.offset().left > element.offset().left) ? label.offset().left - element.offset().left : element.offset().left - label.offset().left;
        label.css('top', element.offset().top - top + 1);
        label.css('left', element.offset().left - left + 2);

        //set inline label text
        label.text(text);

        //Bind event
        label.off('click.inlineLabel');
        element.off('keypress.inlineLabel');
        element.off('keyup.inlineLabel');
        element.off('blur.inlineLabel');

        label.on('click.inlineLabel', function() { element.focus() });
        element.on('keypress.inlineLabel', function(){ label.hide(); });
        element.on('keyup.inlineLabel', function(){ if (element.val() != '') label.hide(); });
        element.on('blur.inlineLabel', function(){ if (element.val() == '') label.fadeIn(); });
        
        return element;
    };

    //options(optional): 
    ////direction: specified the direction popup arrow facing. Currently only support 'up'
    ////shapeWidth: number of arrow width (in px)
    ////shapeColor: number of arrow color (in hex)
    ////borderWidth: number of border arrow width (in px)
    ////borderColor: number of border arrow color (in hex)
    ////top: offset top position for the popup arrow (in px), default takes call selector top position
    ////left: offset left position for the popup arrow (in px), default takes call selector left position
    $.fn.popupArrow = function (options) {
        var defaults = { direction: 'up', shapeWidth: 5, shapeColor: null, borderWidth: 1, borderColor: null, top: null, left: null };
        var settings = $.extend({}, defaults, options);

        return this.each(function() {
            var element = $(this);
            
            if (element.attr('id') == null) element.attr('id', 'popupArrow_' + getRandomNumber(5));
            var id = element.attr('id');
            var template = '<div id="arrowBorder_' + id + '" style="position:absolute"></div><div id="arrowShape_' + id + '" style="position:absolute"></div>';
            if (element.find('#' + id).length == 0)
                element.append(template);

            var arrowShape = $('#arrowShape_' + id);
            var arrowBorder = $('#arrowBorder_' + id);
            
            var shapeColor = (settings.shapeColor != null) ? settings.shapeColor : element.css('background-color');
            var borderColor = (settings.borderColor != null) ? settings.borderColor : element.css('border-top-color');
            var shapeWidth = parseInt(settings.shapeWidth) + 'px solid' ;
            var borderWidth = (parseInt(settings.shapeWidth) + parseInt(settings.borderWidth)) + 'px solid' ;
            var zIndex = (element.css('z-index').length) ? element.css('z-index') : 1;

            //Set Direction
            var direction = settings.direction.toLowerCase();
            arrowShape.css('border', shapeWidth + ' transparent');
            arrowBorder.css('border', borderWidth + ' transparent');
            if (direction == 'up')  {
                arrowShape.css('border-top', '').css('border-bottom', shapeWidth + ' '+ shapeColor);
                arrowBorder.css('border-top', '').css('border-bottom', borderWidth + ' '+ borderColor)
            }
            else if (direction == 'bottom')  {
                arrowShape.css('border-bottom', '').css('border-top', shapeWidth + ' '+ shapeColor);
                arrowBorder.css('border-bottom', '').css('border-top', borderWidth + ' '+ borderColor)
            }
            else if (direction == 'left')  {
                arrowShape.css('border-left', '').css('border-right', shapeWidth + ' '+ shapeColor);
                arrowBorder.css('border-left', '').css('border-right', borderWidth + ' '+ borderColor)
            }
            else if (direction == 'right')  {
                arrowShape.css('border-right', '').css('border-left', shapeWidth + ' '+ shapeColor);
                arrowBorder.css('border-right', '').css('border-left', borderWidth + ' '+ borderColor)
            }

            var bufferTop = "";
            if (element.css('position') != 'absolute')
                bufferTop = arrowShape.outerHeight() + 3.5;

            arrowShape.css('top', (settings.top) ? settings.top : element.offset().top - $(window).scrollTop() + 5 - bufferTop);
            arrowShape.css('left', (settings.left) ? settings.left : element.offset().left - $(window).scrollLeft() + 5);
            arrowShape.css('z-index', parseInt(zIndex + 2));

            arrowBorder.css('top', arrowShape.offset().top - parseInt(settings.borderWidth));
            arrowBorder.css('left', arrowShape.offset().left - parseInt(settings.borderWidth));
            arrowBorder.css('z-index', parseInt(zIndex + 1));

            //if absolute push element downwards
            if (element.css('position') == 'absolute') {
                element.css('top', arrowShape.offset().top + arrowShape.outerHeight() - 1);
                element.css('left', arrowShape.offset().left - arrowShape.outerWidth());
            }
        });
    };


    //isReadOnly(optional): true to set readonly otherwise false, default is true.
    $.fn.readOnly = function (isReadOnly) {
        var element = $(this);
        var readOnly = true;

        if (isReadOnly == false)
            readOnly = false;
            
        element.prop('readOnly', readOnly);
        element.find('input').prop('readOnly', readOnly);
        element.find('textarea').prop('readOnly', readOnly);

        return element;
    };

    //options(optional): 
    ////axis: null to set horizontal and vertical. 'x' to set horizontally and 'y' to set vertically.
    ////parent: null to get element.parent(), default takes selector direct parent
    $.fn.setCenter = function (options) {
        var defaults = { axis: null, parent: null };
        var settings = $.extend({}, defaults, options);
        
        return this.each(function() {
            var element = $(this);
            var parent = (settings.parent == null) ? element.parent() : $(settings.parent);
            var isSetHorizontal = (settings.axis == null || settings.axis == 'x');
            var isSetVertical = (settings.axis == null || settings.axis == 'y');

            element.css('position', 'absolute');

            //Vertical Axis
            if (isSetVertical) {
                var top = (parent.height() / 2) - (element.height() / 2);
                top = top + $(window).scrollTop();
                if (parent.offset() && settings.parent != null)
                    top += parent.offset().top;
                element.css('top', top);
            }

            //Horizontal Axis
            if (isSetHorizontal) {
                var left = (parent.width() / 2) - (element.width() / 2);
                left = left + $(window).scrollLeft();
                if (parent.offset() && settings.parent != null)
                    left += parent.offset().left;
                element.css('left', left);
            }

            return element;
        });
    };
    
    //ignoreEvents(optional): true to bind window resize events, default is false.
    $.fn.setMaximized = function (ignoreEvents) {
        var element = $(this);
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var documentHeight = $(document).height();

        if (documentHeight > windowHeight)
            windowHeight = documentHeight;

        element.height(windowHeight).width(windowWidth);

        if (ignoreEvents)
            return element;

        $(window).on('resize.setMaximized', function(){
            if(!element.is(':visible'))
                return;
            element.setMaximized();
        });

        return element;
    };

    //isNumeric(optional): true to set numeric and apply all condition above, otherwise false, default is true
    //options(optional):
    ////allowPoint: true to allow decimal value, otherwise false, default is true
    ////allowMinus: true to allow negative value, otherwise false, default is true
    $.fn.setNumeric = function (isNumeric, options) {
        //if pass only options w/o isNumeric
        if ($.isPlainObject(isNumeric) && options == null) {
            options = isNumeric;
            isNumeric = true;
        }

        var defaults = { allowPoint: true, allowMinus: true };
        var settings = $.extend({}, defaults, options);

        return this.each(function() {
            var element = $(this);

            element.off('keypress.setNumeric');
            if (isNumeric == null || isNumeric == true) {
                element.on('keypress.setNumeric', function (e) {
                    var charCode = (e.which) ? e.which : e.keyCode;
                    var value = element.val();

                    if (settings.allowMinus && charCode == 45)
                        return !(settings.restrictSign && value.indexOf('-') > -1);
                    if (settings.allowPoint && charCode == 46)
                        return !(settings.restrictSign && value.indexOf('.') > -1);
                    if (charCode > 31 && (charCode < 48 || charCode > 57)) 
                        return false;
                });
            }
        });
    };

    //value: value to set
    //options(optional): 
    ////delay: delay the time to set the next value
    $.fn.typeValue = function (value, options) {
        var defaults = { delay: 30 };
        var settings = $.extend({}, defaults, options);

        return this.each(function() {
            var element = $(this);
            
            if (value == null)
                return element;

            //define global variable and clear previous timer
            if (window.globalTimer == null) 
                window.globalTimer = new Array();
            for (var count = 0; count < window.globalTimer.length; count++)
                clearTimeout(window.globalTimer[count]);

            for (var count = value.length + 1; count >= 1; count--) {
                var selfTimer = setTimeout(function () {
                    element.val(value.substring(0, count++));
                    element.text(value.substring(0, count++));
                }, settings.delay * count);
                window.globalTimer.push(selfTimer);
            }
        });
    };
    
    //isWaiting(optional): true to display wait screen and disabled element within otherwise false, default is true.
    //options(optional): 
    ////message: message to display on loading screen.
    ////delay: delay the time to display the screen (in millisec).
    ////duration: time to stop the waiting screen (in millisec), default is infinite.
    ////backCss: modal background css format object.
    ////foreCss: modal popup css format object.
    ////transparency: modal background transparency (in 1.00 based percentage).
    ////fadeIn: fadeIn duration (in millisec).
    ////screen: set selector to highlight the wait screen, default is the calling selector.
    $.fn.waitScreen = function (isWaiting, options) {
        //if pass only options w/o isWaiting
        if ($.isPlainObject(isWaiting) && options == null) {
            options = isWaiting;
            isWaiting = true;
        }
        
        var defaults = { message: 'Loading...', delay: 10, duration: null, backCss: null, foreCss: null, transparency: 0.5, fadeIn: 100, screen: null };
        var settings = $.extend({}, defaults, options);
        var loadingImg = '../Images/loading.gif';

        return this.each(function() {
            var element = ($.isWindow(this)) ? $(document.body) : $(this);

            //assign random id if null
			var id = element.attr('id');
            if (!id) {
				var newId = 'waitScreen_' + getRandomNumber();
                element.attr('id', newId);
				id = newId;
			}
		
            var waitTemplate = '<div id="wait_' + id + '"></div>' ;
            var loadTemplate = '<div id="load_' + id + '">&nbsp;<img src="' + loadingImg + '"/>&nbsp;<span id="message_' + id +'"/></div>';

            if (isWaiting == null || isWaiting == true) {
                //Validation
                if (element.find('#wait_' + id).length == 0)
                    element.append(waitTemplate + loadTemplate);
                    
                //Set waiting screen
                var screen = (settings.screen) ? $(settings.screen) : element;
                var wait = element.find('#wait_' + id);
                wait.height(screen.outerHeight());
                wait.width(screen.outerWidth());
                wait.css('position', 'absolute');
                wait.css('background-color', '#333');
                wait.css('opacity', '0');
                wait.css('top', screen.offset() ? screen.offset().top : 0);
                wait.css('left', screen.offset() ? screen.offset().left : 0);
                if (settings.backCss)  
                    wait.css(settings.backCss);

                //Set loading screen
                var load = element.find('#load_' + id);
                load.css('background-color', '#FFF');
                load.css('border', '1px solid #000');
                load.css('padding', '12px 6px');
                load.css('font-weight', 'bold');
                load.css('opacity', '0');
                load.find('#message_' + id).text(settings.message);
                load.setCenter({parent: wait});
                if (settings.foreCss)  
                    load.css(settings.foreCss);

                //Set delay to display
                setTimeout(function(){
                    wait.animate({ opacity: settings.transparency }, settings.fadeIn);
                    load.animate({ opacity: 1 }, settings.fadeIn);
                }, settings.delay);

                //Set time to hide
                if (settings.duration) 
                    setTimeout(function(){ element.waitScreen(false) }, settings.duration);
            }
            else {
                //Remove waiting / loading screen
                element.find('#wait_' + id).remove();
                element.find('#load_' + id).remove();

                if (id.indexOf('waitScreen_') === 0) {
                    element.removeAttr('id');
				}
            }
        });
    };



    
})(jQuery);




//Method List:
//containValue, returns result whether the search value is within the string value.
//getRandomNumber, returns random number with specified range.
//isNullOrEmpty, indicates whether the specified string is null or empty string.
//prependZero, prepend number of zeroes on the string value.
//removeArrayItem, remove array item from specified index.

//value: string value.
//search: value to search.
//ignoreCase(optional): ignore case when searching.
function containValue(value, search, ignoreCase) {
    if (isNullOrEmpty(value) || isNullOrEmpty(search))
        return null;

    var value = (ignoreCase) ? value.toString().toLowerCase() : value.toString();
    var search = (ignoreCase) ? search.toString().toLowerCase() : search.toString();

    return (value.indexOf(search) > -1);
}

//range(optional): set random number digits.
function getRandomNumber(digit) {
    if (digit == false || $.isNumeric(digit) == false)
        digit = 6;

    var value = Math.random();
    for (var count = 0; count < digit; count++)
        value = value * 10;

    return Math.floor(value);
}

//value: string value.
function isNullOrEmpty(value) {
    return (value == null || value.toString().length == 0);
}

//value: string value.
//digit: number of zeroes to prepend.
function prependZero(value, digit) {
    if (isNullOrEmpty(value) || isNullOrEmpty(digit))
        return value;
        
    var length = value.length ? value.length : 0;
    return length < digit ? prependZero("0" + value, digit) : value;
}

//array: Array object.
//index: array index number to remove.
function removeArrayItem (array, index) {
    if (isNullOrEmpty(array) || isNullOrEmpty(index))
        return array;

    var rest = array.slice(index + 1 || array.length);
    array.length = index < 0 ? array.length + index : index;
    return array.push.apply(array, rest);
};