
( function(){

    var currentContainer = null;
    var currentColumn = null;
    var elements = {};
    var currentDataTableApi = null;
    var currentParentListener = null;



    function initNewContainer() {

        if (currentContainer.attr('filterable-view-helper-init')) {
            return;
        }

        currentContainer.appendTo(currentContainer.closest('.formview-container'));
        currentContainer.find('.filterableViewHeaderDisplayName').text(currentColumn.displayName);

        bindEvents();

        currentContainer.attr('filterable-view-helper-init', true);
    }

    function bindEvents() {
        currentContainer.on('click', '.filterableViewSaveButton', function () {
            saveAndClose();
        });
        currentContainer.on('click', '.filterableViewCancelButton', function () {
            cancelAndClose();
        });
    }

    function saveAndClose() {
        window._c = currentDataTableApi;
        // var selectedData = currentDataTableApi.rows( { selected: true } ).data();

        var selectedIds = [];

        for(var key in currentSelectedRowIds){
            if(currentSelectedRowIds[key]){
                selectedIds.push( {value : key} );
            }
        }

        currentParentListener.onSave(selectedIds);
        close();
    }

    function cancelAndClose() {
        currentParentListener.onCancel();
        close();
    }

    function close() {

        elements.currentFilterableViewFilters.empty();
        // currentDataTableApi.destroy();
        // elements.currentFilterableViewResultsTableMain.empty();

        currentSelectedRowIds = {};

        currentContainer.fadeOut();
        currentContainer = null;
        currentColumn = null;
    }

    function forEachFilter(eachFunction, filterFunction){
        var self = this;
        for(var key in filters){
            var filter = filters[key];
            if(filterFunction){
                if(filterFunction(filter)){
                    eachFunction.apply(filter, [filter]);
                }
            }
            else{
                eachFunction.apply(filter, [filter]);
            }
        }
        return self;
    }







    function updateFilterValuesFromElement(filter) {
        var filterValue = null;
        switch (filter.type){
            case 'text':
                filterValue = filter.elements.actualElement.val();
                break;

            case 'choice':
                filterValue = [];
                var checkedElements = filter.elements.actualElement.find('input:checked');
                if(checkedElements.length){
                    checkedElements.each(function () {
                        filterValue.push($(this).attr('data-value'))
                    })
                }
                break;
        }
        filter.selectedValue = filterValue;
        return filterValue;
    }


    function createFilterElement(filter) {
        var elementWrapper = $(document.createElement('div'))
            .attr('data-id', filter.id)
            .attr('data-type', filter.type)
            .attr('class', 'filterableViewFilterElementWrapper');


        var displayNameElement = $(document.createElement('div'));
        displayNameElement
            .text(filter.displayName)
            .attr('class', 'filterableViewFilterElementDisplayName')
            .appendTo(elementWrapper);


        var actualElement = null;
        switch (filter.type){
            case 'text':
                actualElement = $(document.createElement('input')).attr('type', 'search');
                break;
            case 'checkbox':
                actualElement = $(document.createElement('input')).attr('type', 'checkbox');
                break;
            case 'choice':
                actualElement = $(document.createElement('ul'));

                filter.items.forEach(function (itemObj) {
                    var li =  $(document.createElement('li'));

                    var tempId = filter.id + '_item_' + getRandomId();

                    li.html(' <input type="checkbox" data-value="'+ itemObj +'" id="'+ tempId +'" > <label for="'+tempId+'">'+ itemObj +'</label> ');
                    li.appendTo(actualElement);
                });

                break;
        }

        actualElement
            .attr('class', 'filterableViewFilterElementActualElement')
            .appendTo(elementWrapper);

        actualElement.on('change', function () {
            updateFilterValuesFromElement(filter);

            setTimeout(function () {
                updateMainTableBasedOnFilter();
            }, 100);
        });

        filter.elements.elementWrapper = elementWrapper;
        filter.elements.actualElement = actualElement;

        return elementWrapper;
    }





    var filters = {};
    var lookUpData = [];


    function getLatestDataAndShow(selectedValuesToSet) {
        lookUpData = currentColumn.lookUpDataBackUp;
        filters = JSON.parse(JSON.stringify( currentColumn.lookUpDataBackUp_filterConfiguration ));

        window._fi = filters;

        forEachFilter(function (filter) {
            filter.items = [];
            lookUpData.forEach(function (dataRow) {
                var value = dataRow[filter.id];

                if(!value){
                    return;
                }

                if(filter.items.indexOf(value) === -1){
                    filter.items.push( value );
                }
            });

        }, function (filter) {
            return filter.type == 'choice';
        });


        forEachFilter(function (filter) {

            filter.elements = {};

            var elementWrapper = createFilterElement(filter);
            elementWrapper.appendTo(elements.currentFilterableViewFilters);

        });

        currentSelectedRowIds = {};

        if(selectedValuesToSet){
            selectedValuesToSet.forEach(function (dRow) {
                currentSelectedRowIds[dRow.value] = true;
            });
            console.log('rowIdsToSelect', currentSelectedRowIds);

        }

        updateMainTableBasedOnFilter();
    }


    var currentSelectedRowIds = {};

    function initMainTable() {
        if (elements.currentFilterableViewResultsTableMain.attr('filterable-view-helper-init')) {
            return;
        }
        elements.currentFilterableViewResultsTableMain.attr('filterable-view-helper-init', true);

        forEachFilter(function (filter) {
            if(filter.hideFromGrid){
                return;
            }
            var th = $(document.createElement('th'));
            th.text(filter.displayName);
            th.attr('data-id', filter.id);
            elements.currentFilterableViewResultsTableMain.find('thead tr').append(th);
        });


        // "order": [[ idIndex, "desc" ]],


        elements.currentFilterableViewResultsTableMain.dataTable({
            "aLengthMenu": [[25, 50,75,100, -1], [25, 50, 75,100, "All"]],
            bSort: true,
            "columnDefs": [
                {
                    orderable: false,
                    "targets": 0,
                    className: 'select-checkbox',
                }
            ],
            select: {
                style: 'multi',
                selector: 'td'
            },
            "createdRow": function(row, data, dataIndex){
                // console.log('created', row, data)
                $(row).attr("id", "tblRow_" + data[0]);
            }
        });
        currentDataTableApi = elements.currentFilterableViewResultsTableMain.api();

        currentDataTableApi.on('select', function ( e, dt, type, indexes ) {
            var selectedRowId = dt.data()[0];
            currentSelectedRowIds[selectedRowId] = true;
            console.log('select new row id : ', selectedRowId );
        });

        currentDataTableApi.on('deselect', function ( e, dt, type, indexes ) {
            var selectedRowId = dt.data()[0];
            currentSelectedRowIds[selectedRowId] = false;
            console.log('select new row id : ', selectedRowId );
        });

    }



    function isMatching(filter, dataRow) {
        var filterValue = filter.selectedValue;

        if(filterValue === null){
            return true;
        }
        if(filterValue === undefined){
            return true;
        }
        if(filterValue instanceof Array && filterValue.length == 0){
            return true;
        }

        var dbValue = dataRow[filter.id];
        var isMatching = false;

        switch (filter.type){
            case 'choice':
                for(var i=0; i< filterValue.length; i++){
                    if(dbValue == filterValue[i]){
                        isMatching = true;
                    }
                }
                break;
            case 'text':
                if(dbValue && dbValue.toLowerCase().indexOf( filterValue.toLowerCase() ) != -1 ){
                    isMatching = true;
                }
                break;
            case 'checkbox':
                // isMatching = (filterValue == dbValue);
                isMatching = true;
                break;
        }

        console.log("isMatching : ", filterValue, dbValue, isMatching);


        return isMatching;
    }

    function updateMainTableBasedOnFilter() {
        initMainTable();


        // if(!selectedValuesToSet){
        //     selectedValuesToSet = [];
        //     var alreadySelectedDataRows = currentDataTableApi.rows( { selected: true } ).data();
        //
        //     for(var index=0; index < alreadySelectedDataRows.length; index++){
        //         selectedValuesToSet.push(alreadySelectedDataRows[index][0]);
        //     }
        // }

        console.log("updateMainTableBasedOnFilter", currentSelectedRowIds)


        currentDataTableApi.clear();

        var filteredLookUpData = [];

        var filterKeysArr = Object.keys(filters);

        lookUpData.forEach(function(dataRow){

            for(var i=0; i< filterKeysArr.length; i++){
                if( !isMatching(filters[ filterKeysArr[i] ], dataRow) ){
                    return;
                }
            }
            filteredLookUpData.push(dataRow);
        });

        filteredLookUpData.forEach(function(dataRow){
            var rowValueArray = [];
            rowValueArray.push(dataRow['value']);
            rowValueArray.push(dataRow['text']);

            forEachFilter(function (filter) {

                if(filter.hideFromGrid){
                    return;
                }

                rowValueArray.push(dataRow[filter.id]);
            })

            currentDataTableApi.row.add(rowValueArray);
        });

        currentDataTableApi.draw();
        window._cc = currentSelectedRowIds;

        if(currentSelectedRowIds){

            console.log('currentSelectedRowIds', currentSelectedRowIds)
            var rowsToSelect = currentDataTableApi.rows(function(row, dRow){

                console.log('currentSelectedRowIds : ', dRow[0], currentSelectedRowIds[dRow[0]])

                if(currentSelectedRowIds[dRow[0]]){
                    return true;
                }
                else{
                    return false;
                }
            });

            console.log('currentSelectedRowIds rowsToSelect', rowsToSelect)

            rowsToSelect.select();
        }

    }


    window.FilterableViewHelper = {

        show: function (column, element, mode, selectedValues, listener) {
            currentColumn = column;
            currentContainer = element;
            currentParentListener = listener;

            initNewContainer();

            elements = {};
            elements.currentFilterableViewFilters = currentContainer.find('.filterableViewFilters');
            elements.currentFilterableViewResultsTableMain = currentContainer.find('.filterableViewResultsTableMain');

            currentContainer.fadeIn('fast');

            getLatestDataAndShow(selectedValues);

        }
    }



})();






