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

        return data_row[column_id]?.text || data_row[column_id]?.value;
    }


    function get_column_display_name(column_id){
        return column_id.toUpperCase();
    }

</script>

<div class="card_container">
    <header>
        <h4>{get_column_display_value(data_mapping.main_header_text.column_id)}</h4>
<!--        <h4>Employee Name</h4>-->
        <p class="header_caption">{get_column_display_value(data_mapping.main_header_caption.column_id)}</p>
    </header>
    {#each data_mapping.main_detail_items as item}
        <div class="card_row">
            <div class="label">{ get_column_display_name(item.column_id)}:</div>
            <div class="value">{get_column_display_value(item.column_id)}</div>
        </div>
    {/each}

</div>

<style>
    .card_container {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        background-color: #f9f9f9;
        width: 100%;
        max-width: 600px;
    }

    .card_row {
        display: flex;
        justify-content: space-between;
        padding: 0.25rem 0;
    }

    .label {
        font-weight: bold;
        color: #333;
    }

    .value {
        color: #555;
        text-align: right;
    }
</style>
