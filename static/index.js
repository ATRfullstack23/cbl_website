/**
 * Created by Akhil Sekharan on 6/3/14.
 */
 
var tableMenu = $('#menu');
var screens = {
    products:{
        splitLayout: new SplitLayout({
            container: $('#productsSplitLayout'),
            targetContainer: 'body',
            direction: 'bottom',
            zIndex: 999,
            pageSize: "100%",
            closeButton: ".closeSplitLayoutButton",
            onShowForFirstTime: function(){
//            self.setDefaultReport();
            },
            onAfterShow: function(splitLayout){
//        console.log('hiding')
            },
            onAfterHide: function(splitLayout){

            }
        }),
        scroller: new Scroller({
            container: "#productsScroller",
            onChange: function(item){
                item.find('.to-animate').addClass('animate-bounce-in')
            }
        })
    },
    services:{
        splitLayout: new SplitLayout({
            container: $('#servicesSplitLayout'),
            targetContainer: 'body',
            direction: 'bottom',
            zIndex: 999,
            pageSize: "100%",
            closeButton: ".closeSplitLayoutButton",
            onShowForFirstTime: function(){
//            self.setDefaultReport();
            },
            onAfterShow: function(splitLayout){
//        console.log('hiding')
            },
            onAfterHide: function(splitLayout){

            }
        })
    },
    about:{
        splitLayout: new SplitLayout({
            container: $('#aboutSplitLayout'),
            targetContainer: 'body',
            direction: 'bottom',
            zIndex: 999,
            pageSize: "100%",
            closeButton: ".closeSplitLayoutButton",
            onShowForFirstTime: function(){
//            self.setDefaultReport();
            },
            onAfterShow: function(splitLayout){
//        console.log('hiding')
            },
            onAfterHide: function(splitLayout){

            }
        })
    },
    contact:{
        splitLayout: new SplitLayout({
            container: $('#contactSplitLayout'),
            targetContainer: 'body',
            direction: 'bottom',
            zIndex: 999,
            pageSize: "100%",
            closeButton: ".closeSplitLayoutButton",
            onShowForFirstTime: function(){
//            self.setDefaultReport();
            },
            onAfterShow: function(splitLayout){
//        console.log('hiding')
            },
            onAfterHide: function(splitLayout){

            }
        })
    }
};
tableMenu.on('click', '.menuItem', function(){
   var element = $(this);
    var screenId = element.attr('data-screen');
    window.screens[screenId].splitLayout.show();
});