<script>

    import dayjs from "dayjs";

    export let submodule;
    export let data_row;
    export let config;

   export let data_mapping = {
            main_header_text: "title",
            date_range_start: "start_date",
            date_range_end: "end_date",
            date_format_style: "standard",
            duration_display:  "duration_in_months",
            status_badge:  "is_current_financial_year"
        };

    function get_column_display_value(column_id){
        // const column_instance = get_column_instance(column_id);
        // let display_value = column_instance.parseDisplayValue(data_row);

        // if(column_id === 'due_date'){
        //     display_value = dayjs(display_value).format('DD MMM YYYY')
        // }
        // return display_value;

        return data_row[column_id]?.text || data_row[column_id]?.value || data_row[column_id]?.name;
    }


    function get_column_display_name(column_id){
        return column_id.toUpperCase();
    }

    function get_formatted_date(column_id, format = "DD MMM YYYY") {
        const value = data_row[column_id]?.value || data_row[column_id]?.text;
        return value ? dayjs(value).format(format) : '';
    }



</script>

<div class="common_card_year">
    <div class="card_header">
        <div class="year_info">
            <div class="year_icon">📅</div>
            <div class="year_details">
                <h3 class="year_title">{get_formatted_date(data_mapping.main_header_text)}</h3>
            </div>
        </div>
        <span class="current_badge">Current</span>
    </div>

    <div class="date_section">
        <div class="date_range">
            <div class="date_item">
<!--                <span class="date_label">{get_column_display_name(data_mapping.date_range_start)}</span>-->
                <span class="date_value">{get_column_display_value(data_mapping.date_range_start)}</span>
            </div>
            <div class="date_separator">→</div>
            <div class="date_item">
<!--                <span class="date_label">{get_column_display_name(data_mapping.date_range_end)}</span>-->
<!--                <span class="date_value">{get_formatted_date(data_mapping.date_range_end)}</span>-->
                <span class="date_value">{get_column_display_value(data_mapping.date_range_end)}</span>
            </div>
        </div>
        <div class="duration_info">
            <span class="duration_label">Duration:</span>
            <span class="duration_value">12 months</span>
        </div>
    </div>
</div>

<style>
    .common_card_year {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .common_card_year::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #06b6d4);
    }

    .common_card_year:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        border-color: #d1d5db;
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f3f4f6;
    }

    .year_info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .year_icon {
        font-size: 24px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #eff6ff;
        border-radius: 8px;
    }

    .year_details {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .year_title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        line-height: 1.2;
    }

    .year_id {
        font-size: 12px;
        color: #6b7280;
        background: #f9fafb;
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 500;
        align-self: flex-start;
    }

    .current_badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        background: #dcfce7;
        color: #166534;
        text-transform: uppercase;
        letter-spacing: 0.025em;
    }

    .date_section {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .date_range {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .date_item {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }

    .date_label {
        font-size: 11px;
        color: #64748b;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .date_value {
        font-size: 14px;
        color: #1e293b;
        font-weight: 600;
    }

    .date_separator {
        font-size: 18px;
        color: #3b82f6;
        font-weight: 600;
    }

    .duration_info {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: #fef3c7;
        border-radius: 20px;
        align-self: center;
    }

    .duration_label {
        font-size: 12px;
        color: #92400e;
        font-weight: 500;
    }

    .duration_value {
        font-size: 12px;
        color: #92400e;
        font-weight: 700;
    }
</style>
