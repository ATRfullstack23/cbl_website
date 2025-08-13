<script>

    import {onMount} from "svelte";

    export let config;
    export let container_element;
    export let container_element_jquery;
    export let customizations;

    // export let data;

    export let unique_id;

    export let data_row;
    let icon_image = "❤️";
    let header_text = "Doppler";
    let caption_text = "Secrets management";

    export function handle_config_updated(new_config){
        console.log('handle_config_updated', new_config)
        config = new_config;
        parse_config();
    }

    export function handle_customizations_updated(new_customizations){
        customizations = new_customizations;
    }


    export function handle_grid_view_data_changed(new_data_row){
        data_row = new_data_row;
    }

    function parse_config(){
        icon_image = config?.icon_image
        header_text = config?.header_text
        caption_text = config?.caption_text
        data_row = data_row || {};
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });



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
        return column_id?.toUpperCase() || '';
    }

</script>

<div class="container-section">
    <span>{icon_image}</span>
    <div class="text">
        <h2>{header_text}</h2>
        <p>{caption_text}</p>
    </div>
</div>

<style>
    .container-section {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .text h2 {
        font-size: 16px;
        margin: 0;
        font-weight: 600;
        color: #000;
    }

    .text p {
        font-size: 12px;
        margin: 0;
        color: #666;
    }
</style>
