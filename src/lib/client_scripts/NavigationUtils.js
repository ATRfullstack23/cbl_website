



export function get_main_navigation_configuration() {
    return null;
}

export async function generate_main_navigation_configuration(erp_instance) {
    let nav_config_by_user = erp_instance.get_user_setting_value('modulesNavigationArrangementHorizontal');
    const nav_config = {
        "version": "1.0",
        "display_name": erp_instance.displayName,
        "id": erp_instance.id,
        items: []
    };

    let added_main_modules_map = {};
    // for(let module_id in erp_instance.modules){
    //     added_main_modules_map[module_id] = false;
    // }


    const main_dashboard_item_config = {
        "icon": "MailBoxSolid",
        "id": "d_1000001",
        "custom_icon": {
            "url": "M11 6.025a1 1 0 0 0-1.065-.998 8.5 8.5 0 1 0 9.038 9.039A1 1 0 0 0 17.975 13H11V6.025Z",
            "color": "#fff"
        },
        "display_name": "Main Dashboard",
        "item_type": "item",
        "action_type": "go_to_dashboard",
        "context_data": {
            "dashboard_id" : 1000001
        }
    };
    nav_config.items.push(main_dashboard_item_config);

    for(const group_key in nav_config_by_user.groups){
        let group_items = nav_config_by_user.groups[group_key];
        let group_config_obj = {
            "id": group_key,
            "display_name": group_key,
            "custom_icon": {
                "url": "M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8",
                "color": "#fff"
            },
            "item_type": "group",
            items: []
        };
        for(const item_key in group_items) {
            let group_item_info = group_items[group_key];
            if(item_key === 'id'){
                continue;
            }
            let actual_module = erp.modules[item_key];
            let item_config_obj = {
                "icon": "ChartPieSolid",
                "id": actual_module.id,
                "display_name": actual_module.displayName,
                "item_type": "item",
                "action_type": "go_to_module",
                "context_data": {
                    "module_id": actual_module.id,
                    "submodule_id": group_item_info?.submodule_id || actual_module.getDefaultSubModule()?.id
                }
            };
            added_main_modules_map[actual_module.id] = true;
            group_config_obj.items.push(item_config_obj);
        }
        // group_config_obj.items.sort()
        nav_config.items.push(group_config_obj);
    }

    for(let module_id in erp_instance.modules){
        if(!added_main_modules_map[module_id]){
            let actual_module = erp.modules[module_id];
            if(actual_module.hiddenFromMainNavigation){
                continue;
            }
            added_main_modules_map[module_id] = true;
            const item_config = {
                "icon": "MailBoxSolid",
                "id": actual_module.id,
                "custom_icon": {
                    "url": "M11 6.025a1 1 0 0 0-1.065-.998 8.5 8.5 0 1 0 9.038 9.039A1 1 0 0 0 17.975 13H11V6.025Z",
                    "color": "#fff"
                },
                "display_name": actual_module.displayName,
                "item_type": "item",
                "action_type": "go_to_module",
                "context_data": {
                    "module_id": actual_module.id,
                    "submodule_id": actual_module.getDefaultSubModule()?.id
                }
            };
            nav_config.items.push(item_config);
        }
    }

    return nav_config;
}

export async function generate_main_navigation_configuration_prev(erp_instance) {
    const nav_config = {
        "version": "1.0",
        "display_name": erp_instance.displayName,
        "id": erp_instance.id,
        items: []
    };

    const main_dashboard_item_config = {
        "icon": "MailBoxSolid",
        "id": "d_1000001",
        "custom_icon": {
            "url": "M11 6.025a1 1 0 0 0-1.065-.998 8.5 8.5 0 1 0 9.038 9.039A1 1 0 0 0 17.975 13H11V6.025Z",
            "color": "#fff"
        },
        "display_name": "Main Dashboard",
        "item_type": "item",
        "action_type": "go_to_dashboard",
        "context_data": {
            "dashboard_id" : 1000001
        }
    };
    nav_config.items.push(main_dashboard_item_config);



    for(var key in erp_instance.modules){
        const module_info = erp_instance.modules[key];
        const single_item_config = {
            "icon": "MailBoxSolid",
            "id": module_info.id,
            "custom_icon": {
                "url": "M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8",
                "color": "#fff"
            },
            "display_name": module_info.displayName,
            "item_type": "item",
            "action_type": "go_to_module",
            "context_data": {
                "module_id" : module_info.id
            }
        };
        nav_config.items.push(single_item_config);
    }

    return nav_config;
}

