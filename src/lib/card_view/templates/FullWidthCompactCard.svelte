<script>
    import dayjs from "dayjs";

    export let data_row;
    export let config;

    export let data_mapping = {
        main_header_text: "product_name",
        main_header_caption: "hsn_code",
        caption: "product_category_id",
        stock_badge: "available_quantity",
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
                <span class="hsn_code">{get_column_display_value(data_mapping.main_header_caption) || ""}</span>
                <div class="stock_status in_stock">{get_column_display_value(data_mapping.stock_badge)|| ""}</div>
            </div>
        </div>
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
        height: -webkit-fill-available;
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
        padding-bottom: 20px;
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
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        gap: 8px;
    }

    .product_id, .hsn_code {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
        justify-self: start;
    }

    .stock_status {
        padding: 6px 12px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        min-width: 80px;
    }

    .hsn_code {
        justify-self: center;
    }

    .stock_status {
        justify-self: end;
    }

    .in_stock {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }

</style>
