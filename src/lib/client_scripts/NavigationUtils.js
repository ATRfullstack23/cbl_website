



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

