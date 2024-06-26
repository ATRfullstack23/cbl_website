/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function Pager(config, parentObject) {
    var self = this;
    self.parentObject  = parentObject;
    self.grid = parentObject;
    self.id = self.parentObject.id +'_pager';
    self.config = config;
    self.initialize();
    return self;
}

Pager.prototype = {
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }
        if(!self.pageSize){
            self.pageSize = 10;
        }
        if(typeof self.pageSize === 'string'){
            self.pageSize = parseInt(self.pageSize);
        }
        self.pageIndex = 1;
        self.selectedPageIndex = 1;
        self.createElements();
//        self.pagesContainer = self.element.find('#pager_pages_panel');
        self.selectedPageIndex = 1;
        self.bindEvents();
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    getPagerFilter: function(){
        var self = this;
        var obj = {};
        obj.pageIndex = parseInt(self.selectedPageIndex);
        obj.pageSize = parseInt(self.pageSize);
        return obj;
    },
    updateUi: function(data){
        var self = this;
        for(var key in data){
            self[key] = data[key];
        }
        if(self.totalRows){
            if(typeof self.pageSize === 'string'){
                self.pageSize = parseInt(self.pageSize);
            }
            self.totalPages =  parseInt(self.totalRows/ self.pageSize);
            if(self.totalRows % self.pageSize != 0){
                self.totalPages++;
            }
            self.startIndex = (self.pageSize * (self.selectedPageIndex-1)) + 1;
            self.endIndex = self.startIndex  + (self.pageSize-1);
            if(self.endIndex > self.totalRows){
                self.endIndex = self.totalRows;
            }
            self.elements.pages.parent().show();
            self._creation.createPageNumbers(self);
            self.container.find('[data-value]').removeAttr('disabled');
            if(self.selectedPageIndex === 1){
                self.container.find('[data-value="first"],[data-value="prev"]').attr('disabled', 'disabled');
            }
            if(self.selectedPageIndex === self.totalPages){
                self.container.find('[data-value="last"],[data-value="next"]').attr('disabled', 'disabled');
            }
        }
        else{
            self.totalPages = 0;
            self.startIndex = 0;
            self.endIndex = 0;
            self.elements.pages.parent().hide();
        }
        self.elements.startNo.text(self.startIndex);
        self.elements.endNo.text(self.endIndex || self.totalRows);
        self.elements.totalNo.text(self.totalRows);
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.container.on('click', '.pager-page-item', function(){
            var element = $(this);
            if(element.data('id')){
                self.setSelectedPageIndex(parseInt(element.data('id')));
            }
            else{
                self.setRelativePageIndex(element.data('value'));
            }
        });
        return self;
    },
    setRelativePageIndex: function(value){
        var self = this;
        var index = self.selectedPageIndex;
        switch (value){
            case 'first':
                index = 1;
                break;
            case 'prev':
                index--;
                break;
            case 'next':
                index++;
                break;
            case 'last':
                index = self.totalPages;
                break;
        }
        self.setSelectedPageIndex(index);
        return self;
    },
    setSelectedPageIndex: function(index, preventChange){
        var self = this;
        self.selectedPageIndex = index;
        if(!preventChange){
            self.grid.getData();
        }
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    getRowSelectorElements: function(){
        var self = this;
        return self.grid.find('.grid-row-selector');
    },
    show: function () {
        var self = this;
        self.container.show();
        return self;
    },
    hide: function () {
        var self = this;
        self.container.hide();
        return self;
    },
    cancel: function () {
        var self = this;
        return self;
    },
    _creation : {
        createContainer: function(pager){
            var div = $(document.createElement('div')).attr({id: pager.id , class: 'pager-panel'});
            return div;
        },
        createElements: function(pager){
            var self = this;
            var elements = {};
            pager.elements = elements;
            var container = self.createContainer(pager);
            var table = document.createElement('table');
            table.className = 'pager-main hundred-percent-x';
            var tr = document.createElement('tr');
            var tdInformation = document.createElement('td');
            var tdPages = document.createElement('td');

            var informationElement = self.createInformationElement(pager);
            tdInformation.appendChild(informationElement);
            var pagesElement = self.createPagesElement(pager);
            tdPages.appendChild(pagesElement);

            tr.appendChild(tdInformation);
            tr.appendChild(tdPages);

            table.appendChild(tr);
            container.append(table);

            elements.container = container;
            elements.information = $(informationElement);
            elements.pages = $(pagesElement).find('#pager_pages_panel');
            elements.startNo = elements.information.find('#start_no');
            elements.endNo = elements.information.find('#end_no');
            elements.totalNo = elements.information.find('#total_no');

            pager.container = container;

            return container;
        },
        createInformationElement: function(pager){
            var self = this;
            var div = document.createElement('div');
            var defaultElements = ['Showing ', '@start_no', ' to ', '@end_no', ' out of ', '@total_no'];
            defaultElements.forEach(function(item){
                var span = document.createElement('span');
                span.className = 'pager-information-item';
                if(item.indexOf('@')===0){
                    span.id = item.substring(1);
                }
                else{
                    span.innerHTML = item;
                }
                div.appendChild(span);
            });
            return div;
        },
        createPageNumbers: function(pager){
            var self = this;
            var arr = [];
            var start = 1;
            var end = pager.totalPages;
            if(pager.selectedPageIndex > 5){
                start = pager.selectedPageIndex - 5;
            }
            if(end - pager.selectedPageIndex > 5){
                end = pager.selectedPageIndex+5;
            }
            for(var i=start;i <= end; i++){
                var span = document.createElement('span');
                span.className = 'pager-page-item';
                span.innerHTML = i;
                span.setAttribute('data-id', i);
                if(i == pager.selectedPageIndex){
                    span.className += ' pager-page-item-selected';
                }
                arr.push(span);
            }
            pager.elements.pages.empty().append(arr);
            return self;
        },
        createPagesElement: function(pager){
            var self = this;
            var div = document.createElement('div');
            div.className = 'pager-page-item-panel';
            var defaultElements = [{text: 'First', data: 'first'}, {text: 'Previous', data: 'prev'}, {text: '@pager_pages_panel'}, {text: 'Next', data: 'next'}, {text: 'Last', data: 'last'}];
            defaultElements.forEach(function(item){
                var span = document.createElement('span');
                if(item.text.indexOf('@')===0){
                    span.id = item.text.substring(1);
                }
                else{
                    span.className = 'pager-page-item';
                    span.innerHTML = item.text;
                    span.setAttribute('data-value', item.data);
                }
                div.appendChild(span);
            });
            return div;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}