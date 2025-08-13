<script>
    import dayjs from "dayjs";
    import {CARD_VIEW_STATUS_BADGE_STYLES, get_card_status_conditions_value, get_column_display_value, get_column_type} from "$lib/card_view/CardViewUtils.js";

    export let submodule;
    export let data_row;
    export let config;

    export let data_mapping = {
            main_header_text: "product_name",
            main_header_caption_display_name: "hsn_code",
            main_header_caption: "hsn_code",
            status_badge: "available_quantity",
            main_detail_items: [
                { item_value: "mrp", item_text: "" },
                { item_value: "sale_price" , item_text: ""},
                { item_value: "sales_tax" , item_text: ""},
                { item_value: "purchase_tax" , item_text: ""}
            ],
            status_badge_default_negative_conditions: "",
            status_badge_default_positive_conditions: "",
            status_badge_default_neutral_conditions: "",
        }



    let status_badge_style = get_card_status_conditions_value(submodule, data_row, data_mapping);
    let container_element;


</script>


<div class="common_card_product single_card_view_item"
     bind:this={container_element}
     data-data_row_id="{data_row.id}"
     class:default_positive={status_badge_style === CARD_VIEW_STATUS_BADGE_STYLES.default_positive}
     class:default_neutral={status_badge_style === CARD_VIEW_STATUS_BADGE_STYLES.default_neutral}
     class:default_negative={status_badge_style === CARD_VIEW_STATUS_BADGE_STYLES.default_negative}>

    <div class="card_header">
        <div class="product_info">
            <h3 class="product_name" data-column_id="{data_mapping.main_header_text}" data-column_type="{get_column_type({submodule, column_id: data_mapping.main_header_text})}">{get_column_display_value({submodule, data_row, column_id: data_mapping.main_header_text}) || ""}</h3>
            <div class="product_meta">
                {#if data_mapping.main_header_caption_display_name }
                    <span class="product_id">{data_mapping.main_header_caption_display_name || ""}:</span>
                {/if}
                <span class="hsn_code">{get_column_display_value({submodule, column_id: data_mapping.main_header_caption, data_row}) || ""}</span>
            </div>
        </div>
        <div class="stock_status">{get_column_display_value({submodule, column_id: data_mapping.status_badge, data_row})|| ""}</div>
    </div>

    <div class="card_body">
        {#each data_mapping.main_detail_items as item}
            <div class="data_row card_view_actionable_item"
                 data-column_id="{item.item_value}"
                 data-column_type="{get_column_type({submodule, column_id: item.item_value})}">
                <span class="label">{item.item_text}:</span>
                <span class="value">{get_column_display_value({submodule, column_id: item.item_value, data_row}) || ""}</span>
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
        height: -webkit-fill-available;
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



    .single_card_view_item.default_positive .stock_status{
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }

    .single_card_view_item.default_neutral .stock_status{
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fcd34d;
    }

    .single_card_view_item.default_negative .stock_status{
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
