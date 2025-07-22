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
    import FinancialCardDetailed from "./financial_year_card_detailed.svelte";

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
                "value": "active"
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

    // export const card_configuration_json = [
    //     {
    //         label: "Name",
    //         column_id: "employee_name"
    //     },
    //     {
    //         label: "Designation",
    //         column_id: "employee_designation"
    //     },
    //     {
    //         label: "Email",
    //         column_id: "employee_email_id"
    //     },
    //     {
    //         label: "Department",
    //         column_id: "employee_department"
    //     }
    // ];

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
        card_view_style: "leave_minimal_card",
        data_mapping: {
            main_header_text: {
                column_id: "leave_type"
            },
            main_header_caption: {
                column_id: "unique_id"
            },
            status_badge: {
                column_id: "status"
            },
            main_detail_items: [
                {column_id: "max_days",},
                {column_id: "is_paid",},
                {column_id: "is_half_day_allowed",}
            ]
        }
    };

    const customer_card_configuration = {
        card_view_style: "customer_minimal_card",
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
        card_view_style: "financial_year_compact_card",
        data_mapping: {
            main_header_text: {
                column_id: "title"
            },
            main_header_caption: {
                column_id: "id"
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
                column_id: "duration_in_months"
            },
            status_badge: {
                column_id: "is_current_financial_year"
            }
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

    {#each user_data_json_for_financial_year_card as data_item}
        {#if financial_year_card_configuration.card_view_style === 'financial_year_minimal_card'}
            <FinancialCardMinimal data_row={data_item} config={financial_year_card_configuration} />
        {:else if financial_year_card_configuration.card_view_style === 'financial_year_compact_card'}
            <FinancialCardCompact data_row={data_item} config={financial_year_card_configuration} />
        {:else if financial_year_card_configuration.card_view_style === 'financial_year_detailed_card'}
            <FinancialCardDetailed data_row={data_item} config={financial_year_card_configuration} />
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
