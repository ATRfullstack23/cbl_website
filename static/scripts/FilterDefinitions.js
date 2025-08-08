


Filter.FILTER_TYPES = {};
Filter.FILTER_TYPES.FREE_SEARCH = 'freeSearch';
Filter.FILTER_TYPES.NUMBER = 'number';
Filter.FILTER_TYPES.CHECKBOX = 'checkbox';
Filter.FILTER_TYPES.DATE = 'date';
Filter.FILTER_TYPES.CHOICE = 'choice';
Filter.FILTER_TYPES.TAB_FILTER = 'tabFilter';
Filter.FILTER_TYPES.LOOKUP = 'lookUp';
Filter.FILTER_TYPES.HIDDEN = 'hidden';



Filter.TAB_FILTER_STYLES = [
    {
        "text" : "button_like_tabs",
        "value" : "button_like_tabs",
    },
    {
        "text" : "full_background_tab",
        "value" : "full_background_tab",
    }
];


Filter.ADVANCED_SETTINGS = {
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
                    "unique_id": "emoji_icon",
                    "display_name": "Icon Emoji",
                    "data_type": "text",
                    "input_type": "emoji",
                },
                {
                    "unique_id": "tab_filter_style",
                    "display_name": "Tab Filter Style",
                    "data_type": "text",
                    "context_type": "tabFilter",
                    "input_type": "dropdownlist",
                    "options": Filter.TAB_FILTER_STYLES,
                }
            ]
        }
    }
};


