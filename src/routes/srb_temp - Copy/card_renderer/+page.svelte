<script>

    import HorizontalCard from "./horizontal_card.svelte";
    import BasicCard from "./basic_card.svelte";
    import BasicDetailed from "./basic_detailed_card.svelte";
    import ClassicCard from "./classic_card.svelte";
    import ModernCard from "./modern_card.svelte";

    import LeaveCompactCard from "./leave_compact_card.svelte";
    import LeaveDetailedCard from "./leave_detailed_card.svelte";
    import LeaveMiniCard from "./leave_minimal_card.svelte";

    import CustomerDetailedCard from "./customer_detailed_card.svelte";
    import CustomerCompactCard from "./customer_compact_card.svelte";
    import CustomerMinimalCard from "./customer_minimal_card.svelte";

    import FinancialCardMinimal from "./financial_year_card_minimal.svelte";
    import FinancialCardCompact from "./financial_year_card_compact.svelte";

    import ProductProfileCardDetailed from './product_profile_card_detailed.svelte';
    import ProductProfileCardCompact from './product_profile_card_compact.svelte';

    import InvoiceDetailedCard from './invoice_detailed_card.svelte';
    import InvoiceCompactCard from './invoice_compact_card.svelte';

    import ReceiptCompactCard from './receipt_compact_card.svelte';
    import ReceiptDetailedCard from './receipt_detailed_card.svelte';

    export const user_data_json = [
        {
            "work_schedule": {
                "value": 1000002,
                "text": "Mon - Sat"
            },
            "work_schedule__text": "Mon - Sat",
            "country": {
                "value": "India"
            },
            "pin_code": {
                "value": null
            },
            "state": {
                "value": null
            },
            "city": {
                "value": null
            },
            "address": {
                "value": null
            },
            "employee_image": {
                "value": null
            },
            "years_of_service": {
                "value": null
            },
            "work_location": {
                "value": null
            },
            "hire_date": {
                "value": "2025-06-30T18:30:00.000Z"
            },
            "employment_type_row_id": {
                "value": 1000001,
                "text": "Apprentice / Trainee"
            },
            "employment_type_row_id__text": "Apprentice / Trainee",
            "nationality": {
                "value": "Indian"
            },
            "registered_email_id": {
                "value": "akhil.k.sekharan@gmail.com"
            },
            "staff_number": {
                "value": "101"
            },
            "phone_number": {
                "value": "8086800848"
            },
            "unique_id": {
                "value": "250718_BAIVARUO"
            },
            "leave_balance": {
                "value": 0
            },
            "contacts": {
                "value": 0
            },
            "companies_profile_row_id": {
                "value": 1000001,
                "text": "PixelRoot Innovations"
            },
            "companies_profile_row_id__text": "PixelRoot Innovations",
            "designation_profile_row_id": {
                "value": 1000001,
                "text": "Content Strategist"
            },
            "designation_profile_row_id__text": "Content Strategist",
            "department_profile_row_id": {
                "value": 1000009,
                "text": "Cybersecurity"
            },
            "department_profile_row_id__text": "Cybersecurity",
            "status": {
                "value": "inactive"
            },
            "remarks": {
                "value": null
            },
            "lastName": {
                "value": "Sekharan"
            },
            "id": 1000020,
            "gender": {
                "value": "male"
            },
            "fullName": {
                "value": "Akhil Sekharan"
            },
            "firstName": {
                "value": "Akhil"
            },
            "dob": {
                "value": "2025-07-19T18:30:00.000Z"
            },
            "_creation_date": "2025-07-17T18:30:00.000Z",
            "_creation_time": "1970-01-01T04:05:30.837Z",
            "_created_at_timestamp_in_utc": "1752811530830",
            "_creator": 1000001,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null
        },
        {
            "work_schedule": {
                "value": 1000003,
                "text": "All Day"
            },
            "work_schedule__text": "All Day",
            "country": {
                "value": null
            },
            "pin_code": {
                "value": null
            },
            "state": {
                "value": null
            },
            "city": {
                "value": null
            },
            "address": {
                "value": null
            },
            "employee_image": {
                "value": null
            },
            "years_of_service": {
                "value": 1
            },
            "work_location": {
                "value": "Remote"
            },
            "hire_date": {
                "value": "2024-01-09T18:30:00.000Z"
            },
            "employment_type_row_id": {
                "value": 1000003,
                "text": "Freelancer / Consultant"
            },
            "employment_type_row_id__text": "Freelancer / Consultant",
            "nationality": {
                "value": "Indian"
            },
            "registered_email_id": {
                "value": "nikhil.joshi@nextgen.com"
            },
            "staff_number": {
                "value": "NGI-EMP-004"
            },
            "phone_number": {
                "value": null
            },
            "unique_id": {
                "value": "250718_PNGCQIMQ"
            },
            "leave_balance": {
                "value": 3
            },
            "contacts": {
                "value": 0
            },
            "companies_profile_row_id": {
                "value": 1000005,
                "text": "NextGen Innovations"
            },
            "companies_profile_row_id__text": "NextGen Innovations",
            "designation_profile_row_id": {
                "value": 1000009,
                "text": "Cybersecurity Analyst"
            },
            "designation_profile_row_id__text": "Cybersecurity Analyst",
            "department_profile_row_id": {
                "value": 1000009,
                "text": "Cybersecurity"
            },
            "department_profile_row_id__text": "Cybersecurity",
            "status": {
                "value": "active"
            },
            "remarks": {
                "value": "Provides vulnerability assessment services"
            },
            "lastName": {
                "value": "Joshi"
            },
            "id": 1000022,
            "gender": {
                "value": "male"
            },
            "fullName": {
                "value": "Nikhil  Joshi"
            },
            "firstName": {
                "value": "Nikhil "
            },
            "dob": {
                "value": "1990-02-26T18:30:00.000Z"
            },
            "_creation_date": "2025-07-17T18:30:00.000Z",
            "_creation_time": "1970-01-01T09:43:45.997Z",
            "_created_at_timestamp_in_utc": "1752831825992",
            "_creator": 1000034,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null
        },
        {
            "work_schedule": {
                "value": 1000002,
                "text": "Mon - Sat"
            },
            "work_schedule__text": "Mon - Sat",
            "country": {
                "value": null
            },
            "pin_code": {
                "value": null
            },
            "state": {
                "value": null
            },
            "city": {
                "value": null
            },
            "address": {
                "value": null
            },
            "employee_image": {
                "value": null
            },
            "years_of_service": {
                "value": 0.5
            },
            "work_location": {
                "value": null
            },
            "hire_date": {
                "value": "2025-07-17T18:30:00.000Z"
            },
            "employment_type_row_id": {
                "value": 1000005,
                "text": "Part-Time Employee"
            },
            "employment_type_row_id__text": "Part-Time Employee",
            "nationality": {
                "value": "indian"
            },
            "registered_email_id": {
                "value": "amal1@gmail.com"
            },
            "staff_number": {
                "value": "1010"
            },
            "phone_number": {
                "value": "7736190220"
            },
            "unique_id": {
                "value": "250718_EQAWPOEJ"
            },
            "leave_balance": {
                "value": 2
            },
            "contacts": {
                "value": 0
            },
            "companies_profile_row_id": {
                "value": 1000005,
                "text": "NextGen Innovations"
            },
            "companies_profile_row_id__text": "NextGen Innovations",
            "designation_profile_row_id": {
                "value": 1000003,
                "text": "Systems Administrator"
            },
            "designation_profile_row_id__text": "Systems Administrator",
            "department_profile_row_id": {
                "value": 1000011,
                "text": "Information Technology"
            },
            "department_profile_row_id__text": "Information Technology",
            "status": {
                "value": "active"
            },
            "remarks": {
                "value": null
            },
            "lastName": {
                "value": null
            },
            "id": 1000026,
            "gender": {
                "value": "male"
            },
            "fullName": {
                "value": "Amal "
            },
            "firstName": {
                "value": "Amal"
            },
            "dob": {
                "value": "1999-09-19T18:30:00.000Z"
            },
            "_creation_date": "2025-07-17T18:30:00.000Z",
            "_creation_time": "1970-01-01T12:38:48.897Z",
            "_created_at_timestamp_in_utc": "1752842328885",
            "_creator": 1000034,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null
        }

    ];

    export const user_data_json_for_leave_card = [
        {
            "is_default": {
                "value": false
            },
            "unique_id": {
                "value": "250717_PIUSMJPB"
            },
            "status": {
                "value": "active"
            },
            "is_paid": {
                "value": true
            },
            "is_half_day_allowed": {
                "value": false
            },
            "max_days": {
                "value": 5
            },
            "leave_type": {
                "value": "Marriage Leave"
            },
            "id": 1000016,
            "_creation_date": "2025-07-16T18:30:00.000Z",
            "_creation_time": "1970-01-01T10:48:39.910Z",
            "_created_at_timestamp_in_utc": "1752749319909",
            "_creator": 1000034,
            "_last_edited_date": "2025-07-17T18:30:00.000Z",
            "_last_edited_time": "1970-01-01T09:58:15.823Z",
            "_last_edited_at_timestamp_in_utc": "1752832695816",
            "_last_edited_by": 1000034
        },
        {
            "is_default": {
                "value": false
            },
            "unique_id": {
                "value": "250630_JVWOJPBP"
            },
            "status": {
                "value": "active"
            },
            "is_paid": {
                "value": false
            },
            "is_half_day_allowed": {
                "value": true
            },
            "max_days": {
                "value": 30
            },
            "leave_type": {
                "value": "Earned Leave"
            },
            "id": 1000012,
            "_creation_date": "2025-06-24T18:30:00.000Z",
            "_creation_time": "1970-01-01T06:50:01.560Z",
            "_created_at_timestamp_in_utc": "1750834201557",
            "_creator": 1000002,
            "_last_edited_date": "2025-07-20T18:30:00.000Z",
            "_last_edited_time": "1970-01-01T11:51:29.760Z",
            "_last_edited_at_timestamp_in_utc": "1753098689757",
            "_last_edited_by": 1000034
        },
        {
            "is_default": {
                "value": false
            },
            "unique_id": {
                "value": "250630_NTAIDPNT"
            },
            "status": {
                "value": "inactive"
            },
            "is_paid": {
                "value": false
            },
            "is_half_day_allowed": {
                "value": false
            },
            "max_days": {
                "value": 5
            },
            "leave_type": {
                "value": "Bereavement Leave"
            },
            "id": 1000007,
            "_creation_date": null,
            "_creation_time": null,
            "_created_at_timestamp_in_utc": null,
            "_creator": null,
            "_last_edited_date": "2025-06-29T18:30:00.000Z",
            "_last_edited_time": "1970-01-01T04:30:20.837Z",
            "_last_edited_at_timestamp_in_utc": "1751257820835",
            "_last_edited_by": 1000002
        }
    ]

    export const user_data_json_for_customer_card = [
        {
            "id": 1000007,
            "customer_name": {
                "value": "Test Customer"
            },
            "customer_type": {
                "value": "Individual"
            },
            "email": {
                "value": null
            },
            "address": {
                "value": 0
            },
            "phone_number": {
                "value": "4587485965"
            },
            "remarks": {
                "value": null
            },
            "tax_registration_number": {
                "value": null
            },
            "contact_person_name": {
                "value": null
            },
            "contact_person_number": {
                "value": null
            },
            "_creation_date": "2025-04-09T18:30:00.000Z",
            "_creation_time": "1970-01-01T06:38:27.756Z",
            "_created_at_timestamp_in_utc": "1744267107756",
            "_creator": 1000003,
            "_last_edited_date": "2025-06-19T18:30:00.000Z",
            "_last_edited_time": "1970-01-01T10:18:56.750Z",
            "_last_edited_at_timestamp_in_utc": "1750414736750",
            "_last_edited_by": 1000003
        },

        {
            "id": 1000003,
            "customer_name": {
                "value": "Jordan"
            },
            "customer_type": {
                "value": "Company"
            },
            "email": {
                "value": "jordan@gmail.com"
            },
            "address": {
                "value": 1
            },
            "phone_number": {
                "value": "4785985748"
            },
            "remarks": {
                "value": null
            },
            "tax_registration_number": {
                "value": null
            },
            "contact_person_name": {
                "value": null
            },
            "contact_person_number": {
                "value": null
            },
            "_creation_date": "2024-06-13T18:30:00.000Z",
            "_creation_time": "1970-01-01T06:28:36.543Z",
            "_created_at_timestamp_in_utc": "1718346516539",
            "_creator": 1000003,
            "_last_edited_date": "2024-06-24T18:30:00.000Z",
            "_last_edited_time": "1970-01-01T05:22:13.906Z",
            "_last_edited_at_timestamp_in_utc": "1719292933897",
            "_last_edited_by": 1000001
        },
        {
            "id": 1000001,
            "customer_name": {
                "value": "John"
            },
            "customer_type": {
                "value": "Company"
            },
            "email": {
                "value": "john@gmail.com"
            },
            "address": {
                "value": 1
            },
            "phone_number": {
                "value": "9527887896"
            },
            "remarks": {
                "value": null
            },
            "tax_registration_number": {
                "value": null
            },
            "contact_person_name": {
                "value": null
            },
            "contact_person_number": {
                "value": null
            },
            "_creation_date": "2024-06-13T18:30:00.000Z",
            "_creation_time": "1970-01-01T06:27:26.360Z",
            "_created_at_timestamp_in_utc": "1718346446360",
            "_creator": 1000003,
            "_last_edited_date": "2025-06-24T18:30:00.000Z",
            "_last_edited_time": "1970-01-01T08:40:47.020Z",
            "_last_edited_at_timestamp_in_utc": "1750840847006",
            "_last_edited_by": 1000001
        }
    ]

    export const user_data_json_for_financial_year_card = [
        {
            "id": 1000003,
            "start_date": {
                "value": "2026-03-31T18:30:00.000Z"
            },
            "end_date": {
                "value": "2027-03-30T18:30:00.000Z"
            },
            "title": {
                "value": "2026-2027"
            },
            "_creation_date": "2025-04-21T18:30:00.000Z",
            "_creation_time": "1970-01-01T06:53:31.656Z",
            "_created_at_timestamp_in_utc": "1745304811653",
            "_creator": 1000001,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null
        },{
            "id": 1000001,
            "start_date": {
                "value": "2024-03-31T18:30:00.000Z"
            },
            "end_date": {
                "value": "2025-03-30T18:30:00.000Z"
            },
            "title": {
                "value": "2024 - 2025"
            },
            "_creation_date": "2024-06-13T18:30:00.000Z",
            "_creation_time": "1970-01-01T07:26:05.906Z",
            "_created_at_timestamp_in_utc": "1718349965904",
            "_creator": 1000002,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null
        }
    ]

    export const product_profile_card_json = [
        {
            "id": 1000021,
            "product_name": {
                "value": "tttt 1"
            },
            "hsn_code": {
                "value": "45874"
            },
            "sales_tax": {
                "value": 1000010,
                "text": "0% Vat"
            },
            "sales_tax__text": "0% Vat",
            "purchase_tax": {
                "value": 1000011,
                "text": "0% Vat"
            },
            "purchase_tax__text": "0% Vat",
            "product_category_id": {
                "value": 1000002,
                "text": "Home Essentials"
            },
            "product_category_id__text": "Home Essentials",
            "available_quantity": {
                "value": 0
            },
            "mrp": {
                "value": 20
            },
            "sale_price": {
                "value": 16
            },
            "sac_code": {
                "value": null
            },
            "remarks": {
                "value": null
            },
            "image": {
                "value": null
            },
            "unit_of_measurement_id": {
                "value": 1000001,
                "text": "Nos"
            },
            "unit_of_measurement_id__text": "Nos",
            "product_type_id": {
                "value": null,
                "text": null
            },
            "product_type_id__text": null,
            "sales_account_row_id": {
                "value": null,
                "text": null
            },
            "sales_account_row_id__text": null,
            "purchase_account_row_id": {
                "value": null,
                "text": null
            },
            "purchase_account_row_id__text": null,
            "_creation_date": "2024-07-02T18:30:00.000Z",
            "_creation_time": "1970-01-01T11:04:04.073Z",
            "_created_at_timestamp_in_utc": "1720004644065",
            "_creator": 1000001,
            "_last_edited_date": "2025-04-10T18:30:00.000Z",
            "_last_edited_time": "1970-01-01T05:22:20.643Z",
            "_last_edited_at_timestamp_in_utc": "1744348940639",
            "_last_edited_by": 1000003
        },
        {
            "id": 1000022,
            "product_name": {
                "value": "Test Service 1"
            },
            "hsn_code": {
                "value": "72.02. 99.11"
            },
            "sales_tax": {
                "value": 1000014,
                "text": "0% VAT "
            },
            "sales_tax__text": "0% VAT ",
            "purchase_tax": {
                "value": 1000012,
                "text": "0% VAT"
            },
            "purchase_tax__text": "0% VAT",
            "product_category_id": {
                "value": 1000008,
                "text": "Test Service Category"
            },
            "product_category_id__text": "Test Service Category",
            "available_quantity": {
                "value": 1
            },
            "mrp": {
                "value": 150
            },
            "sale_price": {
                "value": 120
            },
            "sac_code": {
                "value": null
            },
            "remarks": {
                "value": null
            },
            "image": {
                "value": null
            },
            "unit_of_measurement_id": {
                "value": 1000001,
                "text": "Nos"
            },
            "unit_of_measurement_id__text": "Nos",
            "product_type_id": {
                "value": null,
                "text": null
            },
            "product_type_id__text": null,
            "sales_account_row_id": {
                "value": null,
                "text": null
            },
            "sales_account_row_id__text": null,
            "purchase_account_row_id": {
                "value": null,
                "text": null
            },
            "purchase_account_row_id__text": null,
            "_creation_date": "2025-04-10T18:30:00.000Z",
            "_creation_time": "1970-01-01T05:21:58.183Z",
            "_created_at_timestamp_in_utc": "1744348918180",
            "_creator": 1000003,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null
        },{
            "id": 1000019,
            "product_name": {
                "value": "Test Product"
            },
            "hsn_code": {
                "value": "2356"
            },
            "sales_tax": {
                "value": 1000003,
                "text": "10% VAT"
            },
            "sales_tax__text": "10% VAT",
            "purchase_tax": {
                "value": 1000004,
                "text": "10% VAT"
            },
            "purchase_tax__text": "10% VAT",
            "product_category_id": {
                "value": 1000006,
                "text": "Test Category"
            },
            "product_category_id__text": "Test Category",
            "available_quantity": {
                "value": 2
            },
            "mrp": {
                "value": 1000
            },
            "sale_price": {
                "value": 800
            },
            "sac_code": {
                "value": null
            },
            "remarks": {
                "value": null
            },
            "image": {
                "value": null
            },
            "unit_of_measurement_id": {
                "value": null,
                "text": null
            },
            "unit_of_measurement_id__text": null,
            "product_type_id": {
                "value": null,
                "text": null
            },
            "product_type_id__text": null,
            "sales_account_row_id": {
                "value": null,
                "text": null
            },
            "sales_account_row_id__text": null,
            "purchase_account_row_id": {
                "value": null,
                "text": null
            },
            "purchase_account_row_id__text": null,
            "_creation_date": "2024-07-02T18:30:00.000Z",
            "_creation_time": "1970-01-01T10:56:04.720Z",
            "_created_at_timestamp_in_utc": "1720004164713",
            "_creator": 1000002,
            "_last_edited_date": "2025-04-10T18:30:00.000Z",
            "_last_edited_time": "1970-01-01T05:23:20.433Z",
            "_last_edited_at_timestamp_in_utc": "1744349000431",
            "_last_edited_by": 1000003
        }
    ]

    export const invoice_card_json = [
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
        },{
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
        },{
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
    ]

    export const receipt_card_json = [
        {
            "id": 1000238,
            "customer_profile_id": {
                "value": 1000005,
                "text": "Silpa"
            },
            "customer_profile_id__text": "Silpa",
            "payment_mode": {
                "value": "bank"
            },
            "voucher_number": {
                "value": "PR11"
            },
            "particulars": {
                "value": null
            },
            "transaction_date": {
                "value": "2024-05-28T18:30:00.000Z"
            },
            "remarks": {
                "value": null
            },
            "bank_profile_id": {
                "value": 1000003,
                "text": "AXIS"
            },
            "bank_profile_id__text": "AXIS",
            "payment_amount": {
                "value": 3960
            },
            "payment_type": {
                "value": "sales_income"
            },
            "invoice_id": {
                "value": 1000068,
                "text": "IN5"
            },
            "invoice_id__text": "IN5",
            "additional_income_profile_id": {
                "value": null,
                "text": null
            },
            "additional_income_profile_id__text": null,
            "purchase_debit_note_id": {
                "value": null,
                "text": null
            },
            "purchase_debit_note_id__text": null,
            "record_type": {
                "value": "payment"
            },
            "transaction_number_prefix": {
                "value": "PR"
            },
            "transaction_record_number": {
                "value": 11
            },
            "transaction_number_suffix": {
                "value": ""
            },
            "project_profile_id": {
                "value": null,
                "text": null
            },
            "project_profile_id__text": null,
            "transaction_number_series_id": {
                "value": 1000007,
                "text": 1000007
            },
            "transaction_number_series_id__text": 1000007,
            "redirect_from": {
                "value": "direct_create"
            },
            "_creation_date": "2025-06-11T18:30:00.000Z",
            "_creation_time": "1970-01-01T10:34:20.070Z",
            "_created_at_timestamp_in_utc": "1749724460035",
            "_creator": 1000003,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null,
            "balance_due": {},
            "purchase_debit_note_amount": {}
        },{
            "id": 1000237,
            "customer_profile_id": {
                "value": 1000002,
                "text": "Sarath"
            },
            "customer_profile_id__text": "Sarath",
            "payment_mode": {
                "value": "cash"
            },
            "voucher_number": {
                "value": "PR10"
            },
            "particulars": {
                "value": null
            },
            "transaction_date": {
                "value": "2024-05-27T18:30:00.000Z"
            },
            "remarks": {
                "value": null
            },
            "bank_profile_id": {
                "value": 1000001,
                "text": "Cash"
            },
            "bank_profile_id__text": "Cash",
            "payment_amount": {
                "value": 5775
            },
            "payment_type": {
                "value": "sales_income"
            },
            "invoice_id": {
                "value": 1000067,
                "text": "IN4"
            },
            "invoice_id__text": "IN4",
            "additional_income_profile_id": {
                "value": null,
                "text": null
            },
            "additional_income_profile_id__text": null,
            "purchase_debit_note_id": {
                "value": null,
                "text": null
            },
            "purchase_debit_note_id__text": null,
            "record_type": {
                "value": "payment"
            },
            "transaction_number_prefix": {
                "value": "PR"
            },
            "transaction_record_number": {
                "value": 10
            },
            "transaction_number_suffix": {
                "value": ""
            },
            "project_profile_id": {
                "value": null,
                "text": null
            },
            "project_profile_id__text": null,
            "transaction_number_series_id": {
                "value": 1000007,
                "text": 1000007
            },
            "transaction_number_series_id__text": 1000007,
            "redirect_from": {
                "value": "direct_create"
            },
            "_creation_date": "2025-06-11T18:30:00.000Z",
            "_creation_time": "1970-01-01T10:33:48.756Z",
            "_created_at_timestamp_in_utc": "1749724428723",
            "_creator": 1000003,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null,
            "balance_due": {},
            "purchase_debit_note_amount": {}
        },
        {
            "id": 1000236,
            "customer_profile_id": {
                "value": 1000002,
                "text": "Sarath"
            },
            "customer_profile_id__text": "Sarath",
            "payment_mode": {
                "value": "bank"
            },
            "voucher_number": {
                "value": "PR9"
            },
            "particulars": {
                "value": null
            },
            "transaction_date": {
                "value": "2024-05-26T18:30:00.000Z"
            },
            "remarks": {
                "value": null
            },
            "bank_profile_id": {
                "value": 1000002,
                "text": "ICICI"
            },
            "bank_profile_id__text": "ICICI",
            "payment_amount": {
                "value": 3327
            },
            "payment_type": {
                "value": "sales_income"
            },
            "invoice_id": {
                "value": 1000065,
                "text": "IN2"
            },
            "invoice_id__text": "IN2",
            "additional_income_profile_id": {
                "value": null,
                "text": null
            },
            "additional_income_profile_id__text": null,
            "purchase_debit_note_id": {
                "value": null,
                "text": null
            },
            "purchase_debit_note_id__text": null,
            "record_type": {
                "value": "payment"
            },
            "transaction_number_prefix": {
                "value": "PR"
            },
            "transaction_record_number": {
                "value": 9
            },
            "transaction_number_suffix": {
                "value": ""
            },
            "project_profile_id": {
                "value": null,
                "text": null
            },
            "project_profile_id__text": null,
            "transaction_number_series_id": {
                "value": 1000007,
                "text": 1000007
            },
            "transaction_number_series_id__text": 1000007,
            "redirect_from": {
                "value": "direct_create"
            },
            "_creation_date": "2025-06-11T18:30:00.000Z",
            "_creation_time": "1970-01-01T10:32:52.836Z",
            "_created_at_timestamp_in_utc": "1749724372803",
            "_creator": 1000003,
            "_last_edited_date": null,
            "_last_edited_time": null,
            "_last_edited_at_timestamp_in_utc": null,
            "_last_edited_by": null,
            "balance_due": {},
            "purchase_debit_note_amount": {}
        }
    ]


    const employee_card_configuration = {
        card_view_style : 'modern_card',
        data_mapping : {
            main_header_text : {
                column_id : "fullName"
            },
            main_header_caption : {
                column_id : "designation_profile_row_id"
            },
            main_detail_items : [
                {column_id : "nationality"},
                {column_id : "phone_number"},
                {column_id : "registered_email_id"}
            ]
        }
    };

    const leave_management_card_configuration = {
        card_view_style: "leave_detailed_card",
        data_mapping: {
            main_header_text: {
                column_id: "leave_type"
            },
            main_header_caption: {
                column_id: "unique_id"
            },
            status_badge: {
                column_id: "status",
                condition_color_settings : {
                    is_enabled: true,
                    rules : [
                        {
                            "condition": "equals",
                            "condition_value": "active",
                            "style": "green",
                        },
                        {
                            "condition": "equals",
                            "condition_value": "inactive",
                            "style": "red",
                        }
                    ]
                }
            },
            main_detail_items: [
                {column_id: "max_days",},
                {column_id: "is_paid",},
                {column_id: "is_half_day_allowed",}
            ]
        }
    };

    const customer_card_configuration = {
        card_view_style: "customer_detailed_card",
        data_mapping: {
            main_header_text: {
                column_id: "customer_name"
            },
            main_header_caption: {
                column_id: "customer_type"
            },
            id_badge: {
                column_id: "id",
            },
            contact_info_items: [
                {
                    column_id: "email",
                },
                {
                    column_id: "phone_number",
                }
            ],
            address_field: {
                column_id: "address"
            }
        }
    };


    const financial_year_card_configuration = {
        card_view_style: "financial_year_detailed_card",
        data_mapping: {
            main_header_text: {
                column_id: "title"
            },
            date_range: {
                start: {
                    column_id: "start_date"
                },
                end: {
                    column_id: "end_date"
                }
            },
            duration_display: {
                calculated_field: "duration_in_months"
            },
            status_badge: {
                condition: "is_current_financial_year"
            }
        }
    };

    const product_card_configuration = {
        card_view_style: "product_profile_card_detailed",
        data_mapping: {
            main_header_text: {
                column_id: "product_name"
            },
            main_header_caption: {
                column_id: "hsn_code"
            },
            caption: {
                column_id: "product_category_id"
            },
            stock_badge: {
                column_id: "available_quantity"
            },
            main_detail_items: [
                { column_id: "mrp" },
                { column_id: "sale_price" },
                { column_id: "sales_tax" },
                { column_id: "purchase_tax" }
            ]
        }
    };

    const invoice_card_configuration = {
        card_view_style: "invoice_card_detailed",
        data_mapping: {
            main_header_text: {
                column_id: "invoice_number"
            },
            main_header_caption: {
                column_id: "customer_profile_id"
            },
            caption: {
                column_id: "invoice_date"
            },
            invoice_status: {
                column_id: "invoice_status"
            },
            payment_status: {
                column_id: "payment_status"
            },
            main_detail_items: [
                { column_id: "amount_excluding_tax" },
                { column_id: "total_amount" },
                { column_id: "balance_due" },
                { column_id: "due_date" },
                { column_id: "invoice_items" }
            ]
        }
    };

    const payment_card_configuration = {
        card_view_style: "payment_receipt_card_detailed",
        data_mapping: {
            main_header_text: {
                column_id: "voucher_number"
            },
            main_header_caption: {
                column_id: "customer_profile_id"
            },
            payment_mode_badge: {
                column_id: "payment_mode"
            },
            payment_amount_details: {
                column_id: "payment_amount"
            },
            main_detail_items: [
                { column_id: "customer_profile_id" },
                { column_id: "transaction_date" },
                { column_id: "payment_amount" }
            ],
            additional_detail_items: [
                { column_id: "invoice_id" },
                { column_id: "bank_profile_id" },
                { column_id: "payment_type" }
            ]
        }
    };

</script>

<div class="card_list">

    <!--{#each user_data_json as data_item}-->
    <!--    {#if employee_card_configuration.card_view_style === 'basic'}-->
    <!--        <BasicCard data_row={data_item} config={employee_card_configuration} />-->
    <!--    {:else if employee_card_configuration.card_view_style === 'basic_detailed'}-->
    <!--        <BasicDetailed data_row={data_item} config={employee_card_configuration} />-->
    <!--    {:else if employee_card_configuration.card_view_style === 'classic_card'}-->
    <!--        <ClassicCard data_row={data_item} config={employee_card_configuration} />-->
    <!--    {:else if employee_card_configuration.card_view_style === 'modern_card'}-->
    <!--        <ModernCard data_row={data_item} config={employee_card_configuration} />-->
    <!--    {:else if employee_card_configuration.card_view_style === 'nationality'}-->
    <!--        <HorizontalCard data_row={data_item} config={employee_card_configuration} />-->
    <!--    {/if}-->
    <!--{/each}-->

    <!--{#each user_data_json_for_leave_card as data_item}-->
    <!--    {#if leave_management_card_configuration.card_view_style === 'leave_compact_card'}-->
    <!--        <LeaveCompactCard data_row={data_item} config={leave_management_card_configuration} />-->
    <!--    {:else if leave_management_card_configuration.card_view_style === 'leave_detailed_card'}-->
    <!--        <LeaveDetailedCard data_row={data_item} config={leave_management_card_configuration} />-->
    <!--    {:else if leave_management_card_configuration.card_view_style === 'leave_minimal_card'}-->
    <!--        <LeaveMiniCard data_row={data_item} config={leave_management_card_configuration} />-->
    <!--    {/if}-->
    <!--{/each}-->

    <!--{#each user_data_json_for_customer_card as data_item}-->
    <!--    {#if customer_card_configuration.card_view_style === 'customer_compact_card'}-->
    <!--        <CustomerCompactCard data_row={data_item} config={customer_card_configuration} />-->
    <!--    {:else if customer_card_configuration.card_view_style === 'customer_detailed_card'}-->
    <!--        <CustomerDetailedCard data_row={data_item} config={customer_card_configuration} />-->
    <!--    {:else if customer_card_configuration.card_view_style === 'customer_minimal_card'}-->
    <!--        <CustomerMinimalCard data_row={data_item} config={customer_card_configuration} />-->
    <!--    {/if}-->
    <!--{/each}-->

    <!--{#each user_data_json_for_financial_year_card as data_item}-->
    <!--    {#if financial_year_card_configuration.card_view_style === 'financial_year_minimal_card'}-->
    <!--        <FinancialCardMinimal data_row={data_item} config={financial_year_card_configuration} />-->
    <!--    {:else if financial_year_card_configuration.card_view_style === 'financial_year_compact_card'}-->
    <!--        <FinancialCardCompact data_row={data_item} config={financial_year_card_configuration} />-->
    <!--    {/if}-->
    <!--{/each}-->

    <!--{#each product_profile_card_json as data_item}-->
    <!--    {#if product_card_configuration.card_view_style === 'product_profile_card_compact'}-->
    <!--        <ProductProfileCardCompact data_row={data_item} config={product_card_configuration} />-->
    <!--    {:else if product_card_configuration.card_view_style === 'product_profile_card_detailed'}-->
    <!--        <ProductProfileCardDetailed data_row={data_item} config={product_card_configuration} />-->
    <!--    {/if}-->
    <!--{/each}-->

    <!--{#each invoice_card_json as data_item}-->
    <!--    {#if invoice_card_configuration.card_view_style === 'invoice_card_compact'}-->
    <!--        <InvoiceCompactCard data_row={data_item} config={invoice_card_configuration} />-->
    <!--    {:else if invoice_card_configuration.card_view_style === 'invoice_card_detailed'}-->
    <!--        <InvoiceDetailedCard data_row={data_item} config={invoice_card_configuration} />-->
    <!--    {/if}-->
    <!--{/each}-->

    {#each receipt_card_json as data_item}
        {#if payment_card_configuration.card_view_style === 'payment_receipt_card_compact'}
            <ReceiptCompactCard data_row={data_item} config={payment_card_configuration} />
        {:else if payment_card_configuration.card_view_style === 'payment_receipt_card_detailed'}
            <ReceiptDetailedCard data_row={data_item} config={payment_card_configuration} />
        {/if}
    {/each}

</div>

<style>
    .card_list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
</style>
