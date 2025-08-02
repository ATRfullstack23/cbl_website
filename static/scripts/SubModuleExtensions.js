


SubModule.prototype.get_card_view_setting_from_user = function () {
    const self = this;
    let setting_name = `cardview_config__${self.id}`
    return self.erp.get_role_setting_value(setting_name);
}
SubModule.prototype.get_latest_card_view_settings = function(){
    if(!this.latest_cardview_config){
        this.latest_cardview_config = this.get_card_view_setting_from_user() || {
            type : 'classic_card',
            data_mapping: {}
        };
    }
    return this.latest_cardview_config;
}

SubModule.prototype.update_card_view_style_to_new_type = async function(new_type){
    const self = this;

    self.get_latest_card_view_settings().type = new_type;
    self.save_card_view_template_settings();
    self.setDisplayModeToCardView();
}

SubModule.prototype.handle_card_view_data_mapping_config_updated = async function(to_edit__card_view_type, new_data_mapping){
    const self = this;

    console.log('handle_card_view_data_mapping_config_updated', new_data_mapping)
    self.get_latest_card_view_settings().data_mapping = new_data_mapping;
    self.save_card_view_template_settings();
    self.setDisplayModeToCardView();
}

SubModule.prototype.save_card_view_template_settings = function(){
    var self = this;

    let setting_name = `cardview_config__${self.id}`


    self.erp.saveRoleSetting(setting_name, self.get_latest_card_view_settings(), ()=>{
        console.log(setting_name, ' saved')
    });


    return self;
}
