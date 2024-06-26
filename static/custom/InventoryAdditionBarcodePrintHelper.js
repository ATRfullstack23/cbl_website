/**
 * Created by Akhil Sekharan on 16-03-2016.
 */



function InventoryAdditionBarcodePrintHelper(config){
    var self = this;
    self.config = config || {};
    self.initialize();
    return self;
}

InventoryAdditionBarcodePrintHelper.prototype = {
    constants: {
    },
    selectors: {
        container: "#inventoryAdditionBarcodePrintHelper",

        lblinventoryAdditionNumber: "#lblinventoryAdditionNumber",

        tblProductsToPrint: "#tblProductsToPrint",

        iPackedDate: "#iPackedDate",

        btnPrint: "#btnPrint",
        btnCancel: "#btnCancel"
    },
    html:{
        container: '<dialog id="inventoryAdditionBarcodePrintHelper">  	     <form id="inventoryAdditionBarcodePrintHelperForm">  	         <div class="form">  	             <div class="header">  	                 <span>Print Barcode (Box)</span>  	             </div>  	   	             <div class="content">  	   	                 <div class="inventoryAdditionDetails">  	                     <div>  	                         <span>inventoryAddition No</span>  	                         <span>:</span>  	                         <span id="lblinventoryAdditionNumber"></span>  	                     </div>  	   	                     <div>  	                         <span>Products</span>  	                         <hr />  	                         <table id="tblProductsToPrint">  	                             <thead>  	                             <tr>  	                                 <th>Item</th>  	                                 <th>Count</th>  	                             </tr>  	   	                             </thead>  	                             <tbody>  	                             </tbody>  	                         </table>  	   	                     </div>  	   	   	   	                 </div><div class="formItem">     <div>Packed Date</div>     <input id="iPackedDate" required type="date"></div></div>  	   	             <div class="footer">  	                 <button id="btnPrint" type="submit">Print</button>  	                 <button id="btnCancel" type="button">Cancel</button>  	             </div>  	         </div>  	   	     </form>  	   	   	 </dialog>'
    },
    initialize: function(){
        var self = this;
        self.elements = {};

        $(self.html.container).appendTo(document.body); //-- need to enable later

        self.container = $(self.selectors.container);
        self.elements.container = self.container;

        self.formElements = {}
        self.formElements.form = self.container.find('form').get(0);
        self.initializeForm();

        self.initializeButtons();
        return self;
    },
    setinventoryAdditionDetails: function(inventoryAddition){
        var self = this;

        self.container.find(self.selectors.lblinventoryAdditionNumber)
            .text(inventoryAddition.inventoryAdditionNumber);

        var tableBody = self.container.find(self.selectors.tblProductsToPrint).find('tbody');
        tableBody.empty();

        inventoryAddition.products.forEach(function(product){
            var tr = document.createElement('tr');

            var td1 = document.createElement('td');
            td1.innerHTML = product.headerText;
            tr.appendChild(td1);

            var td2 = document.createElement('td');
            td2.innerHTML = product.numberOfItems;
            tr.appendChild(td2);

            tableBody.append(tr);
        });

        return self;
    },
    initializeForm: function(){
        var self = this;

        //self.formElements.iNumberOfCopies = self.container.find(self.selectors.iNumberOfCopies);
        self.formElements.iPackedDate = self.container.find(self.selectors.iPackedDate);
        //self.formElements.ddlOrientation = self.container.find(self.selectors.ddlOrientation);

        return self;
    },
    resetForm: function(){
        var self = this;

        //self.formElements.iNumberOfCopies.val(2);
        self.formElements.iPackedDate.val( moment().format('YYYY-MM-DD') );
        //self.formElements.ddlOrientation.find('option[default-value]').attr('selected', 'selected');

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


            self.showProgressBar();
            self.doPrinting(self.config.inventoryAddition, function(err){
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
    doPrinting: function(inventoryAddition, doPrintingCallback){
        var self = this;
        async.mapSeries(inventoryAddition.products, function(product, next){
            self.doPrintingForSingleProduct(product, function(err){
                next(err);
            })
        }, function(err, results){
            doPrintingCallback && doPrintingCallback(err, results);
        });

        return self;
    },
    doPrintingForSingleProduct: function(config, doPrintingForSingleProductCallback){
        var self = this;

        var packedDate = moment( self.formElements.iPackedDate.val() ).format( 'DD/MM/YY' );
        config.packedDate = packedDate;
        var data = {
            config: config
        };

        var url = 'http://localhost:14001/printProduct/@orientation@/?_source=@source@';
        url = url.replace('@orientation@', 'landscape');
        url = url.replace('@source@', encodeURIComponent(JSON.stringify(data)) );

        $.ajax({
            type : 'GET',
            url: url
        }).done(function (response) {
            console.log('done', response);
            doPrintingForSingleProductCallback && doPrintingForSingleProductCallback(null, response);

        }).fail(function (error){
            console.log('fail', error);
            doPrintingForSingleProductCallback && doPrintingForSingleProductCallback(error);
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
        config.packedDate = moment( self.formElements.iPackedDate.val() ).format( 'DD/MM/YYYY' );
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
    show: function(inventoryAddition, callback){
        var self = this;
        self.resetForm();
        self.config.inventoryAddition = inventoryAddition;
        self.callback = callback;
        self.container.get(0).showModal();
        self.setinventoryAdditionDetails(self.config.inventoryAddition);
        return self;
    }

}



//window.inventoryAdditionBarcodePrintHelper = new inventoryAdditionBarcodePrintHelper();

//var productInfo = {
//    headerText : temp1.subcategoryName.text,
//    model : temp1.productName.value,
//    style: temp1.style.text,
//    size: temp1.productSize.text,
//    mrp: temp1.mrp.value,
//    productId: temp1.id
//}

//
//inventoryAdditionBarcodePrintHelper.show({
//    inventoryAdditionNumber : 1002,
//    products: [
//        {
//            "headerText":"Cotton Semi Casual Shirts",
//            "model":"SD 3450",
//            "style":"Fullsleev",
//            "size":"L",
//            "packedDate":"21/03/2013",
//            "mrp":"465",
//            "productId":12345,
//            "numberOfItems": 1
//        }
//    ]
//});

//inventoryAdditionBarcodePrintHelper.show({
//    inventoryAdditionNumber : 1002,
//    products: [
//        {
//            "headerText":"Cotton Semi Casual Shirts",
//            "model":"SD 3450",
//            "style":"Fullsleev",
//            "size":"L",
//            "packedDate":"21/03/2013",
//            "mrp":"465",
//            "productId":12345,
//            "numberOfItems": 1,
//        },
//        {
//            "headerText":"T Shirt Mine",
//            "model":"X 555",
//            "style":"Half Tone",
//            "size":"M",
//            "packedDate":"1/11/2014",
//            "mrp":"300",
//            "productId":5237,
//            "numberOfItems": 1
//        }
//    ]
//});