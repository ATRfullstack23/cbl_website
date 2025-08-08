

FilterManager.prototype.get_filter_settings_config_name = function (filter_info) {
    return `filter_settings__${this.subModule.module.id}__${this.subModule.id}__${filter_info.id}`;
}

FilterManager.prototype.get_filter_settings_from_user = function (filter_info) {
    if(!filter_info.advanced_settings){
        filter_info.advanced_settings = this.erp.get_role_setting_value(this.get_filter_settings_config_name(filter_info)) || {
        };
    }
    return filter_info.advanced_settings;
}

FilterManager.prototype.handle_filter_advanced_settings_updated = function (filter_info, new_config) {
    new_config.last_updated = Date.now();
    // filter_info.advanced_settings = new_config;
    filter_info.load_customizations(new_config);
    self.erp.saveRoleSetting(this.get_filter_settings_config_name(filter_info), new_config, ()=>{
        // console.log(setting_name, ' saved')
    });
}

FilterManager.prototype.show_edit_filter_settings_popup = function (filter_element) {
    const self = this;

    const filter_info = self.filters[filter_element.attr('data-filter_id')];

    console.log('show_edit_filter_settings_popup filter_info : ', filter_info);

    window.show_edit_filter_advanced_settings_popup(filter_info, self.get_filter_settings_from_user(filter_info));

    // self.erp.saveRoleSetting(setting_name, styling_config, ()=>{
    //     console.log(setting_name, ' saved')
    // });

}

