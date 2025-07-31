<svelte:options accessors/>

<script>

    import {onMount} from "svelte";

    export let config;
    export let container_element;
    export let container_element_jquery;

    // export let data;

    export let unique_id;

    let title_text;
    let caption_text;

    export function handle_config_updated(new_config){
        config = new_config;
        parse_config();
    }

    function parse_config(){
        title_text = config.title_text || 'Title';
        caption_text = config.caption_text || 'Caption';
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });

</script>


<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" data- class="form_view_custom_element title_with_caption">

    <h4 class="title_text primary_display_name">{title_text}</h4>
    <p class="caption_text">{caption_text}</p>

</div>

<style>

    .title_with_caption{
        padding: 10px;
    }
    .title_text{
        font-size: 20px;
    }

</style>