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

<div class="common_card_payment_detailed">
    <div class="card_header">
        <div class="receipt_badge" style="background: linear-gradient(135deg, #10b981, #10b981aa)">
            <div class="receipt_title">{get_column_display_name(data_mapping.main_header_text.column_id)}</div>
            <div class="voucher_number">{get_column_display_value(data_mapping.main_header_text.column_id)}</div>
        </div>
        <div class="header_info">
            <h3 class="customer_name">{get_column_display_value(data_mapping.main_header_caption.column_id)}</h3>
<!--            <div class="transaction_details">-->
<!--                <div class="date_time">-->
<!--                    <span class="date">{get_column_display_value(data_mapping.main_header_text.column_id)}</span>-->
<!--                    <span class="time">{get_column_display_value(data_mapping.main_header_text.column_id)}</span>-->
<!--                </div>-->
<!--            </div>-->
        </div>
<!--        <div class="payment_id">{get_column_display_value(data_mapping.main_header_text.column_id)}</div>-->
    </div>

    <div class="card_content">
        <div class="amount_showcase">
            <div class="amount_label">{get_column_display_name(data_mapping.payment_amount_details.column_id)}</div>
            <div class="amount_value">{get_column_display_value(data_mapping.payment_amount_details.column_id)}</div>
            <div class="payment_method">
                {get_column_display_value(data_mapping.payment_mode_badge.column_id)}
            </div>
        </div>

        <div class="info_grid">
            <div class="info_section">
                <h4 class="section_title">Transaction Details</h4>
                <table class="info_table">
                    {#each data_mapping.additional_detail_items as item}
                        <tr>
                            <td class="field_label">{get_column_display_name(item.column_id) || ""}:</td>
                            <td class="field_value">{get_column_display_value(item.column_id) || ""}</td>
                        </tr>
                    {/each}
                </table>
            </div>

            <div class="info_section">
                <h4 class="section_title">Payment Method</h4>
                <table class="info_table">
                    {#each data_mapping.main_detail_items as item}
                        <tr>
                            <td class="field_label">{get_column_display_name(item.column_id) || ""}</td>
                            <td class="field_value payment_mode">{get_column_display_value(item.column_id) || ""}</td>
                        </tr>
                    {/each}
                </table>
            </div>
        </div>
    </div>
</div>


<style>
    .common_card_payment_detailed {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        margin-bottom: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
    }

    .common_card_payment_detailed:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 24px;
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
    }

    .receipt_badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        text-align: center;
        min-width: 100px;
    }

    .receipt_title {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 1px;
        opacity: 0.9;
    }

    .voucher_number {
        font-size: 16px;
        font-weight: 700;
        font-family: monospace;
        margin-top: 2px;
    }

    .header_info {
        flex: 1;
        margin: 0 24px;
    }

    .customer_name {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: #111827;
    }

    .date_time {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .date {
        font-size: 13px;
        color: #374151;
        font-weight: 500;
    }

    .time {
        font-size: 11px;
        color: #6b7280;
        font-weight: 500;
    }

    .payment_id {
        font-size: 11px;
        color: #6b7280;
        background: #ffffff;
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: 500;
        align-self: flex-start;
    }

    .card_content {
        padding: 24px;
    }

    .amount_showcase {
        text-align: center;
        margin-bottom: 24px;
        padding: 24px;
        background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
        border-radius: 12px;
        border: 1px solid #bbf7d0;
    }

    .amount_label {
        font-size: 12px;
        color: #059669;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    .amount_value {
        font-size: 32px;
        font-weight: 700;
        color: #166534;
        margin-bottom: 8px;
    }

    .payment_method {
        font-size: 13px;
        color: #059669;
        font-weight: 500;
    }

    .info_grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }

    .info_section {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
    }

    .section_title {
        margin: 0 0 16px 0;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid #d1d5db;
        padding-bottom: 8px;
    }

    .info_table {
        width: 100%;
        border-collapse: collapse;
    }

    .info_table tr {
        border-bottom: 1px solid #f3f4f6;
    }

    .info_table tr:last-child {
        border-bottom: none;
    }

    .field_label {
        padding: 8px 0;
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
        width: 40%;
    }

    .field_value {
        padding: 8px 0;
        font-size: 13px;
        color: #111827;
        font-weight: 600;
        text-align: right;
    }

    .payment_mode {
        color: #3b82f6;
    }

    @media (max-width: 768px) {
        .card_header {
            flex-direction: column;
            gap: 16px;
        }

        .header_info {
            margin: 0;
        }

        .info_grid {
            grid-template-columns: 1fr;
            gap: 16px;
        }
    }

</style>