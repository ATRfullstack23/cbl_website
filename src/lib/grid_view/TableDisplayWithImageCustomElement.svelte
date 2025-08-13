<script>

    import {onMount} from "svelte";
    import {get_column_display_value} from "$lib/card_view/CardViewUtils.js";

    export let config;
    export let submodule;
    export let grid_instance;
    export let container_element;
    export let container_element_jquery;
    export let customizations;

    // export let data;

    export let unique_id;

    export let data_row;
    let icon_image = null;
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
        parse_image_data();
    }

    function parse_config(){
        // header_text = config?.header_text
        // caption_text = config?.caption_text
        data_row = data_row || {};
        parse_image_data();
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });


    function parse_image_data() {
        icon_image = get_column_display_value({submodule, column_id: config.main_image, data_row});
        console.log('icon_image', icon_image)
    }

    //
    // function get_column_display_value(column_id){
    //     // const column_instance = get_column_instance(column_id);
    //     // let display_value = column_instance.parseDisplayValue(data_row);
    //
    //     // if(column_id === 'due_date'){
    //     //     display_value = dayjs(display_value).format('DD MMM YYYY')
    //     // }
    //     // return display_value;
    //
    //     return data_row[column_id]?.text || data_row[column_id]?.value || data_row[column_id]?.name;
    // }


    // function get_column_display_name(column_id){
    //     return column_id?.toUpperCase() || '';
    // }

</script>

<div class="container-section">
    {#if icon_image}
        <span class="main_image" class:landscape_image={icon_image.orientation==='landscape'} class:portrait_image={icon_image.orientation==='portrait'}>
            <img src="{icon_image.url}"></span>
        {:else}
        <span class="main_image">
            <img src="/ui_v2/grid_view/table_display_with_image_custom_element/default_icon.png"></span>
    {/if}
    <div class="text">
        <h2>{get_column_display_value({submodule, column_id: config.header_text, data_row}) || ""}</h2>
        <p>{get_column_display_value({submodule, column_id: config.caption_text, data_row}) || ""}</p>
    </div>
</div>

<style>
    .container-section {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .main_image{

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


    .main_image{
        & img{
            height: 50px;
            width: 50px;
            border-radius: 50%;
            max-width: none;
        }
    }
</style>
