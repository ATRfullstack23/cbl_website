


SubModule.prototype.get_card_view_setting_from_user = function () {
    const self = this;
    let setting_name = `cardview_config__${self.id}`
    return self.erp.get_role_setting_value(setting_name);
}
SubModule.prototype.get_latest_card_view_settings = function(){
    if(!this.latest_cardview_config){
        this.latest_cardview_config = this.get_card_view_setting_from_user() || {
            type : 'classic_card'
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

SubModule.prototype.save_card_view_template_settings = function(){
    var self = this;

    let setting_name = `cardview_config__${self.id}`


    self.erp.saveRoleSetting(setting_name, self.get_latest_card_view_settings(), ()=>{
        console.log(setting_name, ' saved')
    });


    return self;
}
