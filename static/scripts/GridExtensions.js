



Grid.prototype.show_edit_grid_normal_element_popup = function (context_id, element_type, element) {
    console.log('show_edit_grid_normal_element_popup', context_id, element_type, element);

    let column_info;
    let custom_element_info;

    if(element_type === 'column'){
        column_info = this.subModule.columnManager.columns[context_id]
    }
    else{
        custom_element_info = this.get_custom_element_info(context_id)
    }

    const column_styling = this.get_latest_grid_item_style_info(context_id, {column_info, custom_element_info});
    column_styling.customizations = column_styling.customizations || {};
    // const existing_config = this.get_custom_element_existing_config(custom_element_id);
    window.show_grid_normal_element_customization_popup(this, column_info, custom_element_info, column_styling.customizations);
}

Grid.prototype.parse_customizations_css = function (new_config, div_holder_element) {
    let css_to_set = {};
    if(new_config.margin_top !== undefined){
        css_to_set.marginTop = new_config.margin_top;
    }
    if(new_config.margin_bottom !== undefined){
        css_to_set.marginBottom = new_config.margin_bottom;
    }
    if(new_config.margin_left !== undefined){
        css_to_set.marginLeft = new_config.margin_left;
    }
    if(new_config.margin_bottom !== undefined){
        css_to_set.marginBottom = new_config.margin_bottom;
    }
    if(new_config.padding_top !== undefined){
        css_to_set.paddingTop = new_config.padding_top;
    }

    if(new_config.padding_bottom !== undefined){
        css_to_set.paddingBottom = new_config.padding_bottom;
    }
    if(new_config.padding_left !== undefined){
        css_to_set.paddingLeft = new_config.padding_left;
    }
    if(new_config.padding_bottom !== undefined){
        css_to_set.paddingBottom = new_config.padding_bottom;
    }


    if(new_config.background_color !== undefined){
        css_to_set.backgroundColor = new_config.background_color;
    }
    if(new_config.text_color !== undefined){
        css_to_set.color = new_config.text_color;
    }

    if(new_config.border_color !== undefined && new_config.border_thickness !== undefined){

        let border_key = 'border';
        console.log("border_area=======================", new_config.border_area);
        if(new_config.border_area && new_config.border_area !== 'all'){
            border_key += new_config.border_area[0].toUpperCase() + new_config.border_area.substring(1);
        }

        css_to_set[border_key] = `${new_config.border_thickness}px solid ${new_config.border_color}`;
    }

    if(new_config.border_radius !== undefined){
        css_to_set.borderRadius = new_config.border_radius;
    }

    const keys = Object.keys(css_to_set);
    for (const css_item of keys) {
        css_to_set[ '--' + to_snake_case(css_item)] = css_to_set[css_item];
    }

    for (const css_item of Grid.FORM_ITEM_DIV_ELEMENT_PROTECTED_CSS_RULES) {
        const value = div_holder_element.css(css_item);
        if(value){
            css_to_set[css_item] = value;
        }
    }

    div_holder_element.attr('style', '');



    return css_to_set;
}

Grid.prototype.load_customization_to_normal_column_element = function (column_info, th_or_td, new_config) {
    console.log('load_customization_to_normal_column_element new_config', new_config);
    console.log('load_customization_to_normal_column_element column_info', column_info);
    // console.log('load_customization_to_normal_column_element div_holder_element', div_holder_element);

    let th_element;
    if(th_or_td === 'th'){
        th_element = this.element_references.thead[column_info.id];
        const inner_span = th_element.find('.grid_head_column_display_name_element');
        if(new_config.display_name){
            inner_span.text(new_config.display_name);
        }
    }
    else if(th_or_td === 'td'){
        // need to handle here
    }


    // const css_to_set = this.parse_customizations_css(new_config, div_holder_element);
    //
    // if(Object.keys(css_to_set).length){
    //     div_holder_element.css(css_to_set);
    // }

}


Grid.prototype.load_customization_to_custom_column_element = function (custom_element_info, th_or_td, new_config) {



    let th_element;
    if(th_or_td === 'th'){
        th_element = this.element_references.thead[custom_element_info.id];
        const inner_span = th_element.find('.grid_head_column_display_name_element');
        if(new_config.display_name){
            inner_span.text(new_config.display_name);
        }
    }
    else if(th_or_td === 'td'){
        // need to handle here

        // const svelte_instance = this.get_custom_element_svelte_instance(custom_element_info.id);
        // svelte_instance.handle_customizations_updated(new_config);
    }


}

Grid.prototype.handle_normal_grid_element_config_updated = function (column_info, custom_element_info, new_config) {
    const column_styling = this.get_latest_grid_item_style_info(column_info?.id || custom_element_info?.id, {column_info, custom_element_info});
    column_styling.customizations = new_config;

    if(column_info){
        this.load_customization_to_normal_column_element(column_info, 'th', new_config);
        this.load_customization_to_normal_column_element(column_info, 'td', new_config);
    }
    else if(custom_element_info){
        this.load_customization_to_custom_column_element(custom_element_info, 'th', new_config);
        this.load_customization_to_custom_column_element(custom_element_info, 'td', new_config);
    }

    // console.log('svelte_instance', svelte_instance);
    // svelte_instance.handle_config_updated(new_config);
}




Grid.prototype.show_edit_custom_element_popup = function (custom_element_id, element) {
    console.log('show_edit_custom_element_popup', custom_element_id, element);

    const custom_element_info = this.get_custom_element_info(custom_element_id);
    // const existing_config = this.get_custom_element_existing_config(custom_element_id);
    window.show_grid_custom_element_customization_popup(this, custom_element_id, custom_element_info.type , custom_element_info.config);
}

Grid.prototype.verify_with_user_and_delete_custom_element = function (custom_element_id, element) {
    console.log('verify_with_user_and_delete_custom_element', custom_element_id, element);

    if(!confirm('Delete this element?')){
        return;
    }
    const custom_element_info = this.get_custom_element_info(custom_element_id);
    this.delete_custom_element(custom_element_info);
}


Grid.prototype.handle_custom_grid_element_config_updated = function (custom_element_id, new_config) {
    const custom_element_info = this.get_custom_element_info(custom_element_id);
    custom_element_info.config = new_config;

    const svelte_instance = this.get_custom_element_svelte_instance(custom_element_id);
    console.log('new_config', new_config);
    console.log('svelte_instance', svelte_instance);
    svelte_instance.handle_config_updated(new_config);
}

Grid.prototype.handle_new_custom_grid_element_mounted = function (mounted_svelte_instance) {
    mounted_svelte_instance.container_element_jquery.data('svelte_instance', mounted_svelte_instance);
    if(this.is_in_styling_mode){
        this.refresh_grid_column_holder_elements(mounted_svelte_instance.container_element);
    }
}

Grid.prototype.get_custom_element_info = function (item_id) {
    return this.latest_styling_setting.custom_elements[item_id];
}

Grid.prototype.get_all_custom_elements = function () {
    return this.latest_styling_setting.custom_elements;
}


Grid.prototype.delete_custom_element = function (custom_element_info) {
    delete this.latest_styling_setting.custom_elements[custom_element_info.id];
    this.get_custom_element_svelte_instance(custom_element_info.id).container_element.remove();
}

Grid.prototype.get_custom_element_svelte_instance = function (item_id) {
    return this.elements.divMain.find('.table-main:visible').find(`.grid_custom_element[data-custom_element_id="${item_id}"]`).data('svelte_instance');
}

Grid.prototype.detach_custom_elements_from_view = async function () {
    for(const item_id in this.mounted_custom_element_svelte_instances[this.button.id]){
        const svelte_instance = this.mounted_custom_element_svelte_instances[this.button.id][item_id];
        console.log(`detaching : ${item_id}`, svelte_instance)
        svelte_instance.container_element_jquery.detach();
    }
}

Grid.prototype.mount_custom_element = async function (item_id, item_type, target_element, existing_config) {

    if(item_id && this.mounted_custom_element_svelte_instances[this.button.id][item_id]){
        const svelte_instance = this.mounted_custom_element_svelte_instances[this.button.id][item_id];
        console.log(`restoring : ${item_id}`, svelte_instance)
        svelte_instance.container_element_jquery.appendTo(target_element);
        return;
    }

    let is_new_item = false;
    let _created_at_utc;
    if(!item_id){
        _created_at_utc = Date.now();
        item_id = `ce_${this.button.id}_${item_type}__${_created_at_utc}`;
        is_new_item = true;
    }

    let mounted_svelte_instance;
    let current_custom_element_type;
    switch (item_type){
        case 'title_with_caption':
            current_custom_element_type = 'title_with_caption';
            mounted_svelte_instance = await this.styling_helper.mount_custom_element__title_with_caption(this, item_id, existing_config, target_element);
            break;
        case 'alert_message':
            current_custom_element_type = 'alert_message';
            mounted_svelte_instance = await this.styling_helper.mount_custom_element__alert_message(this, item_id, existing_config, target_element);
            break;
        case 'caption_only':
            mounted_svelte_instance = await this.styling_helper.mount_custom_element__caption_only(this, item_id, existing_config, target_element);
            break;
        case 'label_with_value':
            mounted_svelte_instance = await this.styling_helper.mount_custom_element__label_with_value(this, item_id, existing_config, target_element);
            break;
        case 'stat_card_with_value':
            mounted_svelte_instance = await this.styling_helper.mount_custom_element__stat_card_with_value(this, item_id, existing_config, target_element);
            break;
        case Grid.CUSTOM_ELEMENTS.number_display.id:
            mounted_svelte_instance = await this.styling_helper.mount_custom_element__number_display(this, item_id, existing_config, target_element);
            break;
    }

    this.handle_new_custom_grid_element_mounted(mounted_svelte_instance);

    if(is_new_item){
        this.latest_styling_setting.custom_elements[item_id] = {
            id: item_id,
            type: item_type,
            _created_at_utc : _created_at_utc,
            unique_id: item_id,
            config: {}
        }
    }

    this.mounted_custom_element_svelte_instances[this.button.id][item_id] = mounted_svelte_instance;

    return mounted_svelte_instance;
}


Grid.prototype.styling_helper = {
    mount_custom_element__currency_amount_display: async function (grid, item_id, item_config, target_element) {
        if (!item_config) {
            item_config = {label_text: '', value_text: ''};
        }

        const svelte_instance = await window.mount_grid_custom_element(grid, target_element, Grid.CUSTOM_ELEMENTS.number_display.id, {
            unique_id: item_id,
            config: item_config
        });

        return svelte_instance;
    }
}



Grid.prototype.go_to_styling_mode = function () {
    const self = this;
    this.is_in_styling_mode = true;
    this.initialize_styling_mode();
}


Grid.prototype.initialize_styling_mode = function () {
    const self = this;
    self.container.addClass('styling_mode');
}

Grid.prototype.get_styling_setting_from_user = function () {
    const self = this;
    return self.erp.get_role_setting_value(self.get_styling_setting_name());
},
Grid.prototype.get_styling_setting_name = function () {
    const self = this;
    return `gridview_styling_config__${self.subModule.module.id}__${self.subModule.id}`;
},
Grid.prototype.save_latest_styling_configuration = function () {
    const self = this;

    let grid_column_thead_cell_elements_obj = self.element_references.thead;

    let styling_config = this.latest_styling_setting;
    this.latest_styling_setting.last_updated_at_utc = Date.now();


    // self.gridOrderConfig = {};
    // self.columnOrder = [];
    // var thArr = self.elements.gridTable.find('thead').find('th').eq(0).nextAll();
    // var gridViewIndex = 0;
    // var columns = self.subModule.columnManager.columns;
    // var columnConfigs = self.subModule.columnManager.config;
    // thArr.each(function () {
    //     var th = $(this);
    //     var columnId = th.children().attr('data-column-id');
    //     self.gridOrderConfig[columnId] = {
    //         id: columnId,
    //         index: gridViewIndex
    //     }
    //     self.columnOrder.push(columnId);
    //     columns[columnId].gridView.index = gridViewIndex;
    //     columnConfigs[columnId].gridView.index = gridViewIndex;
    //     gridViewIndex++;
    // });

    styling_config.div_main_width = self.elements.divMain.outerWidth();
    const grid_view_column_order_arr = [];

    for(const context_item_id in grid_column_thead_cell_elements_obj){
        const th_element = grid_column_thead_cell_elements_obj[context_item_id];
        let column_id = th_element.attr('data-column_id');
        let custom_element_id = th_element.attr('data-custom_element_id');
        let column_index  = th_element.index() - 1;


        // console.log('context_item_id', context_item_id, column_index, th_element.get(0))

        const obj = self.latest_styling_setting.column_structure[column_id || custom_element_id] || {
            column_id,
            custom_element_id,
            context_item_id: custom_element_id || column_id,
        };

        grid_view_column_order_arr[column_index] = obj.context_item_id;
        obj.grid_view_column_index = column_index;

        styling_config.column_structure[custom_element_id || column_id] = obj;
    }

    styling_config.column_order = grid_view_column_order_arr;
    styling_config.display_styling_mode = self.display_styling_mode;

    console.log('styling_config', styling_config);
    let setting_name = self.get_styling_setting_name();


    console.log('============ latest_styling_setting', this.latest_styling_setting);
    console.log('============ styling_config', styling_config);


    self.erp.saveRoleSetting(setting_name, styling_config, ()=>{
        console.log(setting_name, ' saved')
    });
},


Grid.prototype.restore_custom_elements_from_config = async function (styling_config) {
    const self = this;
    // console.log('styling_config', styling_config);

    // if(self[`is_custom_elements_restored__${self.button.id}`]){
    //     return;
    // }
    // self[`is_custom_elements_restored__${self.button.id}`] = true;

    for(const custom_element_key in styling_config.custom_elements){
        const custom_element_info = styling_config.custom_elements[custom_element_key];

        // console.log('restore_custom_elements_from_config', custom_element_key, custom_element_info)

        let column_style_info = styling_config.column_structure[custom_element_key]; // || styling_config.column_structure['undefined'];
        // if(!column_style_info){
        //     delete styling_config.custom_elements[custom_element_key];
        //     continue;
        // }
        const cell_element = self.container.find(`.table-main:visible .form_view_table_cell[data-position="${column_style_info.pos_string}"]`)

        // console.log('restore_custom_elements_from_config', column_style_info, cell_element)

        await self.mount_custom_element(custom_element_info.id, custom_element_info.type, cell_element, custom_element_info.config);
    }

},

Grid.prototype.get_latest_grid_item_style_info = function (context_item_id, context_info) {
    const self = this;
    let column_style_info = this.latest_styling_setting.column_structure[context_item_id];
    if(!column_style_info){
        const column_info = context_info.column_info;
        const custom_element_info = context_info.custom_element;


        column_style_info = {
            column_id : column_info?.id || undefined,
            custom_element_id : custom_element_info?.id || undefined,
            column_stack_style : 'vertical_stack_1',
            customizations: {}
        }
        column_style_info.context_item_id = column_style_info.column_id || column_style_info.custom_element_id;
        this.latest_styling_setting.column_structure[context_item_id] = column_style_info;
    }
    return column_style_info;
},

Grid.prototype.restore_styling_setting_from_config = async function (styling_config) {
    const self = this;

    // formView.elements.tableMains[type] need to use this

    // console.log('restore_styling_setting_from_config', styling_config)

    if(styling_config.display_styling_mode){
        // switch (styling_config.display_styling_mode){
        //     case 'full_size':
        //         self.set_to_full_size_mode();
        //         break;
        //     default:
        //         self.set_to_custom_size_mode();
        //         if(styling_config.div_main_width){
        //             self.elements.divMain.width(styling_config.div_main_width);
        //         }
        //         break;
        // }
    }

    // if(!styling_config.last_updated_at_utc){
    //     self.elements.headerTextContainerElement.addClass('grid_not_configured');
    // }
    // else{
    //     self.elements.headerTextContainerElement.removeClass('grid_not_configured');
    // }


    await this.restore_custom_elements_from_config(styling_config);

    // console.log('grid_column_holder_elements', grid_column_holder_elements)
    // console.log('restore_styling_setting_from_config', styling_config)



    this.get_current_column_order().forEach(function (context_item_id) {
        const element = self.element_references.thead[context_item_id];
        // let column_id = element.find('.editable').attr('data-column-id');
        const column_id = element.attr('data-column_id');
        const custom_element_id = element.attr('data-custom_element_id');
        // const context_item_id = column_id || custom_element_id;
        let column_style_info = styling_config.column_structure[context_item_id];

        let column_info;
        if(column_id){
            column_info = self.subModule.get_column_from_id(column_id);
        }

        let custom_element_info;
        if(custom_element_id){
            custom_element_info = self.get_custom_element_info(custom_element_id)
        }

        if(column_style_info){

            // element.addClass(column_style_info.column_stack_style || 'vertical_stack_1');
            // element.attr('data-column_stack_style', column_style_info.column_stack_style || 'vertical_stack_1');


            // let size_info = column_style_info.size_info;
            // if(size_info){
            //     let css_obj = {};
            //     if(size_info.width){
            //         css_obj.width = size_info.width + 'px';
            //         css_obj['--column_custom_width'] = size_info.width + 'px';
            //     }
            //
            //     if(size_info.min_height){
            //         css_obj.minHeight = size_info.min_height + 'px';
            //         css_obj['--column_custom_height'] = size_info.height + 'px';
            //     }
            //     else if(size_info.height){
            //         css_obj.height = size_info.height + 'px';
            //         css_obj['--column_custom_height'] = size_info.height + 'px';
            //     }
            //
            //     element.css(css_obj);
            // }

            if(column_style_info.customizations && column_info){
                self.load_customization_to_normal_column_element(column_info, 'th', column_style_info.customizations);
            }
            else if(column_style_info.customizations && custom_element_info){
                self.load_customization_to_custom_column_element(custom_element_info, 'td', column_style_info.customizations);
            }

        }

    });




}

Grid.prototype.exit_styling_mode = function (shall_save) {
    const self = this;
    if(shall_save){
        this.save_latest_styling_configuration();
    }

    self.container.removeClass('styling_mode');

    this.is_in_styling_mode = false;
},
Grid.prototype.applyUserConfiguration = function(){
    var self = this;
    if(self.latest_styling_setting){
        self.restore_styling_setting_from_config(self.latest_styling_setting).then(()=>{

        });
    }

    return self;
}
