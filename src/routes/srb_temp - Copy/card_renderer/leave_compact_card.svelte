<script>
    import dayjs from "dayjs";

    export let data_row;
    export let config;

    const data_mapping = config.data_mapping;


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
        return column_id.toUpperCase();
    }
</script>

<div class="card_leave_compact">
    <div class="card_header">
        <div class="card_main_info">
            <h3 class="card_title">{get_column_display_value(data_mapping.main_header_text.column_id)}</h3>
            <span class="card_subtitle">{get_column_display_value(data_mapping.main_header_text.column_id)}</span>
        </div>
        <span class="status_badge status_active">
            {get_column_display_value(data_mapping.status_badge.column_id)}
        </span>
    </div>

    <div class="data_table">
        {#each data_mapping.main_detail_items as item}
            <div class="data_row">
                <span class="data_label">{get_column_display_name(item.column_id)}:</span>
                <span class="data_value max_days">{get_column_display_value(item.column_id)}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .card_leave_compact {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        min-width: 350px;
    }

    .card_leave_compact:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        border-color: #d1d5db;
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f3f4f6;
    }

    .card_main_info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .card_title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        line-height: 1.2;
    }

    .card_subtitle {
        font-size: 12px;
        color: #6b7280;
        background: #f9fafb;
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 500;
        align-self: flex-start;
    }

    .status_badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
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

    .data_table {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .data_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f9fafb;
    }

    .data_row:last-child {
        border-bottom: none;
    }

    .data_label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
        min-width: 80px;
    }

    .data_value {
        font-size: 14px;
        color: #1f2937;
        text-align: right;
        font-weight: 600;
    }

    .max_days {
        color: #3b82f6;
        background: #eff6ff;
        padding: 4px 8px;
        border-radius: 6px;
    }

    .paid {
        color: #059669;
        background: #ecfdf5;
        padding: 4px 8px;
        border-radius: 6px;
    }

    .unpaid {
        color: #dc2626;
        background: #fef2f2;
        padding: 4px 8px;
        border-radius: 6px;
    }
</style>
