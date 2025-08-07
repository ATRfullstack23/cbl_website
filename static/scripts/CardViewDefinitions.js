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
    basic_card: {
        id: "basic_card",
        display_name: 'Basic',
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
    basic_detailed: {
        id: "basic_detailed",
        display_name: 'Basic Detailed',
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
    modern_card: {
        id: "modern_card",
        display_name: 'Modern Card',
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
    product_profile_card_detailed: {
        id: "product_profile_card_detailed",
        display_name: "Product Profile Detailed",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "caption",
                    display_name: "Caption",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "primary_section_title",
                    display_name: "Primary section title",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "secondary_section_title",
                    display_name: "Secondary section title",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "stock_badge",
                    display_name: "Stock badge",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "main_detail_items",
                    display_name: "Main detail items",
                    data_type: "array_of_objects",
                    input_type: "array_of_objects",
                    custom_schema : [
                        {
                            unique_id: "item_text",
                            display_name: "Text",
                            placeholder: "Display text",
                            data_type: "text",
                            input_type: "single_line",
                        },
                        {
                            unique_id: "item_value",
                            display_name: "Value",
                            data_type: "text",
                            input_type: "column_id",
                        },
                    ]
                }
            ]
        }
    },
    product_profile_card_compact: {
        id: "product_profile_card_compact",
        display_name: "Product Profile Compact",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "caption",
                    display_name: "Caption",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "stock_badge",
                    display_name: "Stock badge",
                    data_type: "text",
                    input_type: "column_id",
                },
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
    invoice_card_compact: {
        id: "invoice_card_compact",
        display_name: "Invoice Compact",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "caption",
                    display_name: "Caption",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "invoice_status",
                    display_name: "Invoice status",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "payment_status",
                    display_name: "Payment status",
                    data_type: "text",
                    input_type: "column_id",
                },
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
    payment_receipt_card_detailed: {
        id: "payment_receipt_card_detailed",
        display_name: "Payment Receipt Detailed",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "payment_mode_badge",
                    display_name: "Payment mode badge",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "payment_amount_details",
                    display_name: "Payment amount details",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "primary_section_title",
                    display_name: "Primary section title",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "secondary_section_title",
                    display_name: "Secondary section title",
                    data_type: "text",
                    input_type: "column_id",
                },
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
                },
                {
                    unique_id: "additional_detail_items",
                    display_name: "Additional detail items",
                    data_type: "array_of_objects",
                    input_type: "array_of_objects",
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
    payment_receipt_card_compact: {
        id: "payment_receipt_card_compact",
        display_name: "Payment Receipt Compact",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "payment_mode_badge",
                    display_name: "Payment mode badge",
                    data_type: "text",
                    input_type: "column_id",
                },
                {
                    unique_id: "badge_icon",
                    display_name: "Badge Icon",
                    data_type: "icon",
                    input_type: "column_id",
                },
                {
                    unique_id: "payment_amount_details",
                    display_name: "Payment amount details",
                    data_type: "text",
                    input_type: "column_id",
                },
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
    financial_year_compact_card: {
        id: "financial_year_compact_card",
        display_name: "Financial Year Compact",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "date_range_start",
                    display_name: "Date range start",
                    data_type: "date",
                    input_type: "column_id"
                },
                {
                    unique_id: "date_range_end",
                    display_name: "Date range end",
                    data_type: "date",
                    input_type: "column_id"
                },
                {
                    unique_id: "date_format_style",
                    display_name: "Date format style",
                    data_type: "date_format_templates",
                    input_type: "column_id"
                },
                {
                    unique_id: "heading_icon",
                    display_name: "Heading icon",
                    data_type: "icon",
                    input_type: "column_id"
                },
                {
                    unique_id: "duration_display",
                    display_name: "Duration display",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "status_badge",
                    display_name: "Status badge",
                    data_type: "boolean",
                    input_type: "condition"
                }
            ]
        }
    },
    financial_year_minimal_card: {
        id: "financial_year_minimal_card",
        display_name: "Financial Year Minimal",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "date_range",
                    display_name: "Date range",
                    data_type: "date_range",
                    input_type: "column_id"
                },
                {
                    unique_id: "duration_display",
                    display_name: "Duration display",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "date_format_style",
                    display_name: "Date format style",
                    data_type: "date_format_templates",
                    input_type: "column_id"
                },
                {
                    unique_id: "status_badge",
                    display_name: "Status badge",
                    data_type: "boolean",
                    input_type: "condition"
                }
            ]
        }
    },
    leave_compact_card: {
        id: "leave_compact_card",
        display_name: "Leave Card Compact",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "id_badge",
                    display_name: "ID badge",
                    data_type: "number",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_detail_items",
                    display_name: "Main Detail Items",
                    data_type: "array_of_objects",
                    input_type: "array_of_objects",
                    custom_schema : [
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
                },
                {
                    unique_id: "address_field",
                    display_name: "Address field",
                    data_type: "text",
                    input_type: "column_id"
                }
            ]
        }
    },
    leave_detailed_card: {
        id: "leave_detailed_card",
        display_name: "Leave Card Detailed",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "id_badge",
                    display_name: "ID badge",
                    data_type: "number",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_detail_items",
                    display_name: "main detail items",
                    data_type: "array_of_objects",
                    input_type: "array_of_objects",
                    custom_schema : [
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
                },
                {
                    unique_id: "address_field",
                    display_name: "Address field",
                    data_type: "text",
                    input_type: "column_id"
                }
            ]
        }
    },
    leave_minimal_card: {
        id: "leave_minimal_card",
        display_name: "Leave Card Minimal",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "id_badge",
                    display_name: "ID badge",
                    data_type: "number",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_detail_items",
                    display_name: "Main Detail Items",
                    data_type: "array_of_objects",
                    input_type: "array_of_objects",
                    custom_schema : [
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
                },
                {
                    unique_id: "address_field",
                    display_name: "Address field",
                    data_type: "text",
                    input_type: "column_id"
                }
            ]
        }
    },
    customer_compact_card: {
        id: "customer_compact_card",
        display_name: "Customer Compact Card",
        data_mapping_config: {
            items: [
                {
                    "unique_id": "main_header_text",
                    "display_name": "Main header text",
                    "data_type": "text",
                    "input_type": "column_id"
                },
                {
                    "unique_id": "main_header_caption",
                    "display_name": "Main header caption",
                    "data_type": "text",
                    "input_type": "column_id"
                },
                {
                    "unique_id": "id_badge",
                    "display_name": "ID badge",
                    "data_type": "number",
                    "input_type": "column_id"
                },
                {
                    "unique_id": "main_detail_items",
                    "display_name": "Main Detail Items",
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
                },
                {
                    unique_id: "address_field",
                    display_name: "Address field",
                    data_type: "text",
                    input_type: "column_id"
                }
            ]
        }
    },
    customer_detailed_card: {
        id: "customer_detailed_card",
        display_name: "Customer Detailed Card",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "id_badge",
                    display_name: "ID badge",
                    data_type: "number",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_detail_items",
                    display_name: "Main Detail Items",
                    data_type: "array_of_objects",
                    input_type: "array_of_objects",
                    custom_schema : [
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
                },
                {
                    unique_id: "address_field",
                    display_name: "Address field",
                    data_type: "text",
                    input_type: "column_id"
                }
            ]
        }
    },
    customer_minimal_card: {
        id: "customer_minimal_card",
        display_name: "Customer Minimal Card",
        data_mapping_config: {
            items: [
                {
                    unique_id: "main_header_text",
                    display_name: "Main header text",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_header_caption",
                    display_name: "Main header caption",
                    data_type: "text",
                    input_type: "column_id"
                },
                {
                    unique_id: "id_badge",
                    display_name: "ID badge",
                    data_type: "number",
                    input_type: "column_id"
                },
                {
                    unique_id: "main_detail_items",
                    display_name: "Main Detail Items",
                    data_type: "array_of_objects",
                    input_type: "array_of_objects",
                    custom_schema : [
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
                },
                {
                    unique_id: "address_field",
                    display_name: "Address field",
                    data_type: "text",
                    input_type: "column_id"
                }
            ]
        }
    },
    customer_compact_card_duplicate: {
        id: 'customer_compact_card_duplicate',
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


