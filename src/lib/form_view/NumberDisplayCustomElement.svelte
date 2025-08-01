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

    let text_content;
    let number_value_formatted = '-';
    let number_value = null;

    export function handle_config_updated(new_config){
        config = new_config;
        parse_config();
    }

    export function handle_customizations_updated(new_customizations){
        customizations = new_customizations;
    }


    export function handle_formview_data_changed(new_data_row){
        data_row = new_data_row;
    }

    function parse_config(){
        data_row = data_row || {};
        text_content = config.text_content || 'Title';
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });

</script>


<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" data- class="form_view_custom_element title_with_caption">

    <h4 class="title_text primary_display_name">{text_content}</h4>
    <p class="caption_text">{number_value_formatted}</p>

</div>

<style>

    .title_with_caption{
        padding: 10px;
    }
    .title_text{
        font-size: 20px;
    }

</style>