<script>

    import dayjs from "dayjs";

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


<div class="common_card_year_minimal">
    <div class="card_content">
        <div class="year_info">
            <div class="year_display">
<!--                <span class="start_year">{get_formatted_date(data_mapping.date_range_start)}</span>-->
                <span class="start_year">{get_column_display_value(data_mapping.date_range_start)}</span>
                <span class="year_separator">—</span>
<!--                <span class="end_year">{get_formatted_date(data_mapping.date_range_start)}</span>-->
                <span class="end_year">{get_column_display_value(data_mapping.date_range_start)}</span>
            </div>
            <div class="year_title">{get_column_display_value(data_mapping.main_header_text)}</div>
        </div>

        <div class="year_meta">
            <span class="year_id">{get_column_display_value(data_mapping.main_header_text)}</span>
            <div class="status_indicator">
                <span class="status_dot status_active"></span>
                <span class="status_text">active</span>
            </div>
        </div>
    </div>

<!--    <div class="progress_section">-->
<!--        <div class="progress_bar">-->
<!--            <div class="progress_fill" style="width: 45%"></div>-->
<!--        </div>-->
<!--        <span class="progress_text">45% Complete</span>-->
<!--    </div>-->
</div>

<style>
    .common_card_year_minimal {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        transition: all 0.2s ease;
        position: relative;
        min-width: 400px;
    }

    .common_card_year_minimal:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: #d1d5db;
    }

    .card_content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .year_info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .year_display {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 700;
        color: #1f2937;
    }

    .start_year,
    .end_year {
        color: #3b82f6;
    }

    .year_separator {
        color: #6b7280;
        font-weight: 400;
    }

    .year_title {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
    }

    .year_meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
    }

    .year_id {
        font-size: 10px;
        color: #9ca3af;
        background: #f9fafb;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;
    }

    .status_indicator {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .status_dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .status_active {
        background: #22c55e;
    }

    .status_upcoming {
        background: #3b82f6;
    }

    .status_completed {
        background: #6b7280;
    }

    .status_text {
        font-size: 11px;
        color: #6b7280;
        font-weight: 500;
        text-transform: capitalize;
    }

    .progress_section {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-top: 12px;
        border-top: 1px solid #f3f4f6;
    }

    .progress_bar {
        flex: 1;
        height: 4px;
        background: #f3f4f6;
        border-radius: 2px;
        overflow: hidden;
    }

    .progress_fill {
        height: 100%;
        background: linear-gradient(90deg, #22c55e, #16a34a);
        border-radius: 2px;
        transition: width 0.3s ease;
    }

    .progress_text {
        font-size: 10px;
        color: #22c55e;
        font-weight: 600;
        white-space: nowrap;
    }
</style>
