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
</script>

<div class="common_card_list">
    <div class="customer_row">
        <div class="customer_basic">
            <div class="customer_name_section">
                <span class="customer_name">{get_column_display_value(data_mapping.main_header_text.column_id)}</span>
                <span class="customer_meta">{get_column_display_value(data_mapping.main_header_caption.column_id)}</span>
            </div>
        </div>

        <div class="customer_contact">
            {#each data_mapping.contact_info_items as item}
                <div class="contact_item">
                    <span class="contact_label">{get_column_display_name(item.column_id) || ""}:</span>
                    <span class="contact_value">{get_column_display_value(item.column_id) || ""}</span>
                </div>
            {/each}
        </div>

        <div class="customer_actions">
            <div class="address_badge">{get_column_display_name(data_mapping.address_field.column_id)}</div>
<!--            <div class="type_indicator company">C</div>-->
        </div>
    </div>
</div>

<style>
    .common_card_list {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        margin-bottom: 8px;
        transition: all 0.2s ease;
    }

    .common_card_list:hover {
        border-color: #adb5bd;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .customer_row {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        gap: 20px;
    }

    .customer_basic {
        flex: 1;
        min-width: 0;
    }

    .customer_name_section {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .customer_name {
        font-size: 16px;
        font-weight: 600;
        color: #212529;
        line-height: 1.2;
    }

    .customer_meta {
        font-size: 12px;
        color: #6c757d;
        font-weight: 500;
    }

    .customer_contact {
        display: flex;
        gap: 24px;
        flex: 2;
    }

    .contact_item {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .contact_type {
        font-size: 10px;
        color: #868e96;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .contact_detail {
        font-size: 13px;
        color: #495057;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .customer_actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .address_badge {
        font-size: 11px;
        color: #6c757d;
        background: #f8f9fa;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 500;
        white-space: nowrap;
    }

    .type_indicator {
        width: 28px;
        height: 28px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: white;
    }

    .type_indicator.company {
        background: #495057;
    }

    .type_indicator.individual {
        background: #6c757d;
    }

    @media (max-width: 768px) {
        .customer_row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }

        .customer_contact {
            width: 100%;
            justify-content: space-between;
        }

        .customer_actions {
            width: 100%;
            justify-content: space-between;
        }
    }
</style>
