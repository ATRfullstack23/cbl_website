<script>
    export let card_title = '';
    export let card_description = '';
    export let data_summary = '';
    export let download_buttons = [];


    export let data_row;
    export let config;

    export let data_mapping = {
        main_header_text : "fullName",
        main_header_caption : "designation_profile_row_id",
        download_content : "nationality"
    };


    function get_column_display_value(column_id){
        return data_row[column_id]?.text || data_row[column_id]?.value;
    }


    function get_column_display_name(column_id){
        return column_id?.toUpperCase() || '-';
    }

</script>

<div class="download_card_simple">
    <div class="card_header">
        <div class="card_info">
            <h3 class="card_title">{get_column_display_value(data_mapping.main_header_text) || ""}</h3>
            <p class="card_description">{get_column_display_value(data_mapping.main_header_caption) || ""}</p>
            <span class="data_summary">{data_summary}</span>
        </div>
        <div class="download_section">
            <div class="download_buttons">
                    <button class="download_btn ">
                        <span class="download_icon">⬇</span>
                        download
                    </button>
            </div>
        </div>
    </div>
</div>

<style>
    .download_card_simple {
        width: 100%;
        background: #ffffff;
        border: 1px solid #3b82f6;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s ease;
        height: -webkit-fill-available;
        padding: 24px;
        margin-bottom: 20px;
    }

    .download_card_simple:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
    }

    .card_info {
        flex: 1;
        margin-right: 20px;
    }

    .card_title {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #111827;
    }

    .card_description {
        margin: 0 0 6px 0;
        font-size: 14px;
        color: #6b7280;
        line-height: 1.4;
    }

    .data_summary {
        font-size: 12px;
        color: #9ca3af;
        font-weight: 500;
    }

    .download_section {
        display: flex;
        align-items: center;
    }

    .download_buttons {
        display: flex;
        gap: 8px;
    }

    .download_btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border: 1px solid #3b82f6;
        border-radius: 6px;
        background: #ffffff;
        color: #3b82f6;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .download_btn:hover {
        background: #f9fafb;
        border-color: #9ca3af;
        transform: translateY(-1px);
    }

    .download_json {
        border-color: #3b82f6;
        color: #3b82f6;
    }

    .download_json:hover {
        background: #eff6ff;
        border-color: #2563eb;
    }

    .download_csv {
        border-color: #059669;
        color: #059669;
    }

    .download_csv:hover {
        background: #ecfdf5;
        border-color: #047857;
    }

    .download_pdf {
        border-color: #dc2626;
        color: #dc2626;
    }

    .download_pdf:hover {
        background: #fef2f2;
        border-color: #b91c1c;
    }

    .download_icon {
        font-size: 12px;
    }

    @media (max-width: 768px) {
        .card_header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
        }

        .card_info {
            margin-right: 0;
        }

        .download_buttons {
            flex-wrap: wrap;
        }
    }
</style>
