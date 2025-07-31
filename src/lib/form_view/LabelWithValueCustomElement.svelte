<svelte:options accessors/>

<script>

    import {onMount} from "svelte";

    export let config;
    export let container_element;
    export let container_element_jquery;

    export let data;

    export let unique_id;

    let label_text;
    let value_text;

    export function handle_config_updated(new_config){
        config = new_config;
        parse_config();
    }

    function parse_config(){
        label_text = config.label_text || 'Title';
        value_text = config.value_text || 'Caption';
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });

</script>


<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" data- class="form_view_custom_element title_with_caption">

    <label class="title_text primary_display_name">{label_text}</label>
    <span class="caption_text">{value_text}</span>

</div>

<style>

    .title_with_caption{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f8fafc;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        gap: 30px;
        height: max-content;
        min-width: 200px;
    }
    .title_text,.caption_text{
        font-weight: 600;
        font-size: 0.875rem;
    }

</style>