<script>
    import dayjs from "dayjs";

    export let data_row;
    export let config;

    export let data_mapping = {
        main_header_text: "leave_type",
        main_header_caption: "unique_id",
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
            {item_value: "max_days", item_text: ""},
            {item_value: "is_paid", item_text: ""},
            {item_value: "is_half_day_allowed", item_text: ""}
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

    let time_now = Date.now();
    function check_status_badge_condition_green(){
        return time_now % 2 === 1;
    }
    function check_status_badge_condition_red(){
        return time_now % 2 === 0;
    }

</script>

<div class="common_card_detailed">
    <div class="card_header">
        <div class="card_info">
            <h3 class="card_title">{get_column_display_value(data_mapping.main_header_text)}</h3>
            <span class="card_subtitle">{get_column_display_value(data_mapping.main_header_text)}</span>
        </div>
        <div class="status_section">
            <span class="status_badge" class:status_inactive={check_status_badge_condition_red()} class:status_active={check_status_badge_condition_green()}>{get_column_display_value(data_mapping.status_badge)}</span>
        </div>
    </div>

    <div class="card_table">
        {#each data_mapping.main_detail_items as item}
            <div class="card_row">
                <span class="card_label">{get_column_display_name(item.item_text) || ""}:</span>
                <span class="card_value">{get_column_display_value(item.item_value) || ""}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .common_card_detailed {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        min-width: 350px;
        height: -webkit-fill-available;
    }

    .common_card_detailed::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    }

    .common_card_detailed:hover {
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

    .card_info {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .card_title {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        color: #1f2937;
        line-height: 1.2;
    }

    .card_subtitle {
        font-size: 13px;
        color: #6b7280;
        background: #f9fafb;
        padding: 4px 10px;
        border-radius: 8px;
        font-weight: 500;
        align-self: flex-start;
        font-family: monospace;
    }

    .status_section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
    }

    .status_badge {
        padding: 6px 16px;
        border-radius: 24px;
        font-size: 13px;
        font-weight: 600;
        text-transform: capitalize;
        letter-spacing: 0.025em;
    }

    .default_badge {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 600;
        background: #fef3c7;
        color: #92400e;
        text-transform: uppercase;
    }

    .status_active {
        background: #dcfce7;
        color: #166534;
    }

    .status_inactive {
        background: #fee2e2;
        color: #991b1b;
    }

    .card_table {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .card_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f3f4f6;
        transition: background-color 0.2s ease;
    }

    .card_row:hover {
        background-color: #f9fafb;
        margin: 0 -12px;
        padding: 12px;
        border-radius: 8px;
    }

    .card_row:last-child {
        border-bottom: none;
    }

    .card_label {
        font-size: 15px;
        color: #6b7280;
        font-weight: 600;
        min-width: 140px;
    }

    .card_value {
        font-size: 15px;
        color: #1f2937;
        text-align: right;
        font-weight: 600;
        max-width: 200px;
        word-break: break-word;
    }

    .max_days {
        color: #3b82f6;
        background: #eff6ff;
        padding: 6px 12px;
        border-radius: 8px;
    }

    .paid {
        color: #059669;
        background: #ecfdf5;
        padding: 6px 12px;
        border-radius: 8px;
    }

    .unpaid {
        color: #dc2626;
        background: #fef2f2;
        padding: 6px 12px;
        border-radius: 8px;
    }

    .allowed {
        color: #059669;
        background: #ecfdf5;
        padding: 6px 12px;
        border-radius: 8px;
    }

    .not_allowed {
        color: #dc2626;
        background: #fef2f2;
        padding: 6px 12px;
        border-radius: 8px;
    }

    .system_id {
        font-family: monospace;
        background: #f3f4f6;
        padding: 4px 8px;
        border-radius: 6px;
    }
</style>

