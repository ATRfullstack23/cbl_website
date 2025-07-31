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


<div bind:this={container_element} data-custom_element_id="{unique_id}" data-unique_id="{unique_id}" data- class="form_view_custom_element stat_card">

    <div class="stat_card_number">{value_text}</div>
    <div class="stat_card_text">{label_text}</div>

</div>

<style>

    .stat_card{
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        height: fit-content;
    }
    .stat_card_number{
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    .stat_card_text{
        color: #6b7280;
        font-size: 0.875rem;
        font-weight: 500;
    }

</style>