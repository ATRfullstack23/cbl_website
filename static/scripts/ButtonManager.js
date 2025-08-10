/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function ButtonManager(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subModule = parentObject;
    self.module = self.subModule.module;
    self.erp = self.module.erp;
    self.id = self.subModule.id +'_button_manager';
    self.initialize();
    return self;
}

ButtonManager.prototype = {
    constants:{
        defaultButtonsContainer:{
            "class": "defaultButtonsContainer"
        },
        searchButtonsContainer:{
            "class": "searchButtonsContainer"
        },
        setDisplayModeToThumbnailView:{
            "class":"setDisplayModeToThumbnailView icon",
            title: "Thumbnail View"
        },
        set_display_mode_to_master_detail_view:{
            "class":"set_display_mode_to_master_detail_view icon",
            title: "Master Detail View"
        },
        setDisplayModeToCalendarView:{
            "class":"setDisplayModeToCalendarView icon",
            title: "Calendar View"
        },
        setDisplayModeToGridView:{
            "class": "setDisplayModeToGridView icon",
            title: "Grid View"
        },
        setDisplayModeToDirectCreateView:{
            "class": "setDisplayModeToDirectCreateView icon",
            title: "Direct Create View"
        },
        showSearchContainer:{
            "class": "showSearchContainer icon"
        } ,
        clearSearch:{
            "class": "clearSearch icon"
        },
        setDisplayModeButtonsContainer:{
            "class": "setDisplayModeButtonsContainer"
        },
        gridViewButtonsContainer:{
            "class": "gridViewButtonsContainer"
        },
        buttonManagerGridViewTableMain:{
            "class": "hundred-percent-x"
        },
        tdSearch:{
            "class": "searchButtonsContainerParent"
        },
        easyAccessingReportButton:{
            "class": "easyAccessingReportButton"
        },
        buttonGroup:{
            "class": "buttonGroup"
        },
        "groupButtonContainer":{
            "class":"groupButtonContainer"
        },
        showFiltersPopupButton:{
            "class":"show_filters_popup_button"
        }
    },
    initialize: function () {
        var self = this;

        self.initializeButtonGroups();

        self.initializeButtons();

        self.gridViewButtons = {};
        self.gridViewButtonsOrder = [];
        self.forEachButton(function(button, index){
            self.gridViewButtons[button.id] = button;
            if(!button.gridView){
                button.gridView = {};
            }
            button.gridView.index = index;

            self.gridViewButtonsOrder[button.gridView.index] = button.id;
        }, function(button){
            return button.hasGridViewButton;
            return true;
        });
        self.gridViewButtonsOrder.reverse();//Need to reverse

        self.elements = {};
        self.formViewButtons = {};
        self.formViewButtonsOrder = [];
        self.childSubReports = {};

        self.forEachButton(function(button, index){
            self.formViewButtons[button.id] = button;
            if(!button.formView){
                button.formView = {index: index};
            }
            self.formViewButtonsOrder[index] = button.id;
        }, function(button){
            return button.hasFormViewButton;
        });


        if(self.erp.user.userDetails.settings[self.subModule.id +'_buttonsOrder']){
            var buttonsOrder = self.erp.user.userDetails.settings[self.subModule.id +'_buttonsOrder'];
            if(buttonsOrder.gridViewButtonsOrder){
                self.gridViewButtonsOrder = buttonsOrder.gridViewButtonsOrder;
            }
//            if(buttonsOrder.formViewButtonsOrder && buttonsOrder.formViewButtonsOrder.length){
//                self.formViewButtonsOrder = buttonsOrder.formViewButtonsOrder;
//            }
        }

        self.gridViewElement = self._creation.createGridViewElement(self);
        if(self.subModule.hasFormViewMode){
            self.formViewElement = self._creation.createFormViewElement(self);
        }
        self.bindEvents();
        if(!self.subModule.filterManager.hasFilterPanelFilters){
            self.elements.searchButtonsContainer.hide();
        }

        return self;
    },
    initializeButtonGroups: function(){
        var self = this;
        self.buttonGroup = self.subModule.buttonGroups
        return self;
    }
    ,
    initializeButtons: function(){
        var self = this;
        self.buttons = {};
        self.visibilitySettings = self.subModule.visibilitySettings['buttons'] || {};

        for(var key in self.config){
            var buttonConfig = self.config[key];
            if(self.visibilitySettings[buttonConfig.id]) {
                if (!self.visibilitySettings[buttonConfig.id].isVisible) {
                    buttonConfig.hasGridViewButton = false;
                    buttonConfig.hasFormViewButton = false;
                    buttonConfig.hasContextMenuViewButton = false;
                    buttonConfig.hideButtonWhenDisabled = true;
                }
            }

            var button = new Button( buttonConfig, self);
            self.buttons[button.id] = button;
        }
        return self;
    },
    initializeContextMenu: function(){
        var self = this;
        if(self.erp.deviceType != ERP.DEVICE_TYPES.MOBILE){
            self.contextMenu = new ContextMenu({
                targetContainer: $(self.subModule.container).add(self.subModule.formView.container),
                targetAreas: [



                    {
                        selector: ".gridViewButtonsContainer button",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};

                            var option = {};
                            option.displayName = 'Edit Button';
                            option.id = 'edit_button_settings';
                            option.onClick = function(){
                                self.show_edit_button_settings_popup(actualElement);
                            }
                            options[option.id] = option;

                            return options;

                        }
                    },

                    {
                        selector: ".filter-container",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};

                            var option = {};
                            option.displayName = 'Edit Filter';
                            option.id = 'edit_filter_settings';
                            option.onClick = function(){
                                self.subModule.filterManager.show_edit_filter_settings_popup(actualElement);
                            }
                            options[option.id] = option;

                            return options;
                        }
                    },
                    {
                        selector: ".filter-tabPanel",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};
                            var option = {};
                            option.displayName = 'Re-Arrange Filters';
                            option.id = 'reArrangeFilters';
                            option.onClick = function(){
                                self.subModule.filterManager.setToReArrangeMode(self);
                            }
                            options[option.id] = option;
                            if(targetElement.data('help')){
                                option = {};
                                option.displayName = 'Help';
                                option.id = 'help';
                                option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                    var filterContainer = $(rightClickedEvent.target).closest('.filter-container');
                                    var containerData = filterContainer.data('help');
                                    self.erp.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                                }
                                options[option.id] = option;
                            }

                            return options;

                        }
                    },

                    // {
                    //     selector: ".pager",
                    //     getOptions: function(actualElement, contextMenu, targetElement){
                    //         var options = {};
                    //         var option = {};
                    //         option.displayName = 'Re-Arrange Grid';
                    //         option.id = 'reArrangeGrid';
                    //         option.onClick = function(){
                    //             self.subModule.grid.setToReArrangeMode(self);
                    //         }
                    //         options[option.id] = option;
                    //         if(targetElement.data('help')){
                    //             option = {};
                    //             option.displayName = 'Help';
                    //             option.id = 'help';
                    //             option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                    //                 var containerData = $(rightClickedEvent.target).data('help');
                    //                 self.erp.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                    //             }
                    //             options[option.id] = option;
                    //         }
                    //         return options;
                    //     }
                    // },

                    {
                        selector: ".grid-header",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};
                            // var option = {};
                            // option.displayName = 'Re-Arrange Grid';
                            // option.id = 'reArrangeGrid';
                            // option.onClick = function(){
                            //     self.subModule.grid.setToReArrangeMode(self);
                            // }
                            // options[option.id] = option;

                            let option = {};
                            option.displayName = 'Download As Excel File';
                            option.id = 'downloadAsExcelFile';
                            option.onClick = function(){
                                var referenceValue = ''
                                if(self.module.isInChildWindow){
                                    referenceValue = self.module.parentWindow.elements.divReferenceMessage.text();
                                }
                                else{
                                    referenceValue = self.module.displayName;
                                }
                                self.subModule.grid.elements.columnChooserExcelHeading
                                    .val(referenceValue);
                                self.subModule.grid.elements.columnChooserContainer.get(0).showModal();
                            }
                            if(self.subModule.config.gridView && self.subModule.config.gridView.enableGridDownload){
                                options[option.id] = option;
                            }

                            if(targetElement.data('help')){
                                option = {};
                                option.displayName = 'Help';
                                option.id = 'help';
                                option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                    var gridTd = $(rightClickedEvent.target).closest('th');
                                    var containerData = gridTd.data('help');
                                    self.erp.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                                }
                                options[option.id] = option;
                            }

                            return options;
                        }
                    },

                    {
                        selector: ".simpleDataTable-container",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};
                            var option = {};
                            option.displayName = 'Re-Arrange Columns';
                            option.id = 'reArrangeGrid';
                            option.onClick = function(){
                                self.subModule.formView.setSimpleDataTableToReSizeMode(element.closest('.formView-subForm_create').data('id'));
                            }
                            options[option.id] = option;
                            if(targetElement.data('help')){
                                option = {};
                                option.displayName = 'Help';
                                option.id = 'help';
                                option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                    var containerData = $(rightClickedEvent.target).data('help');
                                    self.erp.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                                }
                                options[option.id] = option;
                            }

                            return options;
                        }
                    },

                    {
                        selector: ".buttonsRow",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};
                            if(targetElement.data('help')){
                                var option = {};
                                option.displayName = 'Help';
                                option.id = 'help';
                                option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                    var containerData = $(rightClickedEvent.target).data('help');
                                    self.erp.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                                }
                                options[option.id] = option;
                            }

                            return options;
                        }
                    },
                    {
                        selector: ".formview-header-table",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};

                            if(!self.subModule.formView.is_in_styling_mode){
                                options.go_to_styling_mode = {
                                    id: 'go_to_styling_mode',
                                    displayName: 'Edit Styling',
                                    onClick: ()=>{
                                        self.subModule.formView.go_to_styling_mode();
                                    }
                                }
                            }
                            else{
                                if(self.subModule.formView.display_styling_mode === 'custom_size'){
                                    options.set_to_full_size_mode = {
                                        id: 'set_to_full_size_mode',
                                        displayName: 'Use Full Size',
                                        onClick: ()=>{
                                            self.subModule.formView.set_to_full_size_mode();
                                        }
                                    }
                                }
                                else{
                                    options.set_to_custom_size_mode = {
                                        id: 'set_to_custom_size_mode',
                                        displayName: 'Use Custom Size',
                                        onClick: ()=>{
                                            self.subModule.formView.set_to_custom_size_mode();
                                        }
                                    }
                                }


                                options.save_styling_settings = {
                                    id: 'save_styling_settings',
                                    displayName: 'Save New Styling',
                                    onClick: ()=>{
                                        self.subModule.formView.exit_styling_mode(true);
                                    }
                                }
                                options.cancel_styling_settings = {
                                    id: 'cancel_styling_settings',
                                    displayName: 'Cancel Styling',
                                    onClick: ()=>{
                                        self.subModule.formView.exit_styling_mode(false);
                                    }
                                }
                            }

                            return options;
                        }
                    },
                    {
                        selector: ".formview-column-holder",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};

                            if(!self.subModule.formView.is_in_styling_mode){
                                return {};
                            }

                            const column_id = element.attr('data-column_id')


                            options.edit_formview_normal_element_settings = {
                                id: 'edit_formview_normal_element_settings',
                                displayName: 'Edit Settings',
                                onClick: ()=>{
                                    self.subModule.formView.show_edit_formview_normal_element_popup(column_id, 'column', element);
                                }
                            }

                            // console.log('formview-column-holder contextMenu', contextMenu)
                            // console.log('formview-column-holder targetElement', targetElement)

                            for (const key of Object.keys(FormView.COLUMN_STACK_STYLES)) {

                                const final_key = key + '';
                                const context_menu_key = `set_column_style__${key}`;
                                options[context_menu_key] = {
                                    id: context_menu_key,
                                    displayName: `Set Style -> ${FormView.COLUMN_STACK_STYLES[key].display_name}`,
                                    onClick: ()=>{
                                        self.subModule.formView.update_column_stack_style(column_id, element, final_key);
                                    }
                                }
                            }

                            options.move_all_form_items_to_next_row_upwards = {
                                id: 'move_all_form_items_to_next_row_upwards',
                                displayName: 'Move All Row Items -> Up',
                                onClick: ()=>{
                                    self.subModule.formView.move_all_form_items_to_next_row(column_id, element, 'up');
                                }
                            }

                            options.move_all_form_items_to_next_row_downwards = {
                                id: 'move_all_form_items_to_next_row_downwards',
                                displayName: 'Move All Row Items -> Down',
                                onClick: ()=>{
                                    self.subModule.formView.move_all_form_items_to_next_row(column_id, element, 'down');
                                }
                            }


                            // options.set_column_style_to_horizontal_stack_display_name_100px = {
                            //     id: 'set_column_style_to_horizontal_stack_display_name_100px',
                            //     displayName: 'Form Element Style -> Horizontal Short Name',
                            //     onClick: ()=>{
                            //         self.subModule.formView.update_column_stack_style(column_id, element, 'horizontal_stack_display_name_100px');
                            //     }
                            // }
                            // options.set_column_style_to_horizontal_stack_display_name_200px = {
                            //     id: 'set_column_style_to_horizontal_stack_display_name_200px',
                            //     displayName: 'Form Element Style -> Horizontal Long Name',
                            //     onClick: ()=>{
                            //         self.subModule.formView.update_column_stack_style(column_id, element, 'horizontal_stack_display_name_200px');
                            //     }
                            // }


                            return options;
                        }
                    },
                    {
                        selector: ".form_view_custom_element",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};

                            if(!self.subModule.formView.is_in_styling_mode){
                                return {};
                            }

                            const custom_element_id = element.attr('data-custom_element_id')


                            // console.log('formview-column-holder contextMenu', contextMenu)
                            // console.log('formview-column-holder targetElement', targetElement)

                            options.edit_formview_normal_element_settings = {
                                id: 'edit_formview_normal_element_settings',
                                displayName: 'Edit Settings',
                                onClick: ()=>{
                                    self.subModule.formView.show_edit_formview_normal_element_popup(custom_element_id, 'custom', element);
                                }
                            }


                            options.edit_custom_element_settings = {
                                id: 'edit_custom_element_settings',
                                displayName: 'Edit Custom Element',
                                onClick: ()=>{
                                    self.subModule.formView.show_edit_custom_element_popup(custom_element_id, element);
                                }
                            }

                            options.delete_custom_element = {
                                id: 'delete_custom_element',
                                displayName: 'Delete Custom Element',
                                onClick: ()=>{
                                    self.subModule.formView.verify_with_user_and_delete_custom_element(custom_element_id, element);
                                }
                            }


                            return options;
                        }
                    },
                    {
                        selector: ".form_view_table_cell:is(:empty)",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};

                            if(!self.subModule.formView.is_in_styling_mode){
                                return {};
                            }



                            // console.log('formview-column-holder contextMenu', contextMenu)
                            // console.log('formview-column-holder targetElement', targetElement)

                            for (const key of Object.keys(FormView.CUSTOM_ELEMENTS)) {

                                const final_key = key + '';
                                const context_menu_key = `add_custom_element__${key}`;
                                options[context_menu_key] = {
                                    id: context_menu_key,
                                    displayName: `Add Element -> ${FormView.CUSTOM_ELEMENTS[key].display_name}`,
                                    onClick: ()=>{
                                        self.subModule.formView.mount_custom_element(null, final_key, element, null).then(()=>{
                                            // custom element mounted
                                        });
                                    }
                                }
                            }



                            return options;
                        }
                    },

                    {
                        selector: ".buttonsRow",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};

                            if(self.subModule.displayMode === 'thumbnailView'){
                                for (const key of Object.keys(CardView.TEMPLATES)) {
                                    const final_key = key + '';
                                    const context_menu_key = `add_custom_element__${key}`;
                                    options[context_menu_key] = {
                                        id: context_menu_key,
                                        displayName: `Change View -> ${CardView.TEMPLATES[key].display_name}`,
                                        onClick: ()=>{
                                            self.subModule.update_card_view_style_to_new_type(final_key).then(()=>{
                                                // custom element mounted
                                            });
                                        }
                                    }
                                }
                            }


                            return options;

                        }
                    },
                    {
                        selector: ".cards_container",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};

                            if(targetElement.is(actualElement)){
                                options.edit_card_view_data_mapping_config = {
                                    id: 'edit_card_view_data_mapping_config',
                                    displayName: 'Edit Data Mapping',
                                    onClick: ()=>{
                                        self.subModule.cardViewHelper.show_edit_card_view_data_mapping_popup();
                                    }
                                }
                            }

                            return options;

                        }
                    },

                    {
                        selector: ".single_data_row_of_submodule",
                        onContextMenu: function(element, contextMenu){
                            self.selectUnselectAllRows(false, true);
                            if(self.subModule.displayMode === SubModule.DISPLAY_MODES.GRID_VIEW){
                                self.rowSelectorChanged(element.find('.grid-row-selector').prop('checked', true));
                            }
                            else{
                                self.rowSelectorChanged(element.find('.card-row-selector').prop('checked', true));
                            }

                        },
                        onContextMenuHide: function(element){
                            self.selectUnselectAllRows(false);
//                        self.rowSelectorChanged(element.find('.grid-row-selector')
//                            .prop('checked', true));
                        },
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};
                            var option = {};
                            for(var key in self.parentObject.buttonGroups){
                                option = {};
                                var groupConfig = self.parentObject.buttonGroups[key];
                                option.displayName = groupConfig.displayName;
                                option.id = groupConfig.id;
                                option.hasSubMenu = true;
                                option.subMenu = {};
                                options[option.id] = option;
                            }
                            self.forEachGridViewButton(function(button){
                                option = {};
                                option.displayName = button.displayName;
                                option.id = button.id;
                                option.onClick = function(){
                                    button.triggerEvent(Button.BUTTON_MODES.GRID, 'click');
                                };
                                if(button.gridView && button.gridView.groupId){
                                    options[button.gridView.groupId].subMenu[option.id] = option;
                                }
                                else{
                                    options[option.id] = option;
                                }

                            }, function(button){
                                if(button.hasContextMenuButton){
                                    return !button.disabled;
                                }
                            });

                            if(targetElement.data('help')){
                                option = {};
                                option.displayName = 'Help';
                                option.id = 'help';
                                option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                    var gridTd = $(rightClickedEvent.target).closest('td');
                                    var containerData = gridTd.data('help');
                                    self.erp.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                                }
                                options[option.id] = option;
                            }

                            for(var key in options){
                                if(options[key].hasSubMenu && Object.keys(options[key].subMenu).length == 0){
                                    delete options[key]
                                }
                            }

                            return options;
                        }
                    },



                    {
                        selector: ".setDisplayModeToGridView ",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};

                            if(!self.subModule.grid.is_in_styling_mode){
                                options.go_to_styling_mode = {
                                    id: 'go_to_styling_mode',
                                    displayName: 'Edit Styling',
                                    onClick: ()=>{
                                        self.subModule.grid.go_to_styling_mode();
                                    }
                                }
                            }
                            else{


                                options.save_styling_settings = {
                                    id: 'save_styling_settings',
                                    displayName: 'Save New Styling',
                                    onClick: ()=>{
                                        self.subModule.grid.exit_styling_mode(true);
                                    }
                                }

                                options.cancel_styling_settings = {
                                    id: 'cancel_styling_settings',
                                    displayName: 'Cancel Styling',
                                    onClick: ()=>{
                                        self.subModule.grid.exit_styling_mode(false);
                                    }
                                }
                            }

                            return options;
                        }
                    },
                    {
                        selector: ".pager",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};

                            if(!self.subModule.grid.is_in_styling_mode){
                               return;
                            }

                            for (const key of Object.keys(Grid.CUSTOM_ELEMENTS)) {

                                const final_key = key + '';
                                const context_menu_key = `add_custom_element__${key}`;
                                options[context_menu_key] = {
                                    id: context_menu_key,
                                    displayName: `Add Element -> ${Grid.CUSTOM_ELEMENTS[key].display_name}`,
                                    onClick: ()=>{
                                        self.subModule.grid.mount_new_custom_element(final_key).then(()=>{
                                            // custom element mounted
                                        });
                                    }
                                }
                            }

                            return options;
                        }
                    },
                    {
                        selector: ".grid_view_th_column",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};

                            if(!self.subModule.grid.is_in_styling_mode){
                                return {};
                            }

                            const column_id = element.attr('data-column_id')

                            options.edit_grid_view_normal_element_settings = {
                                id: 'edit_grid_view_normal_element_settings',
                                displayName: 'Edit Settings',
                                onClick: ()=>{
                                    self.subModule.grid.show_edit_grid_normal_element_popup(column_id, 'column', element);
                                }
                            }


                            if(element.index() > 1){
                                options.move_grid_column_to_left = {
                                    id: 'move_grid_column_to_left',
                                    displayName: 'Move Left',
                                    onClick: ()=>{
                                        self.subModule.grid.move_grid_column(element, 'left');
                                    }
                                }
                            }

                            if(element.index() < (element.parent().children().length - 1)){
                                options.move_grid_column_to_right = {
                                    id: 'move_grid_column_to_right',
                                    displayName: 'Move Right',
                                    onClick: ()=>{
                                        self.subModule.grid.move_grid_column(element, 'right');
                                    }
                                }
                            }



                            return options;
                        }
                    },
                    {
                        selector: ".grid_view_custom_element_th_column",
                        getOptions: function(element, contextMenu, targetElement){
                            var options = {};

                            if(!self.subModule.grid.is_in_styling_mode){
                                return {};
                            }

                            const custom_element_id = element.attr('data-custom_element_id')


                            // console.log('formview-column-holder contextMenu', contextMenu)
                            // console.log('formview-column-holder targetElement', targetElement)

                            options.edit_grid_view_normal_element_settings = {
                                id: 'edit_grid_view_normal_element_settings',
                                displayName: 'Edit Settings',
                                onClick: ()=>{
                                    self.subModule.grid.show_edit_grid_normal_element_popup(custom_element_id, 'custom', element);
                                }
                            }


                            options.edit_custom_element_settings = {
                                id: 'edit_custom_element_settings',
                                displayName: 'Edit Custom Element',
                                onClick: ()=>{
                                    self.subModule.grid.show_edit_custom_element_popup(custom_element_id, element);
                                }
                            }

                            options.delete_custom_element = {
                                id: 'delete_custom_element',
                                displayName: 'Delete Custom Element',
                                onClick: ()=>{
                                    self.subModule.grid.verify_with_user_and_delete_custom_element(custom_element_id, element);
                                }
                            }


                            return options;
                        }
                    },
                ]
            }, self);
        }

        return self;
    },
    setDisplayModeIconSelected: function(displayMode){
        var self = this;
        self.defaultButtons.setDisplayModeButtonsContainer.children('.selected').removeClass('selected')
        switch (displayMode){
            case SubModule.DISPLAY_MODES.THUMBNAIL_VIEW:
                self.defaultButtons.setDisplayModeToThumbnailView.addClass('selected');
                break;
            case SubModule.DISPLAY_MODES.GRID_VIEW:
                self.defaultButtons.setDisplayModeToGridView.addClass('selected');
                break;
            case SubModule.DISPLAY_MODES.CALENDAR_VIEW:
                self.defaultButtons.setDisplayModeToCalendarView.addClass('selected');
                break;
            case SubModule.DISPLAY_MODES.DIRECTCREATE_VIEW:
                self.defaultButtons.setDisplayModeToDirectCreateView.addClass('selected');
                break;
        }
        return self;
    },
    initializeChildReports: function(){
        var self = this;
        self.initializeChildSubReportsButtons();
        return self;
    },
    initializeChildSubReportsButtons: function(){
        var self = this;
        var childSubReports = self.parentObject.childSubReports;
        for(var key in childSubReports){
            var subReportObj = childSubReports[key];

            var report = self.erp.reports[subReportObj.reportId];
            var subReport = report.subReports[subReportObj.subReportId];

            var subReportIcon = '';
            if(subReport.customIcon == ''){
                subReportIcon = 'url(pics/'+subReport.icon+')';
            }
            else {
                var reportId = report.id;
                var subReportId = subReport.id;
                subReportIcon = 'url(iconsGenerated/'+reportId+'/'+subReportId+'_'+subReport.customIcon.originalName+')';
            }

            var easyAccessingReportButton = $(document.createElement('div'))
                .attr(self.constants.easyAccessingReportButton)
                .attr({'title':subReport.displayName,'data-ReportId':subReport.parentObject.id,'data-SubReportId':subReport.id})
                .css({'background-image': subReportIcon});

            var setDisplayModeButtonsContainer = self.gridViewElement.find('.setDisplayModeButtonsContainer');
            setDisplayModeButtonsContainer.append(easyAccessingReportButton);
        }

        return self;
    },
    bindEvents: function () {
        var self = this;

        if(self.subModule.hasGridViewMode){
            self.defaultButtons.setDisplayModeToGridView.on('click',function(){
                self.subModule.setDisplayMode(SubModule.DISPLAY_MODES.GRID_VIEW);
            });
        }
        if(self.subModule.hasThumbnailViewMode){
            self.defaultButtons.setDisplayModeToThumbnailView.on('click',function(){
                self.subModule.setDisplayMode(SubModule.DISPLAY_MODES.THUMBNAIL_VIEW);
            });
        }
        if(self.subModule.hasMasterDetailViewMode){
            self.defaultButtons.set_display_mode_to_master_detail_view.on('click',function(){
                self.subModule.setDisplayMode(SubModule.DISPLAY_MODES.MASTER_DETAIL_VIEW);
            });
        }
        if(self.subModule.hasCalendarViewMode){
            self.defaultButtons.setDisplayModeToCalendarView.on('click',function(){
                self.subModule.setDisplayMode(SubModule.DISPLAY_MODES.CALENDAR_VIEW);
            });
        }
        if(self.subModule.hasDirectCreateView){
            self.defaultButtons.setDisplayModeToDirectCreateView.on('click',function(){
                self.subModule.setDisplayMode(SubModule.DISPLAY_MODES.DIRECTCREATE_VIEW);
            });
        }

        if(self.subModule.filterManager.get_filter_count()){
            self.defaultButtons.showFiltersPopupButton.on('click',function(){
                self.subModule.filterManager.show_as_side_popup();
            });
        }

        self.defaultButtons.showSearchContainer.on('click',function(){
            self.parentObject.filterManager.show();
        });

        self.defaultButtons.clearSearch.on('click',function(){
            self.parentObject.filterManager.clearSearch();
            self.hideClearSearchButton();
        });

        self.defaultButtons.setDisplayModeButtonsContainer.on('click','.'+self.constants.easyAccessingReportButton.class,function(){
            self.subModule.config.easyAccessReportView = true;
            $(document.body).addClass('easyAccessReportView');
            var easyAccessReportButton = $(this);
            self.parentObject.container.children('table').addClass('tableAnimationForChildSubReport')

            var childSubReportsContainer = self.subModule.elements.childSubReportsContainer;
            childSubReportsContainer
                .css({'display':'block'});
            setTimeout(function() {
                childSubReportsContainer.addClass('childSubReportsContainerAnimation');
            },5);

            var reportId = easyAccessReportButton.attr('data-ReportId');
            var subReportId = easyAccessReportButton.attr('data-SubReportId');


            if(!easyAccessReportButton.attr('initialized')){
                self.subModule.initializeEasyAccessSubReport(reportId,subReportId);
                easyAccessReportButton.attr({'initialized':true})
            }

            var subReport = self.currentSelectedEasyAccessReport = self.subModule.childSubReports[subReportId];
            subReport.show();
            subReport.refreshAllItems();

        });

        return self;
    },
    showClearSearchButton: function(){
        var self = this;
        self.defaultButtons.clearSearch.show();
        return self;
    },
    hideClearSearchButton: function(){
        var self = this;
        self.defaultButtons.clearSearch.hide();

        return self;
    },
    show      : function () {
        var self = this;
        return self;
    },
    hide      : function () {
        var self = this;
        return self;
    },
    cancel    : function () {
        var self = this;
        return self;
    },
    handleKeyDown: function(keyCode){
        var self = this;
        var ret = true;
        self.forEachButton(function(button){
            var buttonMode = Button.BUTTON_MODES.GRID;
            button.triggerEvent(buttonMode, 'click');
            ret = false;
        }, function(button){
            var ret = false;
            if(button.shortCutKey && button.shortCutKey.isEnabled &&  button.shortCutKey.shortCutKey == keyCode){
                ret = true;
            }
            return ret;
        });
        return ret;
    },
    getButtonObjectFromType: function(buttonType){
        var self = this;
        var button;
        for(var key in self.buttons){
            if(self.buttons[key].type === buttonType){
                button = self.buttons[key];
                break;
            }
        }
        return button;
    },
    forEachButton: function(eachFunction, filterFunction){
        var self = this;
        var count = 0;
        for(var key in self.buttons){
            var button = self.buttons[key];
            if(filterFunction){
                if(filterFunction(button)){
                    eachFunction.apply(button, [button, count++]);
                }
            }
            else{
                eachFunction.apply(button, [button, count++]);
            }
        }
        return self;
    },
    forEachGridViewButton: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.gridViewButtons){
            var button = self.gridViewButtons[key];
            if(filterFunction){
                if(filterFunction(button)){
                    eachFunction.apply(button, [button]);
                }
            }
            else{
                eachFunction.apply(button, [button]);
            }
        }
        return self;
    },
    forEachFormViewButton: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.formViewButtons){
            var button = self.formViewButtons[key];
            if(filterFunction){
                if(filterFunction(button)){
                    eachFunction.apply(button, [button]);
                }
            }
            else{
                eachFunction.apply(button, [button]);
            }
        }
        return self;
    },
    getWebpage: function(){
        var self = this;
        return self.parentObject;
    },
    getGridViewElement: function(){
        var self = this;
        return self.gridViewElement;
    },
    getFormViewElement: function(){
        var self = this;
        return self.formViewElement;
    },
    getElement: function(type){
        var self = this;
        if(type=='gridView'){
            return self.getGridViewElement();
        }
        else if (type=='formView'){
            return self.getFormViewElement();
        }
        else{
            throw 'type not specified';
        }
    },
    buttonClicked: function(button, type){
        var self = this;
        if(self.subModule.viewOnlyMode){
//            return self;
        }
        self._events.buttonClicked(self, button, type);
        return self;
    },
    rowSelectorChanged: function(element){
        var self = this;
        self.subModule.grid.elements.rowSelectorAll.prop('checked', false);
        self.updateRowSelectorCondition();
        return self;
    },
    rowSelectorAllChanged: function(element){
        var self = this;
        self.selectUnselectAllRows(element.prop('checked'));
        return self;
    },
    updateButtonGroupElementsVisibility: function(){
        var self = this;
        for(var key in self.groupElements){
            var groupElement = self.groupElements[key];
            groupElement.css({
                "display": ""
            });

            if(groupElement.find('button:visible').length == 0){
                groupElement.css({
                    "display": "none"
                });
            }
        }
        return self;
    },
    selectUnselectAllRows: function(checked, preventChangeEvent){
        var self = this;

        if(self.subModule.grid){
            self.subModule.grid.grid.find('.grid-row-selector').prop('checked', checked);
        }
        if(self.subModule.cardViewHelper){
            self.subModule.cardViewHelper.container.find('.card-row-selector').prop('checked', checked);
        }

        if(!preventChangeEvent){
            self.updateRowSelectorCondition();
        }
        return self;
    },
    setSelectedRow: function(element){
        var self = this;
        self.subModule.grid.unCheckAllRowSelector();
//        self.subModule.grid.grid.find('.grid-row-selector').prop('checked', false);
        element.prop('checked', true);
        self.rowSelectorChanged(element);
        return self;
    },
    get selectedRowsWithValues(){
        var self = this;
        var arr = [];
        self.selectedRows.forEach(function(rowId){
                if(self.subModule.displayMode === SubModule.DISPLAY_MODES.GRID_VIEW){
                    arr.push(self.subModule.grid.data[rowId]);
                }
                else if(self.subModule.displayMode === SubModule.DISPLAY_MODES.CARD_VIEW){
                    arr.push(self.subModule.cardViewHelper.card_data_map[rowId]);
                }
        });
        return arr;
    },
    updateRowSelectorCondition: function(){
        var self = this;
        self.selectedRows = [];
        self.disableCondition = {};
        if(self.subModule.displayMode === SubModule.DISPLAY_MODES.GRID_VIEW){
            self.selectedRowSelectors = self.subModule.grid.elements.table.find('.grid-row-selector:checked');
            self.subModule.grid.elements.table.find('tr.selected').removeClass('selected');
        }
        else if(self.subModule.displayMode === SubModule.DISPLAY_MODES.CARD_VIEW){
            self.selectedRowSelectors = self.subModule.cardViewHelper.container.find('.card-row-selector:checked');
            self.subModule.cardViewHelper.container.find('.single_card_view_data_row.selected').removeClass('selected');
        }

        if(self.selectedRowSelectors){
            self.selectedRowsCount = self.selectedRowSelectors.each(function(){
                var element = $(this);
                element.closest('tr[id]').addClass('selected');
                element.closest('.single_card_view_data_row').addClass('selected');
                self.selectedRows.push(element.data('id'));
            }).length;
        }
        else{
            self.selectedRowsCount = 0;
        }

        self.disableCondition.none = (self.selectedRowsCount == 0);
        self.disableCondition.single = (self.selectedRowsCount == 1);
        self.disableCondition.multiple = (self.selectedRowsCount > 1);

        var noOfRowsSelectors = self.subModule.grid.elements.table.find('.grid-row-selector').length;
        if(self.selectedRowsCount > 0 && noOfRowsSelectors && (self.selectedRowsCount === noOfRowsSelectors)){
            self.subModule.grid.elements.rowSelectorAll.prop('checked', true);
        }
        self.enableDisableButtons();

        return self;
    },
    enableDisableButtons: function(){
        var self = this;
        self.forEachGridViewButton(function(button){
            var disabled = false;
            if(button.disableCondition.gridView.none && self.disableCondition.none){
                disabled = true;
            }
            else if(button.disableCondition.gridView.single && self.disableCondition.single){
                disabled = true;
            }
            else if(button.disableCondition.gridView.multiple && self.disableCondition.multiple){
                disabled = true;
            }
            button.disabled = disabled;
//            button.getElement(Button.BUTTON_MODES.GRID).prop('disabled', disabled);
        }, function(button){
            if(button.disableCondition){
                return true;
            }
        });

        if(self.subModule.isInChildWindow && self.subModule.parentDataRow){
            self.forEachGridViewButton(function(button){
                button.disabled = true;
            }, function(button){
                if(button.disableCondition && button.disableCondition.disableInsideParentWindow){
                    return true;
                }
            });
        }
        else{
            self.forEachGridViewButton(function(button){
                button.disabled = true;
            }, function(button){
                if(button.disableCondition && button.disableCondition.disableOutsideParentWindow){
                    return true;
                }
            });
        }

        if(self.subModule.isInChildWindow && self.subModule.parentDataRow){
            self.forEachGridViewButton(function(button){
                if(button.disabled){
                    return;
                }
                var disabled = button.checkParentAdvancedDisableCondition(self.subModule.parentDataRow);
                button.disabled = disabled;
            }, function(button){
                if(button.disableCondition && button.disableCondition.parentAdvanced && button.disableCondition.parentAdvanced.isEnabled){
                    return true;
                }
            });
        }

        self.forEachGridViewButton(function(button){
            if(button.disabled){
                return;
            }
            var disabled = button.checkAdvancedDisableCondition(self.selectedRowsWithValues);
            button.disabled = disabled;
        }, function(button){
            if(button.disableCondition && button.disableCondition.advanced && button.disableCondition.advanced.isEnabled){
                return true;
            }
        });
        self.updateButtonGroupElementsVisibility();
        return self;
    },
    disableFormViewEditButtons: function(){
        var self = this;

        self.forEachFormViewButton(function(button){
            button.disabled = true;
        }, function(button){
            return button.type == 'edit';
        });
        return self;
    },
    enableDisableFormViewButtons: function(editData){
        var self = this;

        self.forEachFormViewButton(function(button){
            button.disabled = false;
        });
        if(self.subModule.isInChildWindow && self.subModule.parentDataRow){
            self.forEachFormViewButton(function(button){
                button.disabled = true;
            }, function(button){
                if(button.disableCondition && button.disableCondition.disableInsideParentWindow){
                    return true;
                }
            });
        }
        else{
            self.forEachFormViewButton(function(button){
                button.disabled = true;
            }, function(button){
                if(button.disableCondition && button.disableCondition.disableOutsideParentWindow){
                    return true;
                }
            });
        }

        self.forEachFormViewButton(function(button){
            var disabled = false;
           if(button.disableCondition.gridView.single && self.disableCondition.single){
                disabled = true;
            }
            button.disabled = disabled;
//            button.getElement(Button.BUTTON_MODES.GRID).prop('disabled', disabled);
        }, function(button){
            if(button.disableCondition){
                return true;
            }
        });

        if(self.subModule.isInChildWindow && self.subModule.parentDataRow){
            self.forEachFormViewButton(function(button){
                if(button.disabled){
                    return;
                }
                var disabled = button.checkParentAdvancedDisableCondition(self.subModule.parentDataRow);
                button.disabled = disabled;
            }, function(button){
                if(button.disableCondition && button.disableCondition.parentAdvanced && button.disableCondition.parentAdvanced.isEnabled){
                    return true;
                }
            });
        }

        self.forEachFormViewButton(function(button){
            if(button.disabled){
                return;
            }
            var disabled = button.checkAdvancedDisableCondition([editData]);
            button.disabled = disabled;
        }, function(button){
            if(button.disableCondition && button.disableCondition.advanced && button.disableCondition.advanced.isEnabled){
                return true;
            }
        });
        return self;
    },
    getDefaultButton: function(buttonType){
        var self = this;
        var ret = null;
        self.forEachButton(function(button){
            ret = button;
        }, function(button){
            var ret = false;
            if(button.type == buttonType){
                ret = true;
            }
            return ret;
        });
        return ret;
    },
    _creation : {
        createContainer: function(buttonManager, postFix){
            var div = $(document.createElement('div')).attr({id: buttonManager.id + postFix, class: 'button-panel'});
            return div;
        },
        createGridViewElement: function(buttonManager){
            var self = this;
            var div = self.createContainer(buttonManager, '_grid_view');

            var buttonManagerGridViewTableMain = $(document.createElement('table'))
                .attr(buttonManager.constants.buttonManagerGridViewTableMain)
                .appendTo(div);
            var trMain = $(document.createElement('tr'))
                .appendTo(buttonManagerGridViewTableMain);

            var tdSearch = $(document.createElement('td'))
                .attr(buttonManager.constants.tdSearch); // tdSearch is not used any more
                // .appendTo(trMain);
            var searchButtonsContainer = $(document.createElement('div'))
                .attr(buttonManager.constants.searchButtonsContainer)
                .prependTo(tdSearch);
            var showSearchContainer = $(document.createElement('div'))
                .appendTo(searchButtonsContainer)
                .attr(buttonManager.constants.showSearchContainer);
            var clearSearch = $(document.createElement('div'))
                .attr(buttonManager.constants.clearSearch)
                .appendTo(searchButtonsContainer).hide();

            var tdGridViewButton = $(document.createElement('td'))
                .appendTo(trMain);
            if(buttonManager.subModule.hasGridViewMode){
                var gridViewButtonsContainer = $(document.createElement('div'))
                    .attr(buttonManager.constants.gridViewButtonsContainer)
                    .appendTo(tdGridViewButton);
                if(buttonManager.buttonGroup){
                    buttonManager.groupElements = {};
                    buttonManager.groupButtonContainer = {}
                    var buttonGroupObj = buttonManager.buttonGroup;
                    for (var buttonGroupKey in buttonGroupObj){
                        var group = (buttonGroupObj[buttonGroupKey]);
                        var buttonGroup = $(document.createElement('div'))
                            .attr(buttonManager.constants.buttonGroup)
                            .attr('id', group.id);
                        var groupName = $(document.createElement('span'))
                            .text(group.displayName);
                        buttonGroup.append(groupName);
                        var groupButtonContainer = $(document.createElement('div'))
                            .attr(buttonManager.constants.groupButtonContainer)
                            .attr({'id' : group.id+'ButtonContainer'});

                        buttonGroup.append(groupButtonContainer);
                        buttonManager.groupElements[group.id] = buttonGroup;
                        buttonManager.groupButtonContainer[group.id] = groupButtonContainer;
                        gridViewButtonsContainer.append(buttonGroup)
                    }
                }
                buttonManager.gridViewButtonsOrder.forEach(function(buttonId){
                    if(!buttonId){
                        return;
                    }
                    if(buttonManager.buttons[buttonId].gridView.groupId){
                        buttonManager.groupButtonContainer[buttonManager.buttons[buttonId].gridView.groupId]
                            .append(buttonManager.buttons[buttonId].getElement(Button.BUTTON_MODES.GRID));
                    }
                    else{
                        gridViewButtonsContainer.append(buttonManager.buttons[buttonId].getElement(Button.BUTTON_MODES.GRID));
                    }
                });
            }

            var tdDefaultButtons = $(document.createElement('td'))
                .appendTo(trMain);
            var defaultButtonsContainer = $(document.createElement('div'))
                .attr(buttonManager.constants.defaultButtonsContainer)
                .appendTo(tdDefaultButtons);
            var setDisplayModeButtonsContainer = $(document.createElement('div'))
                .attr(buttonManager.constants.setDisplayModeButtonsContainer)
                .appendTo(defaultButtonsContainer);


            if(buttonManager.subModule.hasGridViewMode){
                var setDisplayModeToGridView = $(document.createElement('div')).attr(buttonManager.constants.setDisplayModeToGridView).appendTo(setDisplayModeButtonsContainer);
            }
            if(buttonManager.subModule.hasDirectCreateView){
                var setDisplayModeToDirectCreateView = $(document.createElement('div')).attr(buttonManager.constants.setDisplayModeToDirectCreateView).appendTo(setDisplayModeButtonsContainer);
            }
            if(buttonManager.subModule.hasThumbnailViewMode){
                var setDisplayModeToThumbnailView = $(document.createElement('div'))
                    .attr(buttonManager.constants.setDisplayModeToThumbnailView)/*.text('Card')*/
                    .appendTo(setDisplayModeButtonsContainer);
            }
            if(buttonManager.subModule.hasMasterDetailViewMode){
                var setDisplayModeToMasterDetailView = $(document.createElement('div'))
                    .attr(buttonManager.constants.set_display_mode_to_master_detail_view)/*.text('Card')*/
                    .appendTo(setDisplayModeButtonsContainer);
            }
            //need to change the attr from constants
            if(buttonManager.subModule.hasCalendarViewMode){
                var setDisplayModeToCalendarView = $(document.createElement('div'))
                    .attr(buttonManager.constants.setDisplayModeToCalendarView)/*.text('Card')*/.appendTo(setDisplayModeButtonsContainer);
            }


            if(buttonManager.subModule.filterManager.get_filter_count()){
                var showFiltersPopupButton = $(document.createElement('div'))
                    .attr(buttonManager.constants.showFiltersPopupButton)
                    .html('<span class="fa-solid fa-filter"></span><span class="show_filter_side_popup_button_text">Filters</span>')
                    .prependTo(setDisplayModeButtonsContainer);
            }

            buttonManager.defaultButtons = {};
            buttonManager.defaultButtons.showSearchContainer = showSearchContainer;
            buttonManager.defaultButtons.clearSearch = clearSearch;
            buttonManager.defaultButtons.setDisplayModeToThumbnailView = setDisplayModeToThumbnailView;
            buttonManager.defaultButtons.setDisplayModeToDirectCreateView = setDisplayModeToDirectCreateView;
            buttonManager.defaultButtons.setDisplayModeToGridView = setDisplayModeToGridView;
            buttonManager.defaultButtons.setDisplayModeButtonsContainer = setDisplayModeButtonsContainer;
            buttonManager.defaultButtons.setDisplayModeToCalendarView = setDisplayModeToCalendarView;
            buttonManager.defaultButtons.set_display_mode_to_master_detail_view = setDisplayModeToMasterDetailView;
            buttonManager.defaultButtons.showFiltersPopupButton = showFiltersPopupButton;
            buttonManager.elements.searchButtonsContainer = searchButtonsContainer;

            return div;
        },
        createFormViewElement: function(buttonManager){
            var self = this;
            var div = self.createContainer(buttonManager,'_form_view');

            buttonManager.formViewButtonsOrder.forEach(function(buttonId){
                if(!buttonId){
                    return;
                }
                div.append(buttonManager.buttons[buttonId].getElement(Button.BUTTON_MODES.FORM));
            });

//            buttonManager.forEachFormViewButton(function(button){
//                div.append(button.getElement(Button.BUTTON_MODES.FORM));
//            });
            return div;
        }
    },
    _events   : {
        buttonClicked: function(buttonManager, button, type){
            var self = this;
            if(type === Button.BUTTON_MODES.GRID){
                self.gridViewButtonClicked(buttonManager, button, type)
            }
            else if(type === Button.BUTTON_MODES.FORM){
                self.formViewButtonClicked(buttonManager, button)
            }
            return this;
        },
        gridViewButtonClicked: function(buttonManager, button, type){
            var self = this;
            switch (button.type){
                case Button.BUTTON_TYPES.CREATE:
                    self.insertButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.VIEW:
                    self.viewButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.DELETE:
                    self.deleteButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.STATUS_CHANGE:
                    self.statusChangeButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.EMAIL:
                    self.emailButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.SMS:
                    self.smsButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.EXEC_SQL:
                    self.execSqlButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.EXEC_JAVA_SCRIPT:
                    self.execJavaScriptButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.PRINT:
                    self.printButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.EXPORT_TO_EXCEL:
                    self.exportToExcelButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.OPEN_CHILD_WINDOW:
                    self.openChildWindowButtonInGridViewClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.OPEN_SUBMODULE_IN_FORMVIEW_MODE:
                    self.openSubModuleInFormViewModeButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.TRIGGER_ANOTHER_BUTTON:
                    self.triggerAnotherButtonClicked(buttonManager, button);
                    break;
            }
            return self;
        },
        formViewButtonClicked: function(buttonManager, button){
            var self = this;
            switch (button.type){
                case Button.BUTTON_TYPES.EDIT:
                    self.editButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.OPEN_CHILD_WINDOW:
                    self.openChildWindowButtonInFormViewClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.OPEN_SUBMODULE_IN_FORMVIEW_MODE:
                    self.openSubModuleInFormViewModeButtonClicked(buttonManager, button);
                    break;
                case Button.BUTTON_TYPES.PRINT:
                    self.printButtonClicked(buttonManager, button, Button.BUTTON_MODES.FORM);
                    break;
                case Button.BUTTON_TYPES.EXEC_SQL:
                    self.execSqlButtonClicked(buttonManager, button, Button.BUTTON_MODES.FORM);
                    break;
                case Button.BUTTON_TYPES.DELETE:
                    self.deleteButtonClicked(buttonManager, button, Button.BUTTON_MODES.FORM);
                    break;
            }
            return self;
        },
        editButtonClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            subModule.lockRow(function(responseObject){
                if(!responseObject.disableEditMode){
                    subModule.formView.show(FormView.EDIT_MODE, {}, button);
                }
                else{
                    buttonManager.erp.notifier.showErrorNotification(responseObject.message);
                }
            })
            return self;
        },
        insertButtonClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.subModule;

            if(subModule.isInQuickViewModeChildWindow){
                subModule.showFormViewForQuickAdd({
                    parentPositioningElement: button.getElement(Button.BUTTON_MODES.GRID),
                    showQuickAddView: true,
                    onAfterInsert: function(){

                    },
                    refreshDataOnInsert: true
                });
            }
            else{
                subModule.formView.show(FormView.CREATE_MODE, null, button);
            }
            return self;
        },
        viewButtonClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(button.typeSpecific && button.typeSpecific.showEditModeDirectly){
                subModule.formView.show(FormView.VIEW_MODE, buttonManager.subModule.latest_display_data.map[buttonManager.selectedRows[0]], button, {
                    onEditModeReady: function(formView){
                        self.editButtonClicked(buttonManager, buttonManager.buttons.edit);
                    }
                });
            }
            else{
                subModule.formView.show(FormView.VIEW_MODE, buttonManager.subModule.latest_display_data.map[buttonManager.selectedRows[0]], button);
            }
            return self;
        },
        openChildWindowButtonInGridViewClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            subModule.openChildWindowInNormalMode(buttonManager.subModule.grid.data[buttonManager.selectedRows[0]], button);
            return self;
        },
        openChildWindowButtonInFormViewClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            subModule.openChildWindowInNormalMode(subModule.formView.data.edit, button);
            return self;
        },
        openSubModuleInFormViewModeButtonClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(buttonManager.selectedRows && buttonManager.selectedRows[0]){
                subModule.openChildWindowInFormViewOnlyMode(buttonManager.subModule.grid.data[buttonManager.selectedRows[0]], button);
            }
            else{
                subModule.openChildWindowInFormViewOnlyMode(null, button);
            }
            return self;
        },
        deleteButtonClicked: function(buttonManager, button, buttonMode){
            var self = this;
            var subModule = buttonManager.getWebpage();
            var buttonElement = $('#'+Button.BUTTON_MODES.GRID+'_'+button.id);
            var selectedRows = buttonManager.selectedRows;
            if(buttonMode == Button.BUTTON_MODES.FORM){
                selectedRows = [buttonManager.subModule.formView.data.view.id];
            }
            if(button.isConfirmationChecker && button.confirmationMessage){
                if(button.confirmationMessage){
                    buttonElement.dialog({
                        resizable: false,
                        height:140,
                        width: 350,
                        modal: true,
                        "position": { at: "middle top"},
                        title: button.confirmationMessage,
                        buttons: {
                            "YES": function() {
                                subModule._db.deleteRow(subModule, selectedRows, button, buttonMode, 'yes');
                                $( this ).dialog( "close" );
                            },
                            "NO": function() {
                                subModule._db.deleteRow(subModule, selectedRows, button, buttonMode, 'no');
                                $( this ).dialog( "close" );
                            },
                            "Cancel": function() {
                                $( this ).dialog( "close" );
                            }
                        }
                    });
                    $('.ui-dialog').find('.ui-dialog-content').hide(0);
                }
            }
            else if(button.isConfirmationChecker && !button.confirmationMessage){
                subModule._db.deleteRow(subModule, selectedRows, button, buttonMode);
            }
            else{
                if(button.confirmationMessage){
                    if(!confirm(button.confirmationMessage.replace('@row_count@', selectedRows.length))){
                        return;
                    }
                }
                subModule._db.deleteRow(subModule, selectedRows, button, buttonMode);
            }

            return this;
        },
        emailButtonClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(button.confirmationMessage){
                if(!confirm(button.confirmationMessage.replace('@row_count@', buttonManager.selectedRowsCount))){
                    return;
                }
            }
            subModule._db.email(subModule, buttonManager.selectedRows, button);
            return this;
        },
        smsButtonClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(button.confirmationMessage){
                if(!confirm(button.confirmationMessage.replace('@row_count@', buttonManager.selectedRowsCount))){
                    return;
                }
            }
            subModule._db.sms(subModule, buttonManager.selectedRows, button);
            return this;
        },
        execSqlButtonClicked: function(buttonManager, button, buttonMode){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(button.confirmationMessage){
                if(!confirm(button.confirmationMessage.replace('@row_count@', buttonManager.selectedRowsCount))){
                    return;
                }
            }
            var selectedRows = buttonManager.selectedRows;
            if(buttonMode == Button.BUTTON_MODES.FORM){
                selectedRows = [buttonManager.subModule.formView.data.view.id];
            }
            subModule._db.execSql(subModule, selectedRows, button, buttonMode);
            return this;
        },
        execJavaScriptButtonClicked: function(buttonManager, button, buttonMode){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(button.confirmationMessage){
                if(!confirm(button.confirmationMessage.replace('@row_count@', buttonManager.selectedRowsCount))){
                    return;
                }
            }
            var selectedRows = buttonManager.selectedRows;
            if(buttonMode == Button.BUTTON_MODES.FORM){
                selectedRows = [buttonManager.subModule.formView.data.view.id];
            }
            subModule._db.execJavaScript(subModule, selectedRows, button, buttonMode);
            return this;
        },
        printButtonClicked: function(buttonManager, button, buttonMode){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(button.confirmationMessage){
                if(!confirm(button.confirmationMessage.replace('@row_count@', buttonManager.selectedRowsCount))){
                    return;
                }
            }
            var selectedRows = buttonManager.selectedRows;
            if(buttonMode == Button.BUTTON_MODES.FORM){
                selectedRows = [buttonManager.subModule.formView.data.view.id];
            }
            subModule._db.print(subModule, selectedRows, button, buttonMode);
            return this;
        },
        exportToExcelButtonClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(button.confirmationMessage){
                if(!confirm(button.confirmationMessage.replace('@row_count@', buttonManager.selectedRowsCount))){
                    return;
                }
            }
            subModule._db.exportToExcel(subModule, buttonManager.selectedRows, button);
            return this;
        },
        statusChangeButtonClicked:function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(!confirm(button.confirmationMessage.replace('@row_count@', buttonManager.selectedRowsCount))){
                return;
            }
            var data = {};
            data.id = buttonManager.selectedRows;
            data.buttonId = button.id;
            subModule._db.statusChange(subModule, button, data);
            return this;
        },
        triggerAnotherButtonClicked: function(buttonManager, button){
            var self = this;
            var subModule = buttonManager.getWebpage();
            if(button.confirmationMessage){
                if(!confirm(button.confirmationMessage.replace('@row_count@', buttonManager.selectedRowsCount))){
                    return;
                }
            }
            subModule._db.triggerAnotherButton(subModule, buttonManager.selectedRows, button);
            return self;
        }
    },
    _ui       : {
    }
}

