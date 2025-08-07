FormView.DISPLAY_MODES = {
    DEFAULT: 'default',
    INLINE: 'inline'
}

FormView.HIDDEN_MODE = 'none';
FormView.CREATE_MODE = 'create';
FormView.EDIT_MODE = 'edit';
FormView.VIEW_MODE = 'view';

FormView.FORM_ITEM_DIV_ELEMENT_PROTECTED_CSS_RULES = ['width', 'height', 'minHeight', '--column_custom_width', '--column_custom_height', 'position'];


FormView.COLUMN_STACK_STYLES = {
    vertical_stack_1: {
        id: 'vertical_stack_1',
        display_name: 'Vertical',
    },
    form_element_only: {
        id: 'form_element_only',
        display_name: 'Form Element Only',
    },
    horizontal_stack_display_name_100px: {
        id: 'horizontal_stack_display_name_100px',
        display_name: 'Horizontal Short name',
    },
    horizontal_stack_display_name_200px: {
        id: 'horizontal_stack_display_name_200px',
        display_name: 'Horizontal Long name',
    },
}


FormView.NORMAL_ELEMENTS = {
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
                    "group_header": "Colors",
                    "unique_id": "text_color",
                    "display_name": "Text Color",
                    "display_as_inline": true,
                    "data_type": "text",
                    "input_type": "color",
                },
                {
                    "unique_id": "background_color",
                    "display_name": "Background",
                    "display_as_inline": true,
                    "data_type": "text",
                    "input_type": "color",
                },
                {
                    "group_header": "Padding",
                    "unique_id": "padding_left",
                    "display_as_inline": true,
                    "display_name": "Left",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "unique_id": "padding_right",
                    "display_as_inline": true,
                    "display_name": "Right",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "unique_id": "padding_top",
                    "display_as_inline": true,
                    "display_name": "Top",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "unique_id": "padding_bottom",
                    "display_as_inline": true,
                    "display_name": "Bottom",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "group_header": "Margin",
                    "unique_id": "margin_left",
                    "display_as_inline": true,
                    "display_name": "Left",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "unique_id": "margin_right",
                    "display_as_inline": true,
                    "display_name": "Right",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "unique_id": "margin_top",
                    "display_as_inline": true,
                    "display_name": "Top",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "unique_id": "margin_bottom",
                    "display_as_inline": true,
                    "display_name": "Bottom",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "group_header": "Border",
                    "unique_id": "border_thickness",
                    "display_as_inline": true,
                    "display_name": "Thickness",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "unique_id": "border_color",
                    "display_as_inline": true,
                    "display_name": "Color",
                    "data_type": "text",
                    "input_type": "color",
                },
                {
                    "unique_id": "border_radius",
                    "display_as_inline": true,
                    "display_name": "Radius",
                    "data_type": "number",
                    "input_type": "css_unit",
                    "postfix": "px",
                },
                {
                    "unique_id": "border_area",
                    "display_as_inline": true,
                    "display_name": "Type",
                    "data_type": "text",
                    "input_type": "dropdownlist",
                    "options": [
                        {
                            "text" : "All",
                            "value" : "all",
                        },
                        {
                            "text" : "Left",
                            "value" : "left",
                        },
                        {
                            "text" : "Right",
                            "value" : "right",
                        },
                        {
                            "text" : "Top",
                            "value" : "top",
                        },
                        {
                            "text" : "Bottom",
                            "value" : "bottom",
                        },
                    ],
                },
            ]
        }
    }
}

FormView.CUSTOM_ELEMENTS = {
    title_only: {
        id: 'title_only',
        display_name: 'Title Only',
        customization_config: {
            items: [
                {
                    "unique_id": "title_text",
                    "display_name": "title_text",
                    "data_type": "text",
                    "input_type": "single_line",
                }
            ]
        }
    },
    title_with_caption: {
        id: 'title_with_caption',
        display_name: 'Title With Caption',
        customization_config: {
            items: [
                {
                    "unique_id": "title_text",
                    "display_name": "title_text",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "title_font_size",
                    "display_name": "Title Font Size",
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
                    "unique_id": "caption_font_size",
                    "display_name": "caption_font_size",
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
    },
    alert_message: {
        id: 'alert_message',
        display_name: 'Alert Message with Icon',
        customization_config: {
            items: [
                {
                    "unique_id": "caption_text",
                    "display_name": "Alert Message",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "alert_icon",
                    "display_name": "Alert Icon",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "font_size",
                    "display_name": "Font Size",
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
    },
    caption_only: {
        id: 'caption_only',
        display_name: 'Caption Only',
        customization_config: {
            items: [
                {
                    "unique_id": "caption_text",
                    "display_name": "Caption Text",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "caption_font_size",
                    "display_name": "Caption Font Size",
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
    },
    label_with_value:{
        id: 'label_with_value',
        display_name: 'Label With Value',
        customization_config: {
            items: [
                {
                    "unique_id": "label_text",
                    "display_name": "label_text",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "value_text",
                    "display_name": "value_text",
                    "data_type": "text",
                    "input_type": "single_line",
                }
            ]
        }
    },
    stat_card_with_value:{
        id: 'stat_card_with_value',
        display_name: 'Stat Card With Value',
        customization_config: {
            items: [
                {
                    "unique_id": "label_text",
                    "display_name": "label_text",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "value_text",
                    "display_name": "value_text",
                    "data_type": "text",
                    "input_type": "single_line",
                }
            ]
        }
    },
    number_display: {
        id: 'number_display',
        display_name: 'Number Display',
        customization_config: {
            items: [
                {
                    "unique_id": "text_content",
                    "display_name": "text_content",
                    "data_type": "text",
                    "input_type": "single_line",
                },
                {
                    "unique_id": "data_column",
                    "display_name": "data_column",
                    "data_type": "text",
                    "input_type": "column_id",
                }
            ]
        }
    }
}


