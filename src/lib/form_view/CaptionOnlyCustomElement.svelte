<svelte:options accessors/>

<script>

    import {onMount} from "svelte";

    export let config;
    export let container_element;
    export let container_element_jquery;
    export let customizations;

    // export let data;

    export let unique_id;

    let title_text;
    let caption_text;
    let content_alignment = 'left';

    export function handle_config_updated(new_config){
        config = new_config;
        parse_config();
    }

    export function handle_customizations_updated(new_customizations){
        customizations = new_customizations;
    }

    function parse_config(){
        caption_text = config.caption_text || 'Caption';
        content_alignment = config.content_alignment || 'left';
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });

</script>


<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" data- class="form_view_custom_element title_with_caption {content_alignment}">
    <p class="caption_text">{caption_text}</p>

</div>

<style>
    .title_with_caption{
        padding-right: 8px;
    }
    .title_with_caption.right{
        text-align: right;
    }
    .title_with_caption.center{
        text-align: center;
    }
    .title_with_caption{
        padding: 10px;
        color: var(--color);
    }
    .caption_text{
        color: var(--color);
    }

</style>