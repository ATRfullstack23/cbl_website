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
    let title_font_size;
    let caption_font_size;
    let content_alignment = 'left';

    export function handle_config_updated(new_config){
        config = new_config;
        parse_config();
    }

    export function handle_customizations_updated(new_customizations){
        customizations = new_customizations;
    }

    function parse_config(){
        title_text = config.title_text || 'Title';
        title_font_size = config.title_font_size || '20px';
        caption_text = config.caption_text || 'Caption';
        caption_font_size = config.caption_font_size || '14px';
        content_alignment = config.content_alignment || 'left';

        if (title_font_size){
            title_font_size = title_font_size.replace(/px/gi, '');
        }
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });

</script>


<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" data- class="form_view_custom_element title_with_caption {content_alignment}" style="--title_font_size: {title_font_size}px; --caption_font_size: {caption_font_size}px;">

    <h4 class="title_text primary_display_name">{title_text}</h4>
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
    .title_text{
        font-size: 20px;
        color: var(--color);
        font-size: var(--title_font_size);
    }
    .caption_text{
        color: var(--color);
        font-size: var(--caption_font_size);
    }

</style>