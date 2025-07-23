



FormView.COLUMN_STACK_STYLES = {
    vertical_stack_1: {
        id: 'vertical_stack_1',
        display_name: 'Vertical',
    },
    form_element_only: {
        id: 'form_element_only',
        display_name: 'Form Element Only',
    },
    horizontal_stack_display_name_100px: {
        id: 'horizontal_stack_display_name_100px',
        display_name: 'Horizontal Short name',
    },
    horizontal_stack_display_name_200px: {
        id: 'horizontal_stack_display_name_200px',
        display_name: 'Horizontal Long name',
    },
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





FormView.CUSTOM_ELEMENTS = {
    title_only: {
        id: 'title_only',
        display_name: 'Title Only',
        customization_config: {
            items: [
                {
                    "unique_id": "title_text",
                    "display_name": "title_text",
                    "data_type": "text",
                    "input_type": "single_line",
                }
            ]
        }
    },
    title_with_caption: {
        id: 'title_with_caption',
        display_name: 'Title With Caption',
        customization_config: {
            items: [
                {
                    "unique_id": "title_text",
                    "display_name": "title_text",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "caption_text",
                    "display_name": "caption_text",
                    "data_type": "text",
                    "input_type": "single_line",
                }
            ]
        }
    },
    count_display: {
        id: 'count_display',
        display_name: 'Count Display',
        customization_config: {
            items: [
                {
                    "unique_id": "text_content",
                    "display_name": "text_content",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "data_column",
                    "display_name": "data_column",
                    "data_type": "text",
                    "input_type": "column_id",
                }
            ]
        }
    }
}


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


FormView.prototype.delete_custom_element = function (custom_element_info) {
    delete this.latest_styling_setting.custom_elements[custom_element_info.id];
    this.get_custom_element_svelte_instance(custom_element_info.id).container_element.remove();
}

FormView.prototype.get_custom_element_svelte_instance = function (item_id) {
    return this.elements.divMain.find('.table-main:visible').find(`.form_view_custom_element[data-custom_element_id="${item_id}"]`).data('svelte_instance');
}

FormView.prototype.mount_custom_element = function (item_id, item_type, target_element, existing_config) {
    let is_new_item = false;
    let _created_at_utc;
    if(!item_id){
        _created_at_utc = Date.now();
        item_id = `ce_${this.mode}_${item_type}__${_created_at_utc}`;
        is_new_item = true;
    }

    let mounted_svelte_instance;
    switch (item_type){
        case 'title_with_caption':
            mounted_svelte_instance = this.styling_helper.mount_custom_element__title_with_caption(this, item_id, existing_config, target_element);
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
  mount_custom_element__title_with_caption : function (form_view, item_id, item_config, target_element) {
      if(!item_config){
          item_config = {title_text: '', caption_text: ''};
      }

      const svelte_instance = window.mount_form_view_custom_element(target_element, 'title_with_caption', {
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
