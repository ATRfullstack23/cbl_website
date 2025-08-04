<script>
    import dayjs from "dayjs";

    export let data_row;
    export let config;

    export let data_mapping = {
            main_header_text: "product_name",
            main_header_caption: "hsn_code",
            caption: "product_category_id",
            stock_badge: "available_quantity",
            main_detail_items: [
                { item_value: "mrp", item_text: "" },
                { item_value: "sale_price" , item_text: ""},
                { item_value: "sales_tax" , item_text: ""},
                { item_value: "purchase_tax" , item_text: ""}
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

</script>


<div class="common_card_product">
    <div class="card_header">
        <div class="product_info">
            <h3 class="product_name">{get_column_display_value(data_mapping.main_header_text)}</h3>
            <div class="product_meta">
                <span class="product_id">{get_column_display_name(data_mapping.main_header_caption) || ""}:</span>
                <span class="hsn_code">{get_column_display_value(data_mapping.main_header_caption)}</span>
            </div>
        </div>
        <div class="stock_status in_stock">{get_column_display_value(data_mapping.stock_badge)|| "0"}</div>
    </div>

    <div class="card_body">
        {#each data_mapping.main_detail_items as item}
            <div class="data_row">
                <span class="label">{get_column_display_name(item.item_text) || ""}:</span>
                <span class="value">{get_column_display_value(item.item_value) || ""}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .common_card_product {
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        margin-bottom: 12px;
        min-width: 350px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
    }

    .product_info {
        flex: 1;
    }

    .product_name {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        line-height: 1.3;
    }

    .product_meta {
        display: flex;
        gap: 16px;
    }

    .product_id, .hsn_code {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
    }

    .stock_status {
        padding: 6px 12px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        min-width: 80px;
    }

    .in_stock {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }

    .low_stock {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fcd34d;
    }

    .out_of_stock {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
    }

    .card_body {
        padding: 16px;
    }

    .data_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f3f4f6;
    }

    .data_row:last-child {
        border-bottom: none;
    }

    .label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
        min-width: 100px;
    }

    .value {
        font-size: 13px;
        color: #111827;
        font-weight: 600;
        text-align: right;
    }

    .price {
        color: #374151;
    }

    .price_sale {
        color: #059669;
    }
</style>
