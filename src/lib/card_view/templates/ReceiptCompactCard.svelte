<script>

    import dayjs from "dayjs";

    export let data_row;
    export let config;


    export let data_mapping = {
            main_header_text: "voucher_number",
            main_header_caption: "customer_profile_id",
            status_badge: "payment_mode",
            status_icon: "badge_icon",
            highlight_value_box: "payment_amount",
            main_detail_items: [
                { item_value: "customer_profile_id" , item_text: "" },
                { item_value: "transaction_date"  , item_text: "" },
                { item_value: "payment_amount"  , item_text: "" }
            ]
        }


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
        return column_id?.toUpperCase() || '-';
    }

    function get_formatted_date(column_id, format = "DD MMM YYYY") {
        const value = data_row[column_id]?.value || data_row[column_id]?.text;
        return value ? dayjs(value).format(format) : '';
    }


</script>


<div class="common_card_payment_compact">
    <div class="card_header">
        <div class="voucher_section">
            <div class="voucher_number">{get_column_display_value(data_mapping.main_header_text) || ""}</div>
            <div class="payment_id">{get_column_display_value(data_mapping.main_header_caption) || ""}</div>
        </div>
        <div class="payment_mode mode_upi">
            <span class="mode_icon">{data_mapping.status_icon}</span>
            <span class="mode_text">{get_column_display_value(data_mapping.status_badge) || ""}</span>
        </div>
    </div>

    <div class="card_body">
<!--        <div class="customer_section">-->
<!--&lt;!&ndash;            <div class="customer_name">{get_column_display_value(data_mapping.main_header_caption)}</div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="transaction_date">{get_formatted_date(data_mapping.additional_details.column_id)}</div>&ndash;&gt;-->
<!--        </div>-->

        <div class="amount_section">
            <div class="amount_value">{get_column_display_value(data_mapping.highlight_value_box) || ""}</div>
            <div class="amount_label">{get_column_display_name(data_mapping.highlight_value_box) || ""}</div>
        </div>

        <div class="details_section">
            {#each data_mapping.main_detail_items as item}
                <div class="detail_row">
                    <span class="detail_label">{get_column_display_name(item.item_text) || ""}:</span>
                    <span class="detail_value">{get_column_display_value(item.item_value) || ""}</span>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .common_card_payment_compact {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s ease;
        overflow: hidden;
        position: relative;
        min-width: 400px;
        height: -webkit-fill-available;
    }

    .common_card_payment_compact::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #10b981, #059669);
    }

    .common_card_payment_compact:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
    }

    .voucher_section {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .voucher_number {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        font-family: monospace;
    }

    .payment_id {
        font-size: 11px;
        color: #6b7280;
        background: #ffffff;
        padding: 2px 6px;
        border-radius: 4px;
        align-self: flex-start;
    }

    .payment_mode {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
    }

    .mode_cash {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fcd34d;
    }

    .mode_bank {
        background: #dbeafe;
        color: #1e40af;
        border: 1px solid #93c5fd;
    }

    .mode_card {
        background: #e0e7ff;
        color: #3730a3;
        border: 1px solid #a5b4fc;
    }

    .mode_upi {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #a7f3d0;
    }

    .mode_icon {
        font-size: 14px;
    }

    .card_body {
        padding: 20px;
    }

    .customer_section {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f3f4f6;
    }

    .customer_name {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
    }

    .transaction_date {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
    }

    .amount_section {
        text-align: center;
        margin-bottom: 16px;
        padding: 16px;
        background: #f0fdf4;
        border-radius: 8px;
        border: 1px solid #bbf7d0;
    }

    .amount_value {
        font-size: 24px;
        font-weight: 700;
        color: #166534;
        margin-bottom: 4px;
    }

    .amount_label {
        font-size: 12px;
        color: #059669;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .details_section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .detail_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
    }

    .detail_label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
    }

    .detail_value {
        font-size: 13px;
        color: #111827;
        font-weight: 600;
    }

    @media (max-width: 640px) {
        .customer_section {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }
    }
</style>
