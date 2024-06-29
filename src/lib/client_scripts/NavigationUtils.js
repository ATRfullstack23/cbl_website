



export function get_main_navigation_configuration() {
    return null;
}

export async function generate_main_navigation_configuration(erp_instance) {
    const nav_config = {
        "version": "1.0",
        "display_name": erp_instance.displayName,
        "id": erp_instance.id,
        items: []
    };

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

