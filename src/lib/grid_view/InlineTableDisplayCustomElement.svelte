<svelte:options accessors/>

<script>

    import {onMount} from "svelte";

    export let config;
    export let container_element;
    export let container_element_jquery;
    export let customizations;

    // export let data;

    export let unique_id;

    export let data_row;

    let main_detail_items = [];

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
        main_detail_items = config.main_detail_items || [];
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


<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" class="grid_view_custom_element inline_table_display">

    {#each main_detail_items as item}
        <div class="contact_item">
            {#if get_column_display_name(item.item_text)}
                <span class="contact_label">{get_column_display_name(item.item_text) || ""}:</span>
            {/if}
            <span class="contact_value">{get_column_display_value(item.item_value) || ""}</span>
        </div>
    {/each}


</div>

<style>

    .inline_table_display{
        padding: 5px;
    }
    .title_text{
        font-size: 20px;
    }

</style>