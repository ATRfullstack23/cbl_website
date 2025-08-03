

ButtonManager.prototype.get_button_settings_config_name = function (button_info) {
    return `button_settings__${this.subModule.module.id}__${this.subModule.id}__${button_info.id}`;
}

ButtonManager.prototype.get_button_settings_from_user = function (button_info) {
    if(!button_info.advanced_settings){
        button_info.advanced_settings = this.erp.get_role_setting_value(this.get_button_settings_config_name(button_info)) || {
        };
    }
    return button_info.advanced_settings;
}

ButtonManager.prototype.handle_button_advanced_settings_updated = function (button_info, new_config) {
    new_config.last_updated = Date.now();
    button_info.advanced_settings = new_config;
    button_info.grid_view_element_svelte_instance.handle_advanced_settings_updated(new_config);
    self.erp.saveRoleSetting(this.get_button_settings_config_name(button_info), new_config, ()=>{
        // console.log(setting_name, ' saved')
    });
}

ButtonManager.prototype.show_edit_button_settings_popup = function (button_element) {
    const self = this;

    const button_info = self.buttons[button_element.attr('data-button_id')];

    console.log('show_edit_button_settings_popup button_info : ', button_info);

    window.show_edit_button_advanced_settings_popup(button_info, self.get_button_settings_from_user(button_info));

    // self.erp.saveRoleSetting(setting_name, styling_config, ()=>{
    //     console.log(setting_name, ' saved')
    // });

}

