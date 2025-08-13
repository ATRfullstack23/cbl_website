<script>

    import PaginationUI from "$lib/ui_elements/PaginationUI.svelte";
    import InvoiceUI from "$lib/ui_elements/InvoiceUI.svelte";
    import dayjs from "dayjs";
    import erp_config from "./erp_config_accounts_demo.json"
    import {onMount, tick} from "svelte";
    import {ERP} from "$lib/client_scripts/ERP.js";
    import Module from "$lib/submodule/Module.svelte";

    let api_grid_data = {
        "data": [
            {
                "id": 1000068,
                "invoice_number": {
                    "value": "IN5"
                },
                "customer_profile_id": {
                    "value": 1000005,
                    "text": "Silpa"
                },
                "customer_profile_id__text": "Silpa",
                "invoice_date": {
                    "value": "2024-05-27T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 1
                },
                "total_amount": {
                    "value": 3960
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 0
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-31T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 5
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 4
                },
                "amount_excluding_tax": {
                    "value": 3600
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:57:13.130Z",
                "_created_at_timestamp_in_utc": "1749106633121",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            },
            {
                "id": 1000067,
                "invoice_number": {
                    "value": "IN4"
                },
                "customer_profile_id": {
                    "value": 1000002,
                    "text": "Sarath"
                },
                "customer_profile_id__text": "Sarath",
                "invoice_date": {
                    "value": "2024-05-26T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 1
                },
                "total_amount": {
                    "value": 5775
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 0
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-30T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 4
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 4
                },
                "amount_excluding_tax": {
                    "value": 5500
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:56:09.950Z",
                "_created_at_timestamp_in_utc": "1749106569941",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            },
            {
                "id": 1000066,
                "invoice_number": {
                    "value": "IN3"
                },
                "customer_profile_id": {
                    "value": 1000005,
                    "text": "Silpa"
                },
                "customer_profile_id__text": "Silpa",
                "invoice_date": {
                    "value": "2024-05-24T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 2
                },
                "total_amount": {
                    "value": 37950
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 0
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-30T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 3
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 6
                },
                "amount_excluding_tax": {
                    "value": 34500
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:54:34.133Z",
                "_created_at_timestamp_in_utc": "1749106474123",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            },
            {
                "id": 1000065,
                "invoice_number": {
                    "value": "IN2"
                },
                "customer_profile_id": {
                    "value": 1000002,
                    "text": "Sarath"
                },
                "customer_profile_id__text": "Sarath",
                "invoice_date": {
                    "value": "2024-05-22T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 2
                },
                "total_amount": {
                    "value": 3327
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 0
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-30T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 2
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 8
                },
                "amount_excluding_tax": {
                    "value": 2980
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:52:16.350Z",
                "_created_at_timestamp_in_utc": "1749106336337",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            },
            {
                "id": 1000064,
                "invoice_number": {
                    "value": "IN1"
                },
                "customer_profile_id": {
                    "value": 1000001,
                    "text": "John"
                },
                "customer_profile_id__text": "John",
                "invoice_date": {
                    "value": "2024-05-20T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 2
                },
                "total_amount": {
                    "value": 23100
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 3100
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-25T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "partially_paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 1
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 5
                },
                "amount_excluding_tax": {
                    "value": 22000
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:45:02.320Z",
                "_created_at_timestamp_in_utc": "1749105902310",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            }
        ],
        "pager": {
            "totalRows": 5,
            "selectedPageIndex": 1,
            "pageSize": 10,
            "orderByType": "DESC",
            "orderByColumn": "id"
        }
    }

    let main_data_array = api_grid_data.data
    let pagination_data = api_grid_data.pager

    let selected_item = main_data_array[0];

    const TEMP_USER_OBJ = {
        "config": {
            "user": {
                "permissions": {
                    "leave_management_admin": {
                        "row_id": 1000002,
                        "unique_id": "leave_management_admin"
                    },
                    "view_all_leaves": {
                        "row_id": 1000001,
                        "unique_id": "view_all_leaves"
                    }
                },
                "settings": {
                    "customer_sales_quotation_amount_report_gridster_pc": "{\"cards\":{},\"graphs\":{},\"lists\":{\"customer_sales_quotation_amount_report\":{\"top\":5,\"left\":0,\"width\":1218.4,\"height\":310.4,\"data-row\":\"1\",\"data-col\":\"1\",\"data-sizex\":\"1\",\"data-sizey\":\"1\"}},\"reportFilters\":{\"company_name\":{\"top\":89.58749389648438,\"left\":826.7249755859375,\"width\":210.4,\"height\":49.4,\"index\":3},\"customer_name\":{\"top\":89.58749389648438,\"left\":575.125,\"width\":200.4,\"height\":49.4,\"index\":2},\"to_date\":{\"top\":91.72500610351562,\"left\":401.4000244140625,\"width\":122.4,\"height\":45.4,\"index\":1},\"from_date\":{\"top\":91.72500610351562,\"left\":227.67501831054688,\"width\":122.4,\"height\":45.4,\"index\":0}}}",
                    "sales_quotation_edit_formViewConfiguration": "{\"size\":{\"width\":1498}}",
                    "module_navigation_mode": "\"dock\"",
                    "purchase_order_create_formViewConfiguration": "{\"size\":{\"width\":1377}}",
                    "customer_profile_inlineFiltersOrder": "[\"unique_id\",\"customer_company_name\",\"whats_app_number\",\"email_id\",\"gst_number\",\"phone_number\"]",
                    "_users_edit_formViewConfiguration": "{\"size\":{\"width\":1260}}"
                },
                "roleSettings": {
                    "columnButtonFilterVisibility": "{\"purchase_order\":{\"id\":\"purchase_order\",\"subModules\":{\"purchase_order\":{\"id\":\"purchase_order\",\"columns\":{},\"buttons\":{\"submitted_for_approval\":{\"id\":\"submitted_for_approval\",\"displayName\":\"Set as Submitted For Approval\",\"isVisible\":false},\"edit\":{\"id\":\"edit\",\"displayName\":\"Edit\",\"isVisible\":false}},\"filters\":{}}}},\"sales_quotation\":{\"id\":\"sales_quotation\",\"subModules\":{\"sales_quotation\":{\"id\":\"sales_quotation\",\"columns\":{},\"buttons\":{\"submitted_for_approval\":{\"id\":\"submitted_for_approval\",\"displayName\":\"Set as Submitted For Approval\",\"isVisible\":false},\"edit\":{\"id\":\"edit\",\"displayName\":\"Edit\",\"isVisible\":false}},\"filters\":{}}}},\"packing_slip\":{\"id\":\"packing_slip\",\"subModules\":{\"packing_slip\":{\"id\":\"packing_slip\",\"columns\":{},\"buttons\":{\"generate_pdf\":{\"id\":\"generate_pdf\",\"displayName\":\"Generate Pdf\",\"isVisible\":false}},\"filters\":{}}}}}",
                    "moduleVisibility": "{\"financial_year\":{\"id\":\"financial_year\",\"displayName\":\"Financial Year\",\"isVisible\":false}}",
                    "formview_styling_config__leave_requests__create": "{\"column_structure\":{\"start_date\":{\"column_id\":\"start_date\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"start_date\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"start_half_day_type\":{\"column_id\":\"start_half_day_type\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"start_half_day_type\",\"pos_string\":\"0,1\",\"position\":{\"row_index\":0,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"end_date\":{\"column_id\":\"end_date\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"end_date\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"end_half_day_type\":{\"column_id\":\"end_half_day_type\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"end_half_day_type\",\"pos_string\":\"1,1\",\"position\":{\"row_index\":1,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"2,0\",\"position\":{\"row_index\":2,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":270.906,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"2,1\",\"position\":{\"row_index\":2,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":273.984,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"leave_types_row_id\":{\"column_id\":\"leave_types_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"leave_types_row_id\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"available_leave\":{\"column_id\":\"available_leave\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"available_leave\",\"pos_string\":\"4,2\",\"position\":{\"row_index\":4,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":234.875,\"height\":80}},\"leave_reason\":{\"column_id\":\"leave_reason\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"leave_reason\",\"pos_string\":\"6,0\",\"position\":{\"row_index\":6,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":102}}},\"custom_elements\":{},\"last_updated_at_utc\":1753511529926,\"div_main_width\":1151.19,\"display_styling_mode\":\"custom_size\"}",
                    "formview_styling_config__letter_requests__create": "{\"column_structure\":{\"ce_create_title_with_caption__1753512189002\":{\"custom_element_id\":\"ce_create_title_with_caption__1753512189002\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"ce_create_title_with_caption__1753512189002\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":0,\"width\":300,\"height\":70}},\"letter_types_row_id\":{\"column_id\":\"letter_types_row_id\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"letter_types_row_id\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":350,\"height\":80}},\"urgency\":{\"column_id\":\"urgency\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"urgency\",\"pos_string\":\"2,0\",\"position\":{\"row_index\":2,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":350,\"height\":80}},\"purpose\":{\"column_id\":\"purpose\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"purpose\",\"pos_string\":\"3,0\",\"position\":{\"row_index\":3,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":600,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"4,2\",\"position\":{\"row_index\":4,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"description\":{\"column_id\":\"description\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"description\",\"pos_string\":\"5,0\",\"position\":{\"row_index\":5,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":600,\"height\":147.188}}},\"custom_elements\":{\"ce_create_title_with_caption__1753512189002\":{\"id\":\"ce_create_title_with_caption__1753512189002\",\"type\":\"title_with_caption\",\"_created_at_utc\":1753512189002,\"unique_id\":\"ce_create_title_with_caption__1753512189002\",\"config\":{\"title_text\":\"New Letter Request\",\"caption_text\":\"Please fill up the form for requesting letters\"}}},\"last_updated_at_utc\":1753514322202,\"div_main_width\":867.797,\"display_styling_mode\":\"custom_size\"}",
                    "formview_styling_config__employee_documents__create": "{\"column_structure\":{\"ce_create_title_with_caption__1753931890689\":{\"custom_element_id\":\"ce_create_title_with_caption__1753931890689\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"ce_create_title_with_caption__1753931890689\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":0,\"width\":242.891,\"height\":85.375},\"customizations\":{\"background_color\":\"rgba(0, 0, 0, 0.2)\",\"margin_bottom\":50}},\"document_name\":{\"column_id\":\"document_name\",\"column_stack_style\":\"horizontal_stack_display_name_200px\",\"context_item_id\":\"document_name\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":450,\"height\":80},\"customizations\":{\"background_color\":\"rgb(233, 196, 106)\"}},\"employee_document_type_row_id\":{\"column_id\":\"employee_document_type_row_id\",\"column_stack_style\":\"horizontal_stack_display_name_200px\",\"context_item_id\":\"employee_document_type_row_id\",\"pos_string\":\"1,1\",\"position\":{\"row_index\":1,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":414.047,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"3,0\",\"position\":{\"row_index\":3,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"3,1\",\"position\":{\"row_index\":3,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"3,2\",\"position\":{\"row_index\":3,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"document\":{\"column_id\":\"document\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"document\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":325,\"height\":119.875}},\"expiry_date\":{\"column_id\":\"expiry_date\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"expiry_date\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":252.125,\"height\":80}},\"description\":{\"column_id\":\"description\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"description\",\"pos_string\":\"5,0\",\"position\":{\"row_index\":5,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":450,\"height\":174.516},\"customizations\":{\"display_name\":\"Desccc 2\",\"padding_left\":20,\"margin_top\":50,\"border_color\":\"rgba(0, 0, 0, 0.35)\",\"border_thickness\":1,\"border_radius\":10,\"background_color\":\"rgba(0, 0, 0, 0.13)\"}}},\"custom_elements\":{\"ce_create_title_with_caption__1753931890689\":{\"id\":\"ce_create_title_with_caption__1753931890689\",\"type\":\"title_with_caption\",\"_created_at_utc\":1753931890689,\"unique_id\":\"ce_create_title_with_caption__1753931890689\",\"config\":{\"title_text\":\"Upload new document\",\"caption_text\":\"Add a new document of an employee\"}}},\"last_updated_at_utc\":1753932860602,\"div_main_width\":1048,\"display_styling_mode\":\"custom_size\"}"
                },
                "userId": 1000027,
                "roleId": 1000004,
                "userName": "aki",
                "roleName": "System Admin",
                "user": "aki",
                "role": "System Admin",
                "employee_row_id": null,
                "id": 1000027,
                "sessionId": "l8wW5DDdSVEZ_E8WyJ0zs_CPQgCVIJGR"
            }
        },
        "userDetails": {
            "permissions": {
                "leave_management_admin": {
                    "row_id": 1000002,
                    "unique_id": "leave_management_admin"
                },
                "view_all_leaves": {
                    "row_id": 1000001,
                    "unique_id": "view_all_leaves"
                }
            },
            "settings": {
                "customer_sales_quotation_amount_report_gridster_pc": "{\"cards\":{},\"graphs\":{},\"lists\":{\"customer_sales_quotation_amount_report\":{\"top\":5,\"left\":0,\"width\":1218.4,\"height\":310.4,\"data-row\":\"1\",\"data-col\":\"1\",\"data-sizex\":\"1\",\"data-sizey\":\"1\"}},\"reportFilters\":{\"company_name\":{\"top\":89.58749389648438,\"left\":826.7249755859375,\"width\":210.4,\"height\":49.4,\"index\":3},\"customer_name\":{\"top\":89.58749389648438,\"left\":575.125,\"width\":200.4,\"height\":49.4,\"index\":2},\"to_date\":{\"top\":91.72500610351562,\"left\":401.4000244140625,\"width\":122.4,\"height\":45.4,\"index\":1},\"from_date\":{\"top\":91.72500610351562,\"left\":227.67501831054688,\"width\":122.4,\"height\":45.4,\"index\":0}}}",
                "sales_quotation_edit_formViewConfiguration": "{\"size\":{\"width\":1498}}",
                "module_navigation_mode": "\"dock\"",
                "purchase_order_create_formViewConfiguration": "{\"size\":{\"width\":1377}}",
                "customer_profile_inlineFiltersOrder": "[\"unique_id\",\"customer_company_name\",\"whats_app_number\",\"email_id\",\"gst_number\",\"phone_number\"]",
                "_users_edit_formViewConfiguration": "{\"size\":{\"width\":1260}}"
            },
            "roleSettings": {
                "columnButtonFilterVisibility": "{\"purchase_order\":{\"id\":\"purchase_order\",\"subModules\":{\"purchase_order\":{\"id\":\"purchase_order\",\"columns\":{},\"buttons\":{\"submitted_for_approval\":{\"id\":\"submitted_for_approval\",\"displayName\":\"Set as Submitted For Approval\",\"isVisible\":false},\"edit\":{\"id\":\"edit\",\"displayName\":\"Edit\",\"isVisible\":false}},\"filters\":{}}}},\"sales_quotation\":{\"id\":\"sales_quotation\",\"subModules\":{\"sales_quotation\":{\"id\":\"sales_quotation\",\"columns\":{},\"buttons\":{\"submitted_for_approval\":{\"id\":\"submitted_for_approval\",\"displayName\":\"Set as Submitted For Approval\",\"isVisible\":false},\"edit\":{\"id\":\"edit\",\"displayName\":\"Edit\",\"isVisible\":false}},\"filters\":{}}}},\"packing_slip\":{\"id\":\"packing_slip\",\"subModules\":{\"packing_slip\":{\"id\":\"packing_slip\",\"columns\":{},\"buttons\":{\"generate_pdf\":{\"id\":\"generate_pdf\",\"displayName\":\"Generate Pdf\",\"isVisible\":false}},\"filters\":{}}}}}",
                "moduleVisibility": "{\"financial_year\":{\"id\":\"financial_year\",\"displayName\":\"Financial Year\",\"isVisible\":false}}",
                "formview_styling_config__leave_requests__create": "{\"column_structure\":{\"start_date\":{\"column_id\":\"start_date\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"start_date\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"start_half_day_type\":{\"column_id\":\"start_half_day_type\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"start_half_day_type\",\"pos_string\":\"0,1\",\"position\":{\"row_index\":0,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"end_date\":{\"column_id\":\"end_date\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"end_date\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"end_half_day_type\":{\"column_id\":\"end_half_day_type\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"end_half_day_type\",\"pos_string\":\"1,1\",\"position\":{\"row_index\":1,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"2,0\",\"position\":{\"row_index\":2,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":270.906,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"2,1\",\"position\":{\"row_index\":2,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":273.984,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"leave_types_row_id\":{\"column_id\":\"leave_types_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"leave_types_row_id\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"available_leave\":{\"column_id\":\"available_leave\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"available_leave\",\"pos_string\":\"4,2\",\"position\":{\"row_index\":4,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":234.875,\"height\":80}},\"leave_reason\":{\"column_id\":\"leave_reason\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"leave_reason\",\"pos_string\":\"6,0\",\"position\":{\"row_index\":6,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":102}}},\"custom_elements\":{},\"last_updated_at_utc\":1753511529926,\"div_main_width\":1151.19,\"display_styling_mode\":\"custom_size\"}",
                "formview_styling_config__letter_requests__create": "{\"column_structure\":{\"ce_create_title_with_caption__1753512189002\":{\"custom_element_id\":\"ce_create_title_with_caption__1753512189002\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"ce_create_title_with_caption__1753512189002\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":0,\"width\":300,\"height\":70}},\"letter_types_row_id\":{\"column_id\":\"letter_types_row_id\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"letter_types_row_id\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":350,\"height\":80}},\"urgency\":{\"column_id\":\"urgency\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"urgency\",\"pos_string\":\"2,0\",\"position\":{\"row_index\":2,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":350,\"height\":80}},\"purpose\":{\"column_id\":\"purpose\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"purpose\",\"pos_string\":\"3,0\",\"position\":{\"row_index\":3,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":600,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"4,2\",\"position\":{\"row_index\":4,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"description\":{\"column_id\":\"description\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"description\",\"pos_string\":\"5,0\",\"position\":{\"row_index\":5,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":600,\"height\":147.188}}},\"custom_elements\":{\"ce_create_title_with_caption__1753512189002\":{\"id\":\"ce_create_title_with_caption__1753512189002\",\"type\":\"title_with_caption\",\"_created_at_utc\":1753512189002,\"unique_id\":\"ce_create_title_with_caption__1753512189002\",\"config\":{\"title_text\":\"New Letter Request\",\"caption_text\":\"Please fill up the form for requesting letters\"}}},\"last_updated_at_utc\":1753514322202,\"div_main_width\":867.797,\"display_styling_mode\":\"custom_size\"}",
                "formview_styling_config__employee_documents__create": "{\"column_structure\":{\"ce_create_title_with_caption__1753931890689\":{\"custom_element_id\":\"ce_create_title_with_caption__1753931890689\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"ce_create_title_with_caption__1753931890689\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":0,\"width\":242.891,\"height\":85.375},\"customizations\":{\"background_color\":\"rgba(0, 0, 0, 0.2)\",\"margin_bottom\":50}},\"document_name\":{\"column_id\":\"document_name\",\"column_stack_style\":\"horizontal_stack_display_name_200px\",\"context_item_id\":\"document_name\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":450,\"height\":80},\"customizations\":{\"background_color\":\"rgb(233, 196, 106)\"}},\"employee_document_type_row_id\":{\"column_id\":\"employee_document_type_row_id\",\"column_stack_style\":\"horizontal_stack_display_name_200px\",\"context_item_id\":\"employee_document_type_row_id\",\"pos_string\":\"1,1\",\"position\":{\"row_index\":1,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":414.047,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"3,0\",\"position\":{\"row_index\":3,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"3,1\",\"position\":{\"row_index\":3,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"3,2\",\"position\":{\"row_index\":3,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"document\":{\"column_id\":\"document\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"document\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":325,\"height\":119.875}},\"expiry_date\":{\"column_id\":\"expiry_date\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"expiry_date\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":252.125,\"height\":80}},\"description\":{\"column_id\":\"description\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"description\",\"pos_string\":\"5,0\",\"position\":{\"row_index\":5,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":450,\"height\":174.516},\"customizations\":{\"display_name\":\"Desccc 2\",\"padding_left\":20,\"margin_top\":50,\"border_color\":\"rgba(0, 0, 0, 0.35)\",\"border_thickness\":1,\"border_radius\":10,\"background_color\":\"rgba(0, 0, 0, 0.13)\"}}},\"custom_elements\":{\"ce_create_title_with_caption__1753931890689\":{\"id\":\"ce_create_title_with_caption__1753931890689\",\"type\":\"title_with_caption\",\"_created_at_utc\":1753931890689,\"unique_id\":\"ce_create_title_with_caption__1753931890689\",\"config\":{\"title_text\":\"Upload new document\",\"caption_text\":\"Add a new document of an employee\"}}},\"last_updated_at_utc\":1753932860602,\"div_main_width\":1048,\"display_styling_mode\":\"custom_size\"}"
            },
            "userId": 1000027,
            "roleId": 1000004,
            "userName": "aki",
            "roleName": "System Admin",
            "user": "aki",
            "role": "System Admin",
            "employee_row_id": null,
            "id": 1000027,
            "sessionId": "l8wW5DDdSVEZ_E8WyJ0zs_CPQgCVIJGR"
        },
        "users": {
            "1000001": {
                "permissions": {
                    "leave_management_admin": {
                        "row_id": 1000002,
                        "unique_id": "leave_management_admin"
                    },
                    "view_all_leaves": {
                        "row_id": 1000001,
                        "unique_id": "view_all_leaves"
                    }
                },
                "settings": {
                    "customer_sales_quotation_amount_report_gridster_pc": "{\"cards\":{},\"graphs\":{},\"lists\":{\"customer_sales_quotation_amount_report\":{\"top\":5,\"left\":0,\"width\":1218.4,\"height\":310.4,\"data-row\":\"1\",\"data-col\":\"1\",\"data-sizex\":\"1\",\"data-sizey\":\"1\"}},\"reportFilters\":{\"company_name\":{\"top\":89.58749389648438,\"left\":826.7249755859375,\"width\":210.4,\"height\":49.4,\"index\":3},\"customer_name\":{\"top\":89.58749389648438,\"left\":575.125,\"width\":200.4,\"height\":49.4,\"index\":2},\"to_date\":{\"top\":91.72500610351562,\"left\":401.4000244140625,\"width\":122.4,\"height\":45.4,\"index\":1},\"from_date\":{\"top\":91.72500610351562,\"left\":227.67501831054688,\"width\":122.4,\"height\":45.4,\"index\":0}}}",
                    "sales_quotation_edit_formViewConfiguration": "{\"size\":{\"width\":1498}}",
                    "module_navigation_mode": "\"dock\"",
                    "purchase_order_create_formViewConfiguration": "{\"size\":{\"width\":1377}}",
                    "customer_profile_inlineFiltersOrder": "[\"unique_id\",\"customer_company_name\",\"whats_app_number\",\"email_id\",\"gst_number\",\"phone_number\"]",
                    "_users_edit_formViewConfiguration": "{\"size\":{\"width\":1260}}"
                },
                "roleSettings": {
                    "columnButtonFilterVisibility": "{\"purchase_order\":{\"id\":\"purchase_order\",\"subModules\":{\"purchase_order\":{\"id\":\"purchase_order\",\"columns\":{},\"buttons\":{\"submitted_for_approval\":{\"id\":\"submitted_for_approval\",\"displayName\":\"Set as Submitted For Approval\",\"isVisible\":false},\"edit\":{\"id\":\"edit\",\"displayName\":\"Edit\",\"isVisible\":false}},\"filters\":{}}}},\"sales_quotation\":{\"id\":\"sales_quotation\",\"subModules\":{\"sales_quotation\":{\"id\":\"sales_quotation\",\"columns\":{},\"buttons\":{\"submitted_for_approval\":{\"id\":\"submitted_for_approval\",\"displayName\":\"Set as Submitted For Approval\",\"isVisible\":false},\"edit\":{\"id\":\"edit\",\"displayName\":\"Edit\",\"isVisible\":false}},\"filters\":{}}}},\"packing_slip\":{\"id\":\"packing_slip\",\"subModules\":{\"packing_slip\":{\"id\":\"packing_slip\",\"columns\":{},\"buttons\":{\"generate_pdf\":{\"id\":\"generate_pdf\",\"displayName\":\"Generate Pdf\",\"isVisible\":false}},\"filters\":{}}}}}",
                    "moduleVisibility": "{\"financial_year\":{\"id\":\"financial_year\",\"displayName\":\"Financial Year\",\"isVisible\":false}}",
                    "formview_styling_config__leave_requests__create": "{\"column_structure\":{\"start_date\":{\"column_id\":\"start_date\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"start_date\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"start_half_day_type\":{\"column_id\":\"start_half_day_type\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"start_half_day_type\",\"pos_string\":\"0,1\",\"position\":{\"row_index\":0,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"end_date\":{\"column_id\":\"end_date\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"end_date\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"end_half_day_type\":{\"column_id\":\"end_half_day_type\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"end_half_day_type\",\"pos_string\":\"1,1\",\"position\":{\"row_index\":1,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"2,0\",\"position\":{\"row_index\":2,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":270.906,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"2,1\",\"position\":{\"row_index\":2,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":273.984,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"leave_types_row_id\":{\"column_id\":\"leave_types_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"leave_types_row_id\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"available_leave\":{\"column_id\":\"available_leave\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"available_leave\",\"pos_string\":\"4,2\",\"position\":{\"row_index\":4,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":234.875,\"height\":80}},\"leave_reason\":{\"column_id\":\"leave_reason\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"leave_reason\",\"pos_string\":\"6,0\",\"position\":{\"row_index\":6,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":102}}},\"custom_elements\":{},\"last_updated_at_utc\":1753511529926,\"div_main_width\":1151.19,\"display_styling_mode\":\"custom_size\"}",
                    "formview_styling_config__letter_requests__create": "{\"column_structure\":{\"ce_create_title_with_caption__1753512189002\":{\"custom_element_id\":\"ce_create_title_with_caption__1753512189002\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"ce_create_title_with_caption__1753512189002\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":0,\"width\":300,\"height\":70}},\"letter_types_row_id\":{\"column_id\":\"letter_types_row_id\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"letter_types_row_id\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":350,\"height\":80}},\"urgency\":{\"column_id\":\"urgency\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"urgency\",\"pos_string\":\"2,0\",\"position\":{\"row_index\":2,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":350,\"height\":80}},\"purpose\":{\"column_id\":\"purpose\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"purpose\",\"pos_string\":\"3,0\",\"position\":{\"row_index\":3,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":600,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"4,2\",\"position\":{\"row_index\":4,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"description\":{\"column_id\":\"description\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"description\",\"pos_string\":\"5,0\",\"position\":{\"row_index\":5,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":600,\"height\":147.188}}},\"custom_elements\":{\"ce_create_title_with_caption__1753512189002\":{\"id\":\"ce_create_title_with_caption__1753512189002\",\"type\":\"title_with_caption\",\"_created_at_utc\":1753512189002,\"unique_id\":\"ce_create_title_with_caption__1753512189002\",\"config\":{\"title_text\":\"New Letter Request\",\"caption_text\":\"Please fill up the form for requesting letters\"}}},\"last_updated_at_utc\":1753514322202,\"div_main_width\":867.797,\"display_styling_mode\":\"custom_size\"}",
                    "formview_styling_config__employee_documents__create": "{\"column_structure\":{\"ce_create_title_with_caption__1753931890689\":{\"custom_element_id\":\"ce_create_title_with_caption__1753931890689\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"ce_create_title_with_caption__1753931890689\",\"pos_string\":\"0,0\",\"position\":{\"row_index\":0,\"column_index\":0},\"size_info\":{\"min_height\":0,\"width\":242.891,\"height\":85.375},\"customizations\":{\"background_color\":\"rgba(0, 0, 0, 0.2)\",\"margin_bottom\":50}},\"document_name\":{\"column_id\":\"document_name\",\"column_stack_style\":\"horizontal_stack_display_name_200px\",\"context_item_id\":\"document_name\",\"pos_string\":\"1,0\",\"position\":{\"row_index\":1,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":450,\"height\":80},\"customizations\":{\"background_color\":\"rgb(233, 196, 106)\"}},\"employee_document_type_row_id\":{\"column_id\":\"employee_document_type_row_id\",\"column_stack_style\":\"horizontal_stack_display_name_200px\",\"context_item_id\":\"employee_document_type_row_id\",\"pos_string\":\"1,1\",\"position\":{\"row_index\":1,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":414.047,\"height\":80}},\"companies_profile_row_id\":{\"column_id\":\"companies_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"companies_profile_row_id\",\"pos_string\":\"3,0\",\"position\":{\"row_index\":3,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"department_profile_row_id\":{\"column_id\":\"department_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"department_profile_row_id\",\"pos_string\":\"3,1\",\"position\":{\"row_index\":3,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"employee_profile_row_id\":{\"column_id\":\"employee_profile_row_id\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"employee_profile_row_id\",\"pos_string\":\"3,2\",\"position\":{\"row_index\":3,\"column_index\":2},\"size_info\":{\"min_height\":80,\"width\":200,\"height\":80}},\"document\":{\"column_id\":\"document\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"document\",\"pos_string\":\"4,0\",\"position\":{\"row_index\":4,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":325,\"height\":119.875}},\"expiry_date\":{\"column_id\":\"expiry_date\",\"column_stack_style\":\"horizontal_stack_display_name_100px\",\"context_item_id\":\"expiry_date\",\"pos_string\":\"4,1\",\"position\":{\"row_index\":4,\"column_index\":1},\"size_info\":{\"min_height\":80,\"width\":252.125,\"height\":80}},\"description\":{\"column_id\":\"description\",\"column_stack_style\":\"vertical_stack_1\",\"context_item_id\":\"description\",\"pos_string\":\"5,0\",\"position\":{\"row_index\":5,\"column_index\":0},\"size_info\":{\"min_height\":80,\"width\":450,\"height\":174.516},\"customizations\":{\"display_name\":\"Desccc 2\",\"padding_left\":20,\"margin_top\":50,\"border_color\":\"rgba(0, 0, 0, 0.35)\",\"border_thickness\":1,\"border_radius\":10,\"background_color\":\"rgba(0, 0, 0, 0.13)\"}}},\"custom_elements\":{\"ce_create_title_with_caption__1753931890689\":{\"id\":\"ce_create_title_with_caption__1753931890689\",\"type\":\"title_with_caption\",\"_created_at_utc\":1753931890689,\"unique_id\":\"ce_create_title_with_caption__1753931890689\",\"config\":{\"title_text\":\"Upload new document\",\"caption_text\":\"Add a new document of an employee\"}}},\"last_updated_at_utc\":1753932860602,\"div_main_width\":1048,\"display_styling_mode\":\"custom_size\"}"
                },
                "userId": 1000027,
                "roleId": 1000004,
                "userName": "aki",
                "roleName": "System Admin",
                "user": "aki",
                "role": "System Admin",
                "employee_row_id": null,
                "id": 1000027,
                "sessionId": "l8wW5DDdSVEZ_E8WyJ0zs_CPQgCVIJGR"
            }
        }
    }

    function handle_selected_preview_item(event,invoice){
            selected_item = invoice
        let selected_element = event.target.parentElement
        selected_element.scrollIntoView({behavior: "smooth", block: "center"})
    }

    function handleEdit() {
        alert('Edit functionality would be implemented here');
    }

    function handleSend() {
        alert('Send functionality would be implemented here');
    }

    function handleShare() {
        alert('Share functionality would be implemented here');
    }

    function handlePrint() {
        window.print();
    }

    function handleRecordPayment() {
        alert('Record Payment functionality would be implemented here');
    }

    function handleMarkAsSent() {
        alert('Invoice marked as sent!');
    }

    function handleSendInvoice() {
        alert('Invoice sent successfully!');
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-GB');
    }

    function convertToWords(amount) {
        // Simple implementation - in real app, use a proper number-to-words library
        return `Indian Rupees ${Math.floor(amount).toLocaleString()} Only`;
    }
    function handle_page_change(event) {
        pagination_data.selectedPageIndex = event.detail.page;
        pagination_data = pagination_data
        // You can call your API here to fetch data for new page
    }


    export let card_view_style = 'default';  // other styles can be small_list,

    // module, submodule, columnManager, buttonManger, filterManager

    const side_cards_nav_config = {
        module : 'invoice',
        card_view_style : 'basic',
        data_mapping : {
            main_header_text : {
                column_id : "customer_profile_id"
            },
            main_caption_text_left : {
                column_id : "invoice_number"
            },
            main_caption_text_right : {
                column_id : "invoice_date"
            },
            primary_status_badge : {
                column_id : "payment_status"
            },
            primary_amount_value : {
                column_id : "total_amount"
            },
            main_detail_data_items : [
                {column_id : "due_date"}, {column_id : "balance_due"}
            ]
        }
    };

    const data_mapping = side_cards_nav_config.data_mapping;

    function get_column_instance(column_id){
        const column_obj = {
            column_id
        };

        if(column_id === 'customer_profile_id'){
            column_obj.data_type = 'lookup_dropdownlist'
        }

        if(column_id === 'invoice_date'){
            column_obj.data_type = 'date'
        }

        if(column_id === 'total_amount'){
            column_obj.data_type = 'amount'
        }


        column_obj.parseDisplayValue = (data_row) => {
            if(column_obj.data_type === 'lookup_dropdownlist'){
                return data_row[column_id]?.text;
            }
            else if(column_obj.data_type === 'date'){
                let value = data_row[column_id]?.value;
                return moment(value).format('dd MMMM YYYY');
            }
            else if(column_obj.data_type === 'amount'){
                let value = data_row[column_id]?.value;
                return formatCurrency(value);
            }
            return data_row[column_id]?.value;
        };

        return column_obj;
        // return subModule.columnManager.getColumnById(column_id);
    }

    function get_column_display_value(column_id, data_row){
        const column_instance = get_column_instance(column_id);
        let display_value = column_instance.parseDisplayValue(data_row);

        if(column_id === 'due_date'){
            display_value = dayjs(display_value).format('DD MMM YYYY')
        }
        return display_value;
    }

    function get_column_display_name(column_id){
        return column_id.toUpperCase();
    }


    function get_column_display_value_srb(column_id, employee_data_row){
        if(employee_data_row[column_id].text){
            return employee_data_row[column_id].text;
        }
        return employee_data_row[column_id].value;
    }


    let module_instances_for_reference = [];
    let module_svelte_elements_for_reference = [];
    async function add_module_instance_for_reference(module_info) {
        module_instances_for_reference.push(module_info);
        module_instances_for_reference = module_instances_for_reference;
        module_info.svelte_reference_index = module_instances_for_reference.length - 1;
        await tick();
        // await time_sleep(100);
        module_info.svelte_element_instance = module_svelte_elements_for_reference[module_info.svelte_reference_index];
        return module_info.svelte_element_instance;
    }

    let erp_instance;
    onMount(()=>{
        console.log('erp_config', erp_config)
        window.ERP = ERP;
        erp_instance = new ERP(erp_config, {user: TEMP_USER_OBJ});
        window.erp = erp_instance;
        window._add_module_instance_for_reference = add_module_instance_for_reference;
        erp_instance.initialize().then(()=>{

        });

    })
</script>


{#each module_instances_for_reference as module_info, index}
    <!--        <pre class="mineee">{module_info.id}</pre>-->
    <Module module="{module_info}"
            bind:this={module_svelte_elements_for_reference[index]}/>
{/each}



{#if api_grid_data}
    <div class="invoice_detail_container">
        <!-- Left Sidebar -->
        <div class="sidebar" class:default_style={card_view_style === 'default'}>
            <button class="back_btn">← All Invoices</button>
            <PaginationUI
                    totalRows={pagination_data.totalRows}
                    selectedPageIndex={pagination_data.selectedPageIndex}
                    pageSize={pagination_data.pageSize}
                    on:pageChange={handle_page_change}
            />
            <div class="invoice_cards_container_outer">
                {#each main_data_array as invoice}

                    <div class="invoice_summary" class:selected={selected_item.id === invoice.id} on:click={(e)=>handle_selected_preview_item(e,invoice)}>
                        <div class="customer_info">
                            <h3 class="main_header_text">{get_column_display_value(data_mapping.main_header_text.column_id, invoice)}</h3>
                            <p class="invoice_meta"> <span class="main_caption_text_left">{get_column_display_value(data_mapping.main_caption_text_left.column_id, invoice)}</span> • <span class="main_caption_text_right">{get_column_display_value(data_mapping.main_caption_text_right.column_id, invoice)}</span></p>
                            <span class="status_badge status_{get_column_display_value(data_mapping.primary_status_badge.column_id, invoice)} primary_status_badge">
                                {get_column_display_value(data_mapping.primary_status_badge.column_id, invoice)}
                            </span>
                        </div>

                        <div class="amount_display">
                            <div class="amount_large primary_amount_value">{get_column_display_value(data_mapping.primary_amount_value.column_id, invoice)}</div>
                        </div>



                        <div class="main_detail_data_items">
                            {#each data_mapping.main_detail_data_items as data_item}
                                <div class="main_detail_item">
                                    <p class="main_detail_item_display_name">{get_column_display_name(data_item.column_id)}</p>
                                    <span  class="main_detail_item_value">{get_column_display_value(data_item.column_id, invoice)}</span>
                                </div>


                            {/each}
                            <div class="amount_large primary_amount_value">{get_column_display_value(data_mapping.primary_amount_value.column_id, invoice)}</div>
                        </div>
                    </div>

                {/each}
            </div>
        </div>

        <!-- Main Content -->
        <div class="main_content">
            <!-- Action Bar -->
            <div class="action_bar">
                <div class="action_buttons">
                    <button class="action_btn" on:click={handleEdit}>
                        ✏️ Edit
                    </button>
                    <button class="action_btn dropdown_btn" on:click={handleSend}>
                        📧 Send ▼
                    </button>
                    <button class="action_btn" on:click={handleShare}>
                        📤 Share
                    </button>
                    <button class="action_btn dropdown_btn" on:click={handlePrint}>
                        📄 PDF/Print ▼
                    </button>
                    <button class="action_btn" on:click={handleRecordPayment}>
                        💳 Record Payment
                    </button>
                    <button class="more_btn">⋯</button>
                </div>
            </div>

            <!-- Next Step Banner -->
            {#if side_cards_nav_config.module === 'invoice'}
                <div class="next_step_banner">
                    <div class="banner_content">
                        <span class="star_icon">⭐</span>
                        <span class="banner_text">
                            <strong>WHAT'S NEXT?</strong> Send this invoice to your customer or mark it as Sent.
                        </span>
                        <button class="banner_btn primary" on:click={handleSendInvoice}>Send Invoice</button>
                        <button class="banner_btn secondary" on:click={handleMarkAsSent}>Mark As Sent</button>
                    </div>
                </div>
                <InvoiceUI bind:selected_item data_mapping_config = {side_cards_nav_config.data_mapping}/>
            {/if}

        </div>
    </div>
{:else}
    <div class="error_container">
        <h2>Invoice not found</h2>
        <button>← Back to invoices</button>
    </div>
{/if}

<style>
    .invoice_detail_container {
        display: flex;
        min-height: 100vh;
        background-color: #f5f5f5;
    }

    .sidebar {
        width: 360px;
        background-color: #fff;
        border-right: 1px solid #e0e0e0;
        padding: 20px;
        /*overflow-y: auto;*/
    }

    .back_btn {
        background: none;
        border: none;
        color: #4285f4;
        cursor: pointer;
        font-size: 14px;
        padding: 8px 0;
        margin-bottom: 20px;
    }

    .back_btn:hover {
        text-decoration: underline;
    }

    .invoice_summary, .other_invoices {
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        margin-bottom: 16px;
        margin-right: 8px;
        cursor: pointer;
    }
    .invoice_summary.selected {
        border: 2px solid #4285f4;

    }

    .customer_info h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
    }

    .invoice_meta {
        margin: 0 0 12px 0;
        color: #666;
        font-size: 14px;
    }

    .status_badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .status_paid {
        background-color: #e8f5e8;
        color: #2e7d32;
    }

    .status_draft {
        background-color: #f5f5f5;
        color: #666;
    }

    .amount_display {
        margin-top: 16px;
    }

    .amount_large {
        font-size: 24px;
        font-weight: 600;
        color: #333;
    }

    .main_content {
        flex: 1;
        padding: 0;
    }

    .action_bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        background-color: #fff;
        border-bottom: 1px solid #e0e0e0;
    }

    .action_buttons {
        display: flex;
        gap: 8px;
    }

    .action_btn {
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        background-color: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease;
    }

    .action_btn:hover {
        background-color: #f8f9fa;
    }

    .dropdown_btn::after {
        content: '';
    }

    .more_btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 8px;
    }

    .close_btn {
        cursor: pointer;
        font-size: 18px;
        padding: 8px;
    }

    .next_step_banner {
        background-color: #e3f2fd;
        border: 1px solid #2196f3;
        border-radius: 8px;
        margin: 24px;
        padding: 16px;
    }

    .banner_content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .star_icon {
        font-size: 16px;
    }

    .banner_text {
        flex: 1;
        font-size: 14px;
    }

    .banner_btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
    }

    .banner_btn.primary {
        background-color: #2196f3;
        color: white;
    }

    .banner_btn.secondary {
        background-color: #fff;
        color: #2196f3;
        border: 1px solid #2196f3;
    }

    .invoice_document {
        background-color: #fff;
        margin: 24px;
        padding: 40px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .invoice_header {
        display: flex;
        /*justify-content: space-between;*/
        justify-content: flex-end;
        align-items: flex-start;
        margin-bottom: 40px;
    }

    .company_info h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
    }

    .company_info p {
        margin: 4px 0;
        color: #666;
    }

    .invoice_title h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        color: #333;
    }

    .invoice_meta_section {
        margin-bottom: 30px;
    }

    .detail_row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .label {
        font-weight: 500;
        color: #666;
    }

    .value {
        font-weight: 600;
        color: #333;
    }

    .bill_to_section {
        margin-bottom: 30px;
    }

    .section_title {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .customer_name {
        margin: 0;
        font-size: 16px;
        color: #2196f3;
        font-weight: 500;
    }

    .items_section {
        margin-bottom: 30px;
    }

    .items_table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
    }

    .items_table th {
        background-color: #f8f9fa;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        border: 1px solid #e0e0e0;
    }

    .items_table td {
        padding: 12px;
        border: 1px solid #e0e0e0;
    }

    .totals_section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }

    .total_in_words {
        flex: 1;
        padding-right: 40px;
    }

    .words_label {
        font-weight: 600;
        margin-bottom: 8px;
    }

    .words_value {
        font-style: italic;
        color: #666;
    }

    .totals_table {
        min-width: 300px;
    }

    .total_row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .balance_row {
        font-weight: 600;
        font-size: 16px;
        border-bottom: 2px solid #333;
        padding: 12px 0;
    }

    .total_label {
        color: #666;
    }

    .total_value {
        font-weight: 600;
        color: #333;
    }

    .notes_section {
        margin-bottom: 30px;
    }

    .notes_label {
        font-weight: 600;
        margin-bottom: 8px;
    }

    .notes_content {
        color: #666;
    }

    .signature_section {
        text-align: right;
        margin-top: 60px;
    }

    .signature_label {
        font-weight: 600;
        color: #666;
    }

    .error_container {
        padding: 40px;
        text-align: center;
    }

    .error_container button {
        background-color: #4285f4;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 20px;
    }

    @media print {
        .sidebar, .action_bar, .next_step_banner {
            display: none;
        }

        .main_content {
            padding: 0;
        }

        .invoice_document {
            margin: 0;
            box-shadow: none;
            border: none;
        }
    }

    .invoice_cards_container_outer{
        max-height: 60vh;
        overflow-y: auto;
        padding: 10px 0;
    }

</style>