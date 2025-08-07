<script>
    import dayjs from "dayjs";

    export let data_row;
    export let config;

    export let data_mapping = {
        main_header_text : "fullName",
        main_header_caption : "designation_profile_row_id",
        main_detail_items : [
            {item_value : "nationality", item_text: ""},
            {item_value : "phone_number", item_text: ""},
            {item_value : "registered_email_id", item_text: ""}
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

<div class="card_detailed">
    <div class="card_header">
        <div class="avatar_section">
            <img src="https://placehold.co/64x64" alt="John Doe" class="avatar" />
            <div class="title_section">
                <h3 class="card_title">{get_column_display_value(data_mapping.main_header_text) || ""}</h3>
                <span class="card_caption">{get_column_display_value(data_mapping.main_header_caption) || ""}</span>
            </div>
        </div>
<!--        <span class="status_badge status_active">active</span>-->
    </div>

    <div class="data_table">
        {#each data_mapping.main_detail_items as item}
            <div class="data_row">
                <span class="data_label">{get_column_display_name(item.item_text) || ""}:</span>
                <span class="data_value">{get_column_display_value(item.item_value) || ""}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .card_detailed {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        height: -webkit-fill-available;
    }

    .card_detailed::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    }

    .card_detailed:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        border-color: #d1d5db;
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f3f4f6;
    }

    .avatar_section {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #f3f4f6;
        transition: all 0.3s ease;
    }

    .card_detailed:hover .avatar {
        border-color: #3b82f6;
        transform: scale(1.05);
    }

    .title_section {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .card_title {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #1f2937;
        line-height: 1.2;
    }

    .card_caption {
        font-size: 13px;
        color: #6b7280;
        background: #f9fafb;
        padding: 4px 10px;
        border-radius: 8px;
        font-weight: 500;
        align-self: flex-start;
    }

    .status_badge {
        padding: 6px 16px;
        border-radius: 24px;
        font-size: 13px;
        font-weight: 600;
        text-transform: capitalize;
        letter-spacing: 0.025em;
    }

    .status_active {
        background: #dcfce7;
        color: #166534;
    }

    .status_inactive {
        background: #fee2e2;
        color: #991b1b;
    }

    .status_on_leave {
        background: #fef3c7;
        color: #92400e;
    }

    .data_table {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .data_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f3f4f6;
        transition: background-color 0.2s ease;
        gap: 20px;
    }

    .data_row:hover {
        background-color: #f9fafb;
        margin: 0 -12px;
        padding: 12px;
        border-radius: 8px;
    }

    .data_row:last-child {
        border-bottom: none;
    }

    .data_label {
        font-size: 15px;
        color: #6b7280;
        font-weight: 600;
        min-width: 100px;
    }

    .data_value {
        font-size: 15px;
        color: #1f2937;
        text-align: right;
        font-weight: 600;
        max-width: 220px;
        word-break: break-word;
    }

    .email {
        color: #3b82f6;
        text-decoration: none;
    }

    .salary {
        color: #059669;
        background: #ecfdf5;
        padding: 6px 12px;
        border-radius: 8px;
    }
</style>
