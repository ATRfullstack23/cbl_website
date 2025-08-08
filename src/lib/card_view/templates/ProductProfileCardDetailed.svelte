<script>
    import dayjs from "dayjs";

    export let data_row;
    export let config;

    let primary_section_title;
    let secondary_section_title;

    export let data_mapping = {
        main_header_text: "product_name",
        main_header_caption: "hsn_code",
        caption: "product_category_id",
        status_badge: "available_quantity",
        left_section_title: "Product Information",
        right_section_title: "Pricing Details",
        left_section_items: [
            { item_value: "mrp", item_text: "" },
        ],
        right_section_items: [
            { item_value: "mrp", item_text: "" },
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



<div class="common_card_product_detailed">
    <div class="card_header">
        <div class="product_title">
            <h3 class="name">{get_column_display_value(data_mapping.main_header_text)}</h3>
            <div class="identifiers">
                <span class="id">{get_column_display_name(data_mapping.main_header_caption) || ""}:</span>
                <span class="hsn">{get_column_display_value(data_mapping.main_header_caption) || ""}</span>
            </div>
        </div>
        <div class="stock_indicator warning">
            <div class="stock_value">{get_column_display_value(data_mapping.status_badge) || ''}</div>
<!--            <div class="stock_status">Low Stock</div>-->
        </div>
    </div>

    <div class="card_content">
        <div class="info_section">
            <h4 class="section_title">{get_column_display_value(data_mapping.left_section_title) || ""}</h4>
            <table class="info_table">
                {#each data_mapping.left_section_items as item}
                <tr>
                    <td class="field_label">{get_column_display_name(item.item_text)}</td>
                    <td class="field_value">{get_column_display_value(item.item_value)|| ""}</td>
                </tr>
                {/each}
            </table>
        </div>

        <div class="info_section">
            <h4 class="section_title">{get_column_display_value(data_mapping.right_section_title) || ""}</h4>
            <table class="info_table">
                {#each data_mapping.right_section_items as item}
                    <tr>
                        <td class="field_label">{get_column_display_name(item.item_text) || ""}:</td>
                        <td class="field_value price_mrp">{get_column_display_value(item.item_value) || ""}</td>
                    </tr>
                {/each}
            </table>
        </div>

<!--        <div class="info_section">-->
<!--            <h4 class="section_title">Tax Configuration</h4>-->
<!--            <table class="info_table">-->
<!--                <tr>-->
<!--                    <td class="field_label">Sales Tax</td>-->
<!--                    <td class="field_value">18% GST</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                    <td class="field_label">Purchase Tax</td>-->
<!--                    <td class="field_value">18% GST</td>-->
<!--                </tr>-->
<!--            </table>-->
<!--        </div>-->
    </div>
</div>

<style>
    .common_card_product_detailed {
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        margin-bottom: 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        height: -webkit-fill-available;
    }

    .card_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 20px;
        border-bottom: 2px solid #e5e7eb;
        background: #f8fafc;
    }

    .product_title {
        flex: 1;
    }

    .name {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        line-height: 1.3;
    }

    .identifiers {
        display: flex;
        gap: 20px;
    }

    .id, .hsn {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
    }

    .stock_indicator {
        text-align: center;
        padding: 12px 16px;
        border-radius: 4px;
        border: 1px solid;
        min-width: 100px;
    }

    .stock_indicator.normal {
        background: #f0fdf4;
        border-color: #bbf7d0;
        color: #166534;
    }

    .stock_indicator.warning {
        background: #fffbeb;
        border-color: #fed7aa;
        color: #92400e;
    }

    .stock_indicator.critical {
        background: #fef2f2;
        border-color: #fecaca;
        color: #991b1b;
    }

    .stock_value {
        font-size: 20px;
        font-weight: 700;
        line-height: 1;
    }

    .stock_unit {
        font-size: 11px;
        margin-top: 2px;
        opacity: 0.8;
    }

    .stock_status {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        margin-top: 4px;
        letter-spacing: 0.5px;
    }

    .card_content {
        padding: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }

    .info_section {
        background: #f9fafb;
        padding: 16px;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
    }

    .section_title {
        margin: 0 0 12px 0;
        font-size: 13px;
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
        vertical-align: top;
        width: 40%;
    }

    .field_value {
        padding: 8px 0;
        font-size: 12px;
        color: #111827;
        font-weight: 600;
        text-align: right;
    }

    .price_mrp {
        color: #6b7280;
        /*text-decoration: line-through;*/
    }

    .price_sale {
        color: #059669;
    }

    .margin {
        color: #dc2626;
    }

    @media (max-width: 768px) {
        .card_content {
            grid-template-columns: 1fr;
            gap: 16px;
        }

        .card_header {
            flex-direction: column;
            gap: 16px;
        }

        .stock_indicator {
            align-self: flex-start;
        }
    }
</style>
