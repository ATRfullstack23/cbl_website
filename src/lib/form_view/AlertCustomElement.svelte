<svelte:options accessors/>
<script>
    import {onMount} from "svelte";

    export let config;
    export let container_element;
    export let container_element_jquery;
    export let customizations;

    // export let data;

    export let unique_id;


    let caption_text = 'Sample alert message';
    let alert_icon = '⚠️';
    let font_size = '14';
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
        font_size = config.font_size || '14px';
        content_alignment = config.content_alignment || 'left';
        alert_icon = config.alert_icon || '⚠️';

        if (font_size){
            font_size = font_size.replace(/px/gi, '');
        }
    }

    parse_config();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });

</script>

<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" style="--font_size:{font_size}; --content_alignment:{content_alignment}; --font_size:{font_size};" class="form_view_custom_element alert_message alert-box">
    <span class="icon">{alert_icon}</span>
    <span>{caption_text}</span>
</div>

<style>
    .alert-box {
        font-size: 14px;
        padding: 5px;
        text-align: var(--content_alignment);
    }

    .icon {
        margin-right: 3px;
        font-weight: bold;
        font-size: var(--font_size);
    }
</style>
