

ChildWindow.prototype.get_child_window_settings_config_name = function () {
    return `child_window_settings__${this.module.id}__${this.subModule.id}__${this.id}`;
}

ChildWindow.prototype.get_child_window_settings_from_user = function () {
    if(!this.advanced_settings){
        this.advanced_settings = this.erp.get_role_setting_value(this.get_child_window_settings_config_name()) || {};
    }
    return this.advanced_settings;
}

ChildWindow.prototype.handle_child_window_advanced_settings_updated = function (new_config) {
    new_config.last_updated = Date.now();
    this.advanced_settings = new_config;
    this.svelte_element_instance.handle_advanced_settings_updated(new_config);
    self.erp.saveRoleSetting(this.get_child_window_settings_config_name(), new_config, ()=>{
        // console.log(setting_name, ' saved')
    });
}

ChildWindow.prototype.show_edit_child_window_settings_popup = function () {
    const self = this;

    window.show_edit_child_window_advanced_settings_popup(this, self.get_child_window_settings_from_user());

    // self.erp.saveRoleSetting(setting_name, styling_config, ()=>{
    //     console.log(setting_name, ' saved')
    // });

}

