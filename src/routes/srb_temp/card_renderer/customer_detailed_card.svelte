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

<div class="common_card_split">
    <div class="card_sidebar">
        <div class="customer_initial">J</div>
        <div class="customer_id">#C1234</div>
        <div class="customer_type_label">{get_column_display_value(data_mapping.main_header_caption.column_id)}</div>
    </div>

    <div class="card_main">
        <div class="customer_title">
            <h3 class="name">{get_column_display_value(data_mapping.main_header_text.column_id)}</h3>
        </div>

        <div class="info_sections">
            <div class="info_section">
<!--                <h4 class="section_title">{get_column_display_name(data_mapping.contact_info_items.column_id)}</h4>-->
                <div class="info_list">
                    {#each data_mapping.contact_info_items as item}
                        <div class="info_item">
                            <span class="label">{get_column_display_name(item.column_id) || ""}:</span>
                            <span class="value">{get_column_display_value(item.column_id) || ""}</span>
                        </div>
                    {/each}
                </div>
            </div>

        </div>
    </div>
</div>

<style>
    .common_card_split {
        display: flex;
        background: white;
        border: 1px solid #ddd;
        border-radius: 0;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s ease;
        overflow: hidden;
    }

    .common_card_split:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card_sidebar {
        width: 100px;
        background: #f8f9fa;
        border-right: 1px solid #ddd;
        padding: 24px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        text-align: center;
    }

    .customer_initial {
        width: 60px;
        height: 60px;
        background: #6c757d;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
    }

    .customer_id {
        font-size: 12px;
        color: #6c757d;
        font-weight: 600;
        background: white;
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    .customer_type_label {
        font-size: 10px;
        color: #6c757d;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
        writing-mode: vertical-rl;
        text-orientation: mixed;
    }

    .card_main {
        flex: 1;
        padding: 24px;
    }

    .customer_title {
        margin-bottom: 24px;
        border-bottom: 2px solid #f8f9fa;
        padding-bottom: 12px;
    }

    .name {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
    }

    .info_sections {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .info_section {
        background: #fafbfc;
        padding: 16px;
        border-left: 4px solid #dee2e6;
    }

    .section_title {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #495057;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .info_list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .info_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
    }

    .label {
        font-size: 13px;
        color: #6c757d;
        font-weight: 500;
        min-width: 120px;
    }

    .value {
        font-size: 13px;
        color: #333;
        font-weight: 600;
        text-align: right;
    }

    @media (max-width: 600px) {
        .common_card_split {
            flex-direction: column;
        }

        .card_sidebar {
            width: 100%;
            flex-direction: row;
            justify-content: space-around;
        }

        .customer_type_label {
            writing-mode: horizontal-tb;
            text-orientation: initial;
        }
    }
</style>
