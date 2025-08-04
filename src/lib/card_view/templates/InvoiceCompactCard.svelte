<script>
    import dayjs from "dayjs";

    export let data_row;
    export let config;


    export let data_mapping =  {
            main_header_text: "invoice_number",
            main_header_caption: "customer_profile_id",
            caption: "invoice_date",
            invoice_status: "invoice_status",
            payment_status:"payment_status",
            due_date: "due_date",
            date_format_style: "standard",
            main_detail_items: [
                { item_value: "amount_excluding_tax", item_text: "" },
                { item_value: "total_amount" , item_text: ""},
                { item_value: "balance_due" , item_text: ""},
                { item_value: "due_date" , item_text: ""},
                { item_value: "invoice_items" , item_text: ""}
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

<div class="common_card_invoice_compact">
    <div class="card_header">
        <div class="invoice_info">
            <h3 class="invoice_number">{get_formatted_date(data_mapping.main_header_text)}</h3>
            <div class="invoice_meta">
                <span class="customer_name">{get_column_display_value(data_mapping.main_header_caption)}</span>
                <span class="invoice_date">{get_formatted_date(data_mapping.caption)|| "0"}</span>
            </div>
        </div>
        <div class="status_badges">
            <span class="invoice_status status_approved">{get_column_display_value(data_mapping.invoice_status)}</span>
            <span class="payment_status payment_partial">{get_column_display_value(data_mapping.payment_status)}</span>
        </div>
    </div>

    <div class="card_body">
        <div class="amount_section">
            {#each data_mapping.main_detail_items as item}
                <div class="amount_row">
                    <span class="label">{get_column_display_name(item.item_text) || ""}:</span>
                    <span class="value">{get_column_display_value(item.item_value) || ""}</span>
                </div>
            {/each}
        </div>

        <div class="details_section">
            <div class="detail_item">
<!--                <span class="detail_label">{get_column_display_name(data_mapping.due_date)}</span>-->
                <span class="detail_value overdue">{get_column_display_value(data_mapping.due_date)}</span>
            </div>
            <div class="detail_item">
                <span class="detail_label">Items:</span>
                <span class="detail_value">3</span>
            </div>
        </div>
    </div>
</div>

<style>
    .common_card_invoice_compact {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s ease;
        min-width: 400px;
    }

    .common_card_invoice_compact:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 20px;
        border-bottom: 1px solid #f3f4f6;
        background: #f9fafb;
    }

    .invoice_info {
        flex: 1;
    }

    .invoice_number {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        font-family: monospace;
    }

    .invoice_meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .customer_name {
        font-size: 14px;
        color: #374151;
        font-weight: 500;
    }

    .invoice_date {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
    }

    .status_badges {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
    }

    .invoice_status,
    .payment_status {
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: capitalize;
        letter-spacing: 0.5px;
    }

    .status_approved {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }

    .status_pending {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fcd34d;
    }

    .status_draft {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }

    .payment_paid {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }

    .payment_partial {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fcd34d;
    }

    .payment_unpaid {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
    }

    .card_body {
        padding: 20px;
    }

    .amount_section {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f3f4f6;
    }

    .amount_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
    }

    .amount_row.total {
        font-weight: 600;
        background: #f8fafc;
        margin: 0 -12px;
        padding: 10px 12px;
        border-radius: 4px;
    }

    .amount_row.balance_due {
        color: #dc2626;
        font-weight: 600;
    }

    .label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
    }

    .value {
        font-size: 13px;
        color: #111827;
        font-weight: 600;
    }

    .details_section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }

    .detail_item {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .detail_label {
        font-size: 11px;
        color: #6b7280;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .detail_value {
        font-size: 13px;
        color: #111827;
        font-weight: 600;
    }

    .detail_value.overdue {
        color: #dc2626;
    }

    @media (max-width: 640px) {
        .card_header {
            flex-direction: column;
            gap: 12px;
        }

        .status_badges {
            flex-direction: row;
            align-items: flex-start;
        }

        .details_section {
            grid-template-columns: 1fr;
            gap: 12px;
        }
    }
</style>
