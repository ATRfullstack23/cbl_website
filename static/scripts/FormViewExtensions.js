



FormView.prototype.handle_normal_column_value_changed = function(column, column_form_element){
    const self = this;

    // const custom_elements = self.get_all_custom_elements();
    // const data_row = self.getFormData();
    //
    // for (const custom_element_id in custom_elements) {
    //     const custom_element_info = custom_elements[custom_element_id];
    // }
    //
    // jsFunction && jsFunction.apply(self, [self.getFormData(), self.subModule, self, column, function(err){
    //     console.log(err);
    // }]);
    // return self;
}

FormView.prototype.show_edit_formview_normal_element_popup = function (context_id, element_type, element) {
    console.log('show_edit_formview_normal_element_popup', context_id, element_type, element);

    let column_info;
    let custom_element_info;

    if(element_type === 'column'){
        column_info = this.subModule.columnManager.columns[context_id]
    }
    else{
        custom_element_info = this.get_custom_element_info(context_id)
    }

    const column_styling = this.get_latest_formview_item_style_info(context_id, {column_info, custom_element_info});
    column_styling.customizations = column_styling.customizations || {};
    // const existing_config = this.get_custom_element_existing_config(custom_element_id);
    window.show_form_view_normal_element_customization_popup(this, column_info, custom_element_info, column_styling.customizations);
}

FormView.prototype.parse_customizations_css = function (new_config, div_holder_element) {
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

    for (const css_item of FormView.FORM_ITEM_DIV_ELEMENT_PROTECTED_CSS_RULES) {
        const value = div_holder_element.css(css_item);
        if(value){
            css_to_set[css_item] = value;
        }
    }

    div_holder_element.attr('style', '');



    return css_to_set;
}

FormView.prototype.load_customization_to_normal_column_element = function (column_info, new_config) {
    const div_holder_element = column_info.formViewElements.divHolders[this.mode];
    console.log('load_customization_to_normal_column_element new_config', new_config);
    console.log('load_customization_to_normal_column_element column_info', column_info);
    // console.log('load_customization_to_normal_column_element div_holder_element', div_holder_element);
    const inner_span = div_holder_element.find('.primary_display_name_inner_span');
    if(new_config.display_name){
        inner_span.text(new_config.display_name);
    }
    if(new_config.text_color){
        inner_span.css('color', new_config.text_color);
    }

    const css_to_set = this.parse_customizations_css(new_config, div_holder_element);

    if(Object.keys(css_to_set).length){
        div_holder_element.css(css_to_set);
    }
    
}


FormView.prototype.load_customization_to_custom_column_element = function (custom_element_info, new_config) {
    const div_holder_element =  this.get_custom_element_svelte_instance(custom_element_info.id).container_element_jquery;

    if(new_config.display_name){
        // might be optional
        div_holder_element.find('.primary_display_name_inner_span').text(new_config.display_name);
    }

    const css_to_set = this.parse_customizations_css(new_config, div_holder_element);

    if(Object.keys(css_to_set).length){
        div_holder_element.css(css_to_set);
    }


    const svelte_instance = this.get_custom_element_svelte_instance(custom_element_info.id);
    svelte_instance.handle_customizations_updated(new_config);
    // div_holder_element.css('color', new_config.text_color);

}

FormView.prototype.handle_normal_form_view_element_config_updated = function (column_info, custom_element_info, new_config) {
    const column_styling = this.get_latest_formview_item_style_info(column_info?.id || custom_element_info?.id, {column_info, custom_element_info});
    column_styling.customizations = new_config;

    if(column_info){
        this.load_customization_to_normal_column_element(column_info, new_config);
    }
    else if(custom_element_info){
        this.load_customization_to_custom_column_element(custom_element_info, new_config);
    }

    // console.log('svelte_instance', svelte_instance);
    // svelte_instance.handle_config_updated(new_config);
}


FormView.prototype.move_all_form_items_to_next_row = function (column_id, element, direction) {
    console.log('move_all_form_items_to_next_row', column_id, element.get(0));

    direction = direction || 'down'; // up or down

    const parent_row = element.closest('tr');
    let target_row;
    if(direction === 'down'){
        target_row = parent_row.next();
    }
    else{
        target_row = parent_row.prev();
    }

    const current_row_number = Number(parent_row.attr('data-position'));

    console.log('current_row_number', current_row_number)

    if(target_row.find('.ui-draggable').length){
        alert('Next row is not empty')
        return;
    }

    let index = 0;
    parent_row.children('td').each(function(){
        const td_element = $(this);
        const child_element = td_element.children('.ui-draggable');

        console.log('moving start -> ', this, index, 'child : ', child_element.get(0));

        if(!child_element.length){
            index++;
            return;
        }

        console.log('moving -> ', child_element.get(0), index);
        child_element.appendTo(target_row.children().eq(index))
        index++;
    });

}







FormView.prototype.update_column_stack_style = function (column_id, column_div_holder_element, style_type) {
    // let mounted_svelte_instance;
    // switch (style_type){
    //     case 'title_with_caption':
    //         mounted_svelte_instance = this.styling_helper.mount_custom_element__title_with_caption(this, target_element);
    //         break;
    // }

    column_div_holder_element.removeClass(Object.keys(FormView.COLUMN_STACK_STYLES).join(' '));
    column_div_holder_element.addClass(style_type);

    column_div_holder_element.attr('data-column_stack_style', style_type);

}

FormView.prototype.get_all_columns_as_array = function(){
    const self = this;
    return self.subModule.get_all_columns_as_array();
}







// FormView.prototype.get_item_value = function (custom_element_id, element) {
//     console.log('show_edit_custom_element_popup', custom_element_id, element);
//
//     const custom_element_info = this.get_custom_element_info(custom_element_id);
//     // const existing_config = this.get_custom_element_existing_config(custom_element_id);
//     window.show_form_view_custom_element_customization_popup(this, custom_element_id, custom_element_info.type , custom_element_info.config);
// }



FormView.prototype.show_edit_custom_element_popup = function (custom_element_id, element) {
    console.log('show_edit_custom_element_popup', custom_element_id, element);

    const custom_element_info = this.get_custom_element_info(custom_element_id);
    // const existing_config = this.get_custom_element_existing_config(custom_element_id);
    window.show_form_view_custom_element_customization_popup(this, custom_element_id, custom_element_info.type , custom_element_info.config);
}

FormView.prototype.verify_with_user_and_delete_custom_element = function (custom_element_id, element) {
    console.log('verify_with_user_and_delete_custom_element', custom_element_id, element);

    if(!confirm('Delete this element?')){
        return;
    }
    const custom_element_info = this.get_custom_element_info(custom_element_id);
    this.delete_custom_element(custom_element_info);
}


FormView.prototype.handle_custom_form_view_element_config_updated = function (custom_element_id, new_config) {
    const custom_element_info = this.get_custom_element_info(custom_element_id);
    custom_element_info.config = new_config;

    const svelte_instance = this.get_custom_element_svelte_instance(custom_element_id);
    console.log('new_config', new_config);
    console.log('svelte_instance', svelte_instance);
    svelte_instance.handle_config_updated(new_config);
}

FormView.prototype.handle_new_custom_form_view_element_mounted = function (mounted_svelte_instance) {
    mounted_svelte_instance.container_element_jquery.data('svelte_instance', mounted_svelte_instance);
    if(this.is_in_styling_mode){
        this.refresh_form_view_column_holder_elements(mounted_svelte_instance.container_element);
    }
}

FormView.prototype.get_custom_element_info = function (item_id) {
    return this.latest_styling_setting.custom_elements[item_id];
}

FormView.prototype.get_all_custom_elements = function () {
    return this.latest_styling_setting.custom_elements;
}


FormView.prototype.delete_custom_element = function (custom_element_info) {
    delete this.latest_styling_setting.custom_elements[custom_element_info.id];
    this.get_custom_element_svelte_instance(custom_element_info.id).container_element.remove();
}

FormView.prototype.get_custom_element_svelte_instance = function (item_id) {
    return this.elements.divMain.find('.table-main:visible').find(`.form_view_custom_element[data-custom_element_id="${item_id}"]`).data('svelte_instance');
}

FormView.prototype.mount_custom_element = async function (item_id, item_type, target_element, existing_config) {
    let is_new_item = false;
    let _created_at_utc;
    if(!item_id){
        _created_at_utc = Date.now();
        item_id = `ce_${this.mode}_${item_type}__${_created_at_utc}`;
        is_new_item = true;
    }

    let mounted_svelte_instance;
    let current_custom_element_type;
    switch (item_type){
        case 'title_with_caption':
            current_custom_element_type = 'title_with_caption';
            mounted_svelte_instance = await this.styling_helper.mount_custom_element__title_with_caption(this, item_id, existing_config, target_element);
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
        case FormView.CUSTOM_ELEMENTS.number_display.id:
            mounted_svelte_instance = await this.styling_helper.mount_custom_element__number_display(this, item_id, existing_config, target_element);
            break;
    }

    this.handle_new_custom_form_view_element_mounted(mounted_svelte_instance);

    if(is_new_item){
        this.latest_styling_setting.custom_elements[item_id] = {
            id: item_id,
            type: item_type,
            _created_at_utc : _created_at_utc,
            unique_id: item_id,
            config: {}
        }
    }

    return mounted_svelte_instance;
}


FormView.prototype.styling_helper = {
    mount_custom_element__title_with_caption: async function (form_view, item_id, item_config, target_element) {
        if (!item_config) {
            item_config = {title_text: '', title_font_size:'', caption_text: '', caption_font_size: ''};
        }

        const svelte_instance = await window.mount_form_view_custom_element(form_view, target_element, 'title_with_caption', {
            unique_id: item_id,
            config: item_config
        });

        return svelte_instance;
    },
    mount_custom_element__caption_only: async function (form_view, item_id, item_config, target_element) {
        if (!item_config) {
            item_config = {caption_text: '', caption_font_size: ''};
        }

        const svelte_instance = await window.mount_form_view_custom_element(form_view, target_element, 'caption_only', {
            unique_id: item_id,
            config: item_config
        });

        return svelte_instance;
    },

    mount_custom_element__label_with_value: async function (form_view, item_id, item_config, target_element) {
        if (!item_config) {
            item_config = {label_text: '', value_text: ''};
        }

        const svelte_instance = await window.mount_form_view_custom_element(form_view, target_element, 'label_with_value', {
            unique_id: item_id,
            config: item_config
        });

        return svelte_instance;
    },


    mount_custom_element__stat_card_with_value: async function (form_view, item_id, item_config, target_element) {
        if (!item_config) {
            item_config = {label_text: '', value_text: ''};
        }

        const svelte_instance = await window.mount_form_view_custom_element(form_view, target_element, 'stat_card_with_value', {
            unique_id: item_id,
            config: item_config
        });

        return svelte_instance;
    },

    mount_custom_element__number_display: async function (form_view, item_id, item_config, target_element) {
        if (!item_config) {
            item_config = {label_text: '', value_text: ''};
        }

        const svelte_instance = await window.mount_form_view_custom_element(form_view, target_element, FormView.CUSTOM_ELEMENTS.number_display.id, {
            unique_id: item_id,
            config: item_config
        });

        return svelte_instance;
    }
}

//
// FormView.prototype.do_test_1 = function (element) {
//     console.log('element', element)
//
//     const svelte_instance = window.mount_form_view_custom_element(element, 'title_with_caption', {
//         config: {}
//     });
//
//     return svelte_instance;
// }
//
