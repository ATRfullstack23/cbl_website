<svelte:options accessors/>

<script>

    import {onMount} from "svelte";

    export let button_info;
    export let context_type;

    export let container_element;
    export let container_element_jquery;

    // export let button_manager;
    export let advanced_settings = {};


    export let unique_id;

    unique_id = button_info.unique_id;


    let display_name = button_info.display_name;
    let emoji_icon;
    let button_style = 'default_primary';

    export function handle_advanced_settings_updated(new_settings) {
        advanced_settings = new_settings;
        parse_advanced_settings_updated();
    }

    function parse_advanced_settings_updated() {
        display_name = advanced_settings.display_name || button_info.displayName;
        emoji_icon = advanced_settings.emoji_icon || null;
        button_style = advanced_settings.button_style || 'default_primary';
    }

    parse_advanced_settings_updated();

    onMount(()=>{
        container_element_jquery = jQuery(container_element);
    });

</script>



<button bind:this={container_element}
        class="logic_button"
        class:default_primary={button_style === 'default_primary'}
        class:default_positive={button_style === 'default_positive'}
        class:default_neutral={button_style === 'default_neutral'}
        class:default_negative={button_style === 'default_negative'}
        data-button_id="{button_info.id}" data-context_type="{context_type}" data-button_unique_id="{unique_id}" data-help="{button_info.helpMessage}">
    {#if emoji_icon}
        <span class="emoji_icon">{emoji_icon}</span>
    {/if}
    <span class="button_display_name">{display_name}</span>
</button>




<style>

    .logic_button{
        outline: none;
        /* background-color: #525789; */
        background-color: #2d3e50;
        background-image: -webkit-linear-gradient(hsla(0,0%,100%,.05), hsla(0,0%,0%,.1));
        background-image: -moz-linear-gradient(hsla(0,0%,100%,.05), hsla(0,0%,0%,.1));
        background-image: -ms-linear-gradient(hsla(0,0%,100%,.05), hsla(0,0%,0%,.1));
        background-image: linear-gradient(hsla(0,0%,100%,.05), hsla(0,0%,0%,.1));
        border: none;
        border-radius: .5em;
        margin: 3px;
        /* box-shadow: inset 0 0 0 1px hsla(0,0%,0%,.2), inset 0 2px 0 hsla(0,0%,100%,.1), inset 0 1.2em 0 hsla(0,0%,100%,0.1), inset 0 -.2em 0 hsla(0,0%,100%,.1), inset 0 -.25em 0 hsla(0,0%,0%,.25), 0 .25em .25em hsla(0,0%,0%,.05); */
        color: #FFF;
        cursor: pointer;
        /*font-weight: bold;*/
        padding: .5em 1.5em .75em;
        /*position: relative;*/
        text-decoration: none;
        text-shadow: 0 1px 1px hsla(0,0%,100%,.25);
        vertical-align: middle;
        border-radius: .25em;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-weight: 300;
        min-width: 80px;
        /*padding-left: 20px;*/
        /*padding-right: 20px;*/
        /*padding-top: 8px;*/
        /*padding-bottom: 8px;*/
        /*border: 1px solid transparent;*/
        background-image: none;
        padding: 0.5rem 0.6rem;
        transition: box-shadow 100ms ease;
    }


    .logic_button:hover{
        box-shadow: -1px -1px 5px 0px #ffffff, 2px 1px 11px 0px rgb(0 0 0 / 12%);
    }

    .logic_button:active{
        box-shadow: none;
    }



    .logic_button.default_primary{
        background-color: var(--light_theme_btn_bg_color__default_primary);
        color: var(--light_theme_btn_text_color__default_primary);
        border: 1px solid #e0e0e0;
    }


    .logic_button.default_positive{
        background-color: var(--light_theme_btn_bg_color__default_positive);
        color: var(--light_theme_btn_text_color__default_positive);
        border: 1px solid #e0e0e0;
    }

    .logic_button.default_neutral{
        background-color: var(--light_theme_btn_bg_color__default_neutral);
        color: var(--light_theme_btn_text_color__default_neutral);
        border: 1px solid #e0e0e0;
    }

    .logic_button.default_negative{
        background-color: var(--light_theme_btn_bg_color__default_negative);
        color: var(--light_theme_btn_text_color__default_negative);
        border: 1px solid #e0e0e0;
    }


</style>


