<script>
    import dayjs from "dayjs";

    export let submodule;
    export let data_row;
    export let config = {};

    export let data_mapping = {
        main_header_text : "fullName",
        main_header_caption : "designation_profile_row_id",
        main_detail_items : [
            {item_value : "nationality" ,item_text: ""},
            {item_value : "phone_number" ,item_text: ""},
            {item_value : "registered_email_id" ,item_text: ""}
        ]
    };


    function get_column_display_value(column_id){
        // const column_instance = get_column_instance(column_id);
        // let display_value = column_instance.parseDisplayValue(data_row);

        // if(column_id === 'due_date'){
        //     display_value = dayjs(display_value).format('DD MMM YYYY')
        // }
        // return display_value;

        return data_row[column_id]?.text || data_row[column_id]?.value;
    }


    function get_column_display_name(column_id){
        return column_id?.toUpperCase() || '-';
    }
</script>

<div class="card_classic">
    <div class="card_stripe"></div>
    <div class="card_header">
        <img
                src="/card_renderer/user_2.jpg"
                alt="Jane Smith"
                class="profile_photo"/>
        <div class="header_text">
            <h3 class="card_title">{get_column_display_value(data_mapping.main_header_text)}</h3>
            <p class="card_subtitle">{get_column_display_value(data_mapping.main_header_caption)}</p>
<!--            <div class="status_wrapper">-->
<!--                <span class="status_label">Status:</span>-->
<!--                <span class="status_value status_active">active</span>-->
<!--            </div>-->
        </div>
    </div>

    <div class="details_section">
        <table class="info_table">
            <tbody>
            {#each data_mapping.main_detail_items as item}
                <tr class="table_row">
                    <td class="label_cell">{get_column_display_name(item.item_text)}:</td>
                    <td class="value_cell">{get_column_display_value(item.item_value)}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .card_classic {
        background: #ffffff;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 20px;
        overflow: hidden;
        transition: all 0.3s ease;
        position: relative;
        font-family: 'Georgia', serif;
    }

    .card_stripe {
        height: 6px;
        background: linear-gradient(90deg, #2b6cb0 0%, #3182ce 50%, #4299e1 100%);
    }

    .card_classic:hover {
        border-color: #cbd5e0;
        box-shadow: 0 8px 25px rgba(43, 108, 176, 0.15);
        transform: translateY(-2px);
    }

    .card_header {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 20px 24px 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
    }

    .profile_photo {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
        border: 3px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    .card_classic:hover .profile_photo {
        transform: scale(1.05);
    }

    .header_text {
        flex: 1;
        padding-top: 4px;
    }

    .card_title {
        margin: 0 0 6px 0;
        font-size: 22px;
        font-weight: 700;
        color: #2d3748;
        line-height: 1.2;
    }

    .card_subtitle {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: #4a5568;
        font-style: italic;
        font-weight: 500;
    }

    .status_wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .status_label {
        font-size: 14px;
        color: #718096;
        font-weight: 600;
    }

    .status_value {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 600;
        text-transform: capitalize;
    }

    .status_active {
        background: #c6f6d5;
        color: #22543d;
        border: 1px solid #9ae6b4;
    }

    .status_inactive {
        background: #fed7d7;
        color: #742a2a;
        border: 1px solid #feb2b2;
    }

    .status_on_leave {
        background: #feebc8;
        color: #7b341e;
        border: 1px solid #f6ad55;
    }

    .details_section {
        padding: 20px 24px 24px;
    }

    .info_table {
        width: 100%;
        border-collapse: collapse;
    }

    .table_row {
        transition: background-color 0.2s ease;
    }

    .table_row:hover {
        background: #f7fafc;
    }

    .salary_highlight {
        background: #edf2f7;
    }

    .salary_highlight:hover {
        background: #e2e8f0;
    }

    .label_cell {
        padding: 12px 16px 12px 0;
        font-size: 14px;
        color: #4a5568;
        font-weight: 600;
        vertical-align: top;
        width: 140px;
        border-bottom: 1px solid #f1f5f9;
    }

    .value_cell {
        padding: 12px 0;
        font-size: 14px;
        color: #2d3748;
        font-weight: 500;
        border-bottom: 1px solid #f1f5f9;
    }

    .table_row:last-child .label_cell,
    .table_row:last-child .value_cell {
        border-bottom: none;
    }

    .email_value {
        color: #3182ce;
        text-decoration: underline;
    }

    .salary_value {
        color: #38a169;
        font-weight: 700;
        font-size: 16px;
    }

</style>