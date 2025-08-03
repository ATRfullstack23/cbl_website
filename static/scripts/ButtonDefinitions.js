


Button.BUTTON_TYPES = {};

Button.BUTTON_TYPES.CREATE = 'create';
Button.BUTTON_TYPES.EDIT = 'edit';
Button.BUTTON_TYPES.DELETE = 'delete';
Button.BUTTON_TYPES.VIEW = 'view';
Button.BUTTON_TYPES.EMAIL = 'email';
Button.BUTTON_TYPES.SMS = 'sms';
Button.BUTTON_TYPES.PRINT = 'print';
Button.BUTTON_TYPES.EXEC_SQL = 'execSql';
Button.BUTTON_TYPES.EXEC_JAVA_SCRIPT = 'execJavaScript';
Button.BUTTON_TYPES.EXPORT_TO_EXCEL = 'exportToExcel';
Button.BUTTON_TYPES.OPEN_SUBMODULE_IN_FORMVIEW_MODE = 'openSubModuleInFormViewMode';
Button.BUTTON_TYPES.OPEN_CHILD_WINDOW = 'openChildWindow';
Button.BUTTON_TYPES.STATUS_CHANGE = 'statusChange';
Button.BUTTON_TYPES.TRIGGER_ANOTHER_BUTTON = 'triggerAnotherButton';

Button.BUTTON_MODES = {};
Button.BUTTON_MODES.GRID = 'grid';
Button.BUTTON_MODES.FORM = 'form';




Button.BUTTON_SETTINGS = {};

Button.BUTTON_SETTINGS = {
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
                    // "group_header": "Styling",
                    "unique_id": "button_style",
                    "display_name": "Button Style",
                    // "display_as_inline": true,
                    "data_type": "text",
                    "input_type": "dropdownlist",
                    "options": [
                        {
                            "text" : "Default Primary",
                            "value" : "default_primary",
                        },
                        {
                            "text" : "Default Positive",
                            "value" : "default_positive",
                        },
                        {
                            "text" : "Default Neutral",
                            "value" : "default_neutral",
                        },
                        {
                            "text" : "Default Negative",
                            "value" : "default_negative",
                        }
                    ],
                }
            ]
        }
    }
};


