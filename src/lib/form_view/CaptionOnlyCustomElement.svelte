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
    let caption_font_size;

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
        caption_font_size = config.caption_font_size || '14';
        if(caption_font_size){
            caption_font_size = caption_font_size.replace(/px/gi, '');
        }
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });

</script>


<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" data- class="form_view_custom_element caption_only {content_alignment}" style="--caption_font_size: {caption_font_size}px;">
    <p class="caption_text">{caption_text}</p>

</div>

<style>
    .caption_only{
        padding-right: 8px;
    }
    .caption_only.right{
        text-align: right;
    }
    .caption_only.center{
        text-align: center;
    }
    .caption_only{
        padding: 10px;
        color: var(--color);
    }
    .caption_text{
        color: var(--color);
        font-size: var(--caption_font_size);
    }

</style>