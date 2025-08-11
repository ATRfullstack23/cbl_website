

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
                {
                    "unique_id": "display_icon_left",
                    "display_name": "Display Icon",
                    "data_type": "text",
                    "input_type": "emoji",
                },
                {
                    "unique_id": "min_width",
                    "display_name": "Minimum Width",
                    "data_type": "int",
                    "input_type": "css_unit",
                },
            ]
        }
    }
}

Grid.CUSTOM_ELEMENTS = {
    inline_table_display: {
        id: 'inline_table_display',
        display_name: 'Inline Table',
        customization_config: {
            items: [
                {
                    "unique_id": "main_detail_items",
                    "display_name": "Main detail items",
                    "data_type": "array_of_objects",
                    "input_type": "array_of_objects",
                    "custom_schema" : [
                        {
                            "unique_id": "item_text",
                            "display_name": "Text",
                            "placeholder": "Display text",
                            "data_type": "text",
                            "input_type": "single_line",
                        },
                        {
                            "unique_id": "item_value",
                            "display_name": "Value",
                            "data_type": "text",
                            "input_type": "column_id",
                        },
                    ]
                }
            ]
        }
    },
    // currency_amount_display: {
    //     id: 'currency_amount_display',
    //     display_name: 'Money Display',
    //     customization_config: {
    //         items: [
    //             {
    //                 "unique_id": "currency_static_value",
    //                 "display_name": "Currency Static Value",
    //                 "data_type": "text",
    //                 "input_type": "single_line",
    //             },
    //             {
    //                 "unique_id": "currency_column_id",
    //                 "display_name": "Currency column",
    //                 "data_type": "text",
    //                 "input_type": "column_id",
    //             },
    //             {
    //                 "unique_id": "amount_column_id",
    //                 "display_name": "Amount column",
    //                 "data_type": "text",
    //                 "input_type": "column_id",
    //             }
    //         ]
    //     }
    // }
}



