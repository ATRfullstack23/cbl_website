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
</script>

<div class="common_card_minimal">
    <div class="card_header">
        <div class="card_info">
            <h3 class="card_title">{get_column_display_value(data_mapping.main_header_text)}</h3>
            <span class="card_details">{get_column_display_value(data_mapping.main_header_text)}</span>
        </div>
        <div class="status_indicators">
            <!--{#if get_column_display_value(data_mapping.status_badge.column_id) === 'active'}-->
            <!--    <span class="status_dot status_active"></span>-->
            <!--{:else}-->
            <!--    <span class="status_dot status_inactive"></span>-->
            <!--{/if}-->
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
    .common_card_minimal {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        transition: all 0.2s ease;
        position: relative;
        min-width: 350px;
        height: -webkit-fill-available;
    }

    .common_card_minimal:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: #d1d5db;
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f3f4f6;
    }

    .card_info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .card_title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        line-height: 1.2;
    }

    .card_details {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
    }

    .status_indicators {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .status_dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 0 1px #e5e7eb;
    }

    .status_active {
        background: #22c55e;
    }

    .status_inactive {
        background: #ef4444;
    }

    .half_day_indicator {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3b82f6;
        color: white;
        font-size: 10px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card_table {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .card_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
    }

    .card_label {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
        min-width: 60px;
    }

    .card_value {
        font-size: 12px;
        color: #1f2937;
        text-align: right;
        font-weight: 600;
    }

    .paid {
        color: #059669;
    }

    .unpaid {
        color: #dc2626;
    }
</style>
