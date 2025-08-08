 <script>
    import dayjs from "dayjs";

    export let submodule;
    export let data_row;
    export let config;

    export let data_mapping = {
            main_header_text: "customer_name",
            main_header_caption: "customer_type",
            header_icon: "",
            highlight_value_box:"address",
            main_detail_items: [
                    {
                        item_value: "email",
                        item_text: "",
                    },
                    {
                        item_value: "phone_number",
                        item_text: ""
                    }
                ],
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

<div class="common_card_horizontal">
    <div class="left_section">
        <div class="card_header">
            {#if data_mapping.header_icon && data_mapping.header_icon.length}
                <span class="type_icon">{data_mapping.header_icon || ""}</span>
            {/if}
            <div class="header_text">
                <h3 class="card_title">{get_column_display_value(data_mapping.main_header_text) || ""}</h3>
                <span class="card_subtitle">{get_column_display_value(data_mapping.main_header_caption) || ""}</span>
            </div>
        </div>
        <div class="contact_info">
            {#each data_mapping.main_detail_items as item}
                <div class="contact_item">
                    <span class="contact_label">{get_column_display_name(item.item_text) || ""}:</span>
                    <span class="contact_value">{get_column_display_value(item.item_value) || ""}</span>
                </div>
            {/each}
        </div>
    </div>
    <div class="right_section">
        <div class="address_info">
            {get_column_display_name(data_mapping.highlight_value_box || "")}
        </div>
    </div>
</div>

<style>
    .common_card_horizontal {
        display: flex;
        background: #fafafa;
        border: 2px solid #e8e8e8;
        border-left: 6px solid #666;
        margin-bottom: 16px;
        transition: all 0.2s ease;
        min-height: 120px;
        min-width: 450px;
        height: -webkit-fill-available;
    }

    .common_card_horizontal:hover {
        border-left-color: #333;
        background: #f5f5f5;
        transform: translateX(4px);
    }

    .left_section {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .card_header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }

    .type_icon {
        font-size: 24px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        border-radius: 8px;
    }

    .header_text {
        flex: 1;
    }

    .card_title {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        line-height: 1.2;
    }

    .card_subtitle {
        font-size: 13px;
        color: #666;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
    }

    .contact_info {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .contact_item {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
    }

    .contact_label {
        font-size: 14px;
        width: 20px;
    }

    .contact_value {
        font-size: 14px;
        color: #555;
        font-weight: 500;
    }

    .right_section {
        width: 120px;
        background: #f8f8f8;
        border-left: 1px solid #e0e0e0;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
    }

    .id_badge {
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        font-family: monospace;
    }

    .address_info {
        font-size: 12px;
        color: #666;
        text-align: center;
        font-weight: 500;
        text-decoration: underline;
        cursor: pointer;
    }

    @media (max-width: 600px) {
        .common_card_horizontal {
            flex-direction: column;
        }

        .right_section {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
        }
    }
</style>
