/**
 * Created by Akhil Sekharan on 16-03-2016.
 */





function ProductBarcodePrintHelper(config){
    var self = this;
    self.config = config || {};
    self.initialize();
    return self;
}

ProductBarcodePrintHelper.prototype = {
    constants: {
    },
    selectors: {
        container: "#productBarcodePrintHelper",

        lblHeaderText: "#lblHeaderText",
        lblModel: "#lblModel",
        lblStyle: "#lblStyle",
        lblSize: "#lblSize",
        lblMrp: "#lblMrp",

        btnPrint: "#btnPrint",
        btnCancel: "#btnCancel",
        iNumberOfCopies: "#iNumberOfCopies",
        iPackedDate: "#iPackedDate",
        ddlOrientation: "#ddlOrientation",
    },
    html:{
        container: ' 	 <dialog id="productBarcodePrintHelper">  	     <form id="productBarcodePrintHelperForm">  	         <div class="form">  	             <div class="header">  	                 <span>Print Product Barcode</span>  	             </div>  	   	             <div class="content">  	   	                 <div class="productDetails">  	                     <div>  	                         <span>HeaderText</span>  	                         <span>:</span>  	                         <span id="lblHeaderText"></span>  	                     </div>  	                     <div>  	                         <span>Model</span>  	                         <span>:</span>  	                         <span id="lblModel"></span>  	                     </div>  	                     <div>  	                         <span>Style</span>  	                         <span>:</span>  	                         <span id="lblStyle"></span>  	                     </div>  	                     <div>  	                         <span>Size</span>  	                         <span>:</span>  	                         <span id="lblSize"></span>  	                     </div>  	                     <!--<div>-->  	                         <!--<span>Pkd Dt</span>-->  	                         <!--<span>:</span>-->  	                         <!--<span id="lblPackedDate"></span>-->  	                     <!--</div>-->  	                     <div>  	                         <span>MRP</span>  	                         <span>:</span>  	                         <span id="lblMrp"></span>  	                     </div>  	                 </div>  	   	   	                 <div class="formItem">  	                     <div>Packed Date</div>  	                     <input id="iPackedDate" required type="date">  	                 </div>  	   	                 <div class="formItem">  	                     <div>Number Of Copies</div>  	                     <input id="iNumberOfCopies" value="2" required placeholder="only even numbers" type="number">  	                 </div>  	   	                 <div class="formItem">  	                     <div>Orientation</div>  	                     <select id="ddlOrientation">  	                         <option value="portrait">Portrait</option>  	                         <option value="landscape" default-value>Landscape</option>  	                     </select>  	                 </div>  	             </div>  	   	             <div class="footer">  	                 <button id="btnPrint" type="submit">Print</button>  	                 <button id="btnCancel" type="button">Cancel</button>  	             </div>  	         </div>  	   	     </form>  	   	   	 </dialog>  '
    },
    initialize: function(){
        var self = this;
        self.elements = {};
        $(self.html.container).appendTo(document.body);
        self.container = $(self.selectors.container);
        self.elements.container = self.container;

        self.formElements = {}
        self.formElements.form = self.container.find('form').get(0);
        self.initializeForm();

        self.initializeButtons();
        return self;
    },
    setProductDetails: function(product){
        var self = this;

        self.container.find(self.selectors.lblHeaderText)
            .text(product.headerText);
        self.container.find(self.selectors.lblModel)
            .text(product.model);
        self.container.find(self.selectors.lblStyle)
            .text(product.style);
        self.container.find(self.selectors.lblSize)
            .text(product.size);
        //self.container.find(self.selectors.lblPackedDate)
        //    .text(product.packedDate);
        self.container.find(self.selectors.lblMrp)
            .text(product.mrp);
        return self;
    },
    initializeForm: function(){
        var self = this;

        self.formElements.iNumberOfCopies = self.container.find(self.selectors.iNumberOfCopies);
        self.formElements.iPackedDate = self.container.find(self.selectors.iPackedDate);
        self.formElements.ddlOrientation = self.container.find(self.selectors.ddlOrientation);

        return self;
    },
    resetForm: function(){
        var self = this;

        self.formElements.iNumberOfCopies.val(2);
        self.formElements.iPackedDate.val( moment().format('YYYY-MM-DD') );
        self.formElements.ddlOrientation.find('option[default-value]').attr('selected', 'selected');

        return self;
    },
    initializeButtons: function () {
        var self = this;
        self.elements.buttons = {};
        self.elements.buttons.btnPrint = self.container.find(self.selectors.btnPrint);
        self.elements.buttons.btnPrint.on('click', function(eve){
            if(self.formElements.form.checkValidity()){
                eve.preventDefault();
            }
            else{
                return;
            }


            var config = self.getFormData();
            if(!config){
                return;
            }

            self.showProgressBar();
            self.doPrinting(config, function(err){
                self.hideProgressBar();
                if(err){
                    alert('Error printing barcode ' + err);
                    return;
                }

				self.hide();
				
                console.log('Printing barcode done Successfully', err);
            });
        });

        self.elements.buttons.btnCancel = self.container.find(self.selectors.btnCancel);
        self.elements.buttons.btnCancel.on('click', function(){

            self.cancel();
        });

        return self;
    },
    doPrinting: function(config, doPrintingCallback){
        var self = this;

        var data = {
            config: config
        };

        var url = 'http://localhost:14001/printProduct/@orientation@/?_source=@source@';
        url = url.replace('@orientation@', config.orientation);
        url = url.replace('@source@', encodeURIComponent(JSON.stringify(data)) );

        $.ajax({
            type : 'GET',
            url: url
        }).done(function (response) {
            console.log('done', response);
            doPrintingCallback && doPrintingCallback(null, response);

        }).fail(function (error){
            console.log('fail', error);
            doPrintingCallback && doPrintingCallback(error);
        });

        return self;
    },
    showProgressBar: function(){
        var self = this;
        self.container.addClass('showLoadingOverlay');
        return self;
    },
    hideProgressBar: function(){
        var self = this;
        self.container.removeClass('showLoadingOverlay');
        return self;
    },
    getFormData: function(){
        var self = this;

        if(self.formElements.iNumberOfCopies.val() % 2 == 1){
            alert('Please enter even number for the copies');
            return;
        }

        var config = JSON.parse( JSON.stringify( self.config.product ) );
        config.packedDate = moment( self.formElements.iPackedDate.val() ).format( 'DD/MM/YY' );
        config.numberOfPrints = Math.ceil(self.formElements.iNumberOfCopies.val() / 2);
        config.orientation = self.formElements.ddlOrientation.val()

        return config;
    },
    cancel: function(){
        var self = this;
        self.hide();
        return self;
    },
    hide: function(){
        var self = this;
        this.callback && this.callback();
        this.callback = null;
        self.container.get(0).close();
        return self;
    },
    show: function(product, callback){
        var self = this;
        self.config.product = product;
        self.callback = callback;
        self.container.get(0).showModal();
        self.resetForm();
        self.setProductDetails(self.config.product);
        return self;
    }

}



window.productBarcodePrintHelper = new ProductBarcodePrintHelper();

//var productInfo = {
//    headerText : temp1.subcategoryName.text,
//    model : temp1.productName.value,
//    style: temp1.style.text,
//    size: temp1.productSize.text,
//    mrp: temp1.mrp.value,
//    productId: temp1.id
//}


//productBarcodePrintHelper.show({
//        "headerText":"Cotton Semi Casual Shirts",
//        "model":"SD 3450",
//        "style":"Fullsleev",
//        "size":"L",
//        "packedDate":"21/03/2013",
//        "mrp":"465",
//        "productId":12345
//    }
//);