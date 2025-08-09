

Grid.CREATE_MODE = 'create';
Grid.EDIT_MODE = 'edit';
Grid.VIEW_MODE = 'view';




Grid.NORMAL_ELEMENTS = {
    default : {
        id: 'default',
        display_name: 'Default',
        customization_config: {
            items: [
                {
                    "unique_id": "display_name",
                    "display_name": "Display name",
                    "data_type": "text",
                    "input_type": "single_line",
                },
            ]
        }
    }
}

Grid.CUSTOM_ELEMENTS = {
    currency_amount_display: {
        id: 'currency_amount_display',
        display_name: 'Money Display',
        customization_config: {
            items: [
                {
                    "unique_id": "currency_static_value",
                    "display_name": "Currency Static Value",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "currency_column_id",
                    "display_name": "Currency column",
                    "data_type": "text",
                    "input_type": "column_id",
                },
                {
                    "unique_id": "amount_column_id",
                    "display_name": "Amount column",
                    "data_type": "text",
                    "input_type": "column_id",
                }
            ]
        }
    }
}



