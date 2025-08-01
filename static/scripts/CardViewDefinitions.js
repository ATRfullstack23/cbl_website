const CardView = {};

CardView.TEMPLATES = {
    classic_card: {
        id: 'classic_card',
        display_name: 'Classic',
        data_mapping_config: {
            items: [
                {
                    "unique_id": "main_header_text",
                    "display_name": "Main header text",
                    "data_type": "text",
                    "input_type": "column_id",
                },
                {
                    "unique_id": "main_header_caption",
                    "display_name": "Main header caption",
                    "data_type": "text",
                    "input_type": "column_id",
                },
                {
                    "unique_id": "main_detail_items",
                    "display_name": "Main detail items",
                    "data_type": "array_of_objects",
                    "input_type": "column_id",
                }
            ]
        }
    },
    customer_compact_card: {
        id: 'customer_compact_card',
        display_name: 'Customer Compact',
        customization_config: {
            items: [
                {
                    "unique_id": "title_text",
                    "display_name": "title_text",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "caption_text",
                    "display_name": "caption_text",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "content_alignment",
                    "display_name": "Content Position",
                    "data_type": "text",
                    "input_type": "dropdownlist",
                    "options": [
                        {
                            "text" : "Left",
                            "value" : "left",
                        },
                        {
                            "text" : "Right",
                            "value" : "right",
                        },
                        {
                            "text" : "Center",
                            "value" : "center",
                        },
                    ],
                }
            ]
        }
    }
}


