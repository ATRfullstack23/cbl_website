<svelte:options accessors/>

<script>

    import {onMount} from "svelte";

    export let child_window_info;
    export let context_type;

    export let container_element;
    export let container_element_jquery;

    // export let button_manager;
    export let advanced_settings = {};


    export let unique_id;

    unique_id = child_window_info.unique_id || child_window_info.id;


    let display_name = child_window_info.display_name;
    let emoji_icon;
    let header_text = 'Title';

    export function handle_advanced_settings_updated(new_settings) {
        advanced_settings = new_settings;
        parse_advanced_settings_updated();
    }

    function parse_advanced_settings_updated() {
        // display_name = advanced_settings.display_name || child_window_info.displayName;
        emoji_icon = advanced_settings.emoji_icon || null;
        header_text = advanced_settings.header_text || 'Title';
    }

    parse_advanced_settings_updated();

    onMount(() => {
        container_element_jquery = jQuery(container_element);
    });

    function handle_close_button_click() {
        child_window_info.close();
    }

</script>


<div bind:this={container_element}
     class="window-container window_container defaultMode"
     data-child_window_id="{unique_id}"
     data-context_type="{context_type}"
     style="transform: rotateY(0deg) scale(1, 1);">

    <div class="backdrop" on:click={handle_close_button_click}></div>

    <div class="window_main_content">


        <header>
            <div class="header_content">
                {#if emoji_icon}
                    <span class="emoji_icon">{emoji_icon}</span>
                {/if}
                <div class="header_text">{header_text}</div>
                <div class="reference-message" id="reference_message"></div>
                <div class="window-buttons" id="window_buttons">
                    <button class="child_window_close_button" title="close"><span aria-hidden="true" class="fa fa-icon fa-close"></span></button>
                </div>
            </div>
        </header>
        <div class="window-content window_content" id="window_content"></div>
        <div class="inline-mode-pointer" id="inlineModePointer">

        </div>
        <div class="inline-mode-close-button" id="inlineModeCloseButton">X</div>

    </div>
</div>


<style>

    .window-container.defaultMode {
        /* background: #ecf0f1; */
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 99999;
        /*left: var(--main_navigation_width);*/
    }

    .window-container.defaultMode .window-content {
        height: calc(100% - 35px);
        min-height: 70vh;
    }

    .window-container.defaultMode header {
        font-size: 2rem;
    }

    .window-container.defaultMode header .emoji_icon{
        font-size: 2rem;
        padding-right: 5px;
    }

    .window-container.defaultMode .reference-message {
        color: black;
        text-align: right;
        position: absolute;
        right: 80px;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .window-container.defaultMode .window-buttons {
        text-align: right;
        position: absolute;
        right: 0px;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .window-container.defaultMode .window-buttons button {
        background: transparent;
        color: black;
        font-size: 2rem;
    }

    /*.window-container.defaultMode .defaultMode .reference-message{*/
    /*    color: #fff;*/
    /*}*/


    .window_container .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        opacity: 0;
        transition: opacity 300ms ease;

        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    .window_container {
        display: none;
        align-items: center;
        justify-content: center;
    }

    .window_content{
        background-color: var(--white_theme_module_bg_color);
    }

    .window_container .window_main_content{
        position: relative;
        border: none;
        border-radius: 12px;
        padding: 0;
        max-width: 85vw;
        width: 90%;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        background: white;
        color: #333;
        overflow-x: hidden;
        z-index: 1001;
        animation: modalExit 0.3s ease forwards;
    }

    .window_container:global(.child_window_visible_with_animation), .window_container:global(.child_window_visible_without_animation), .window_container:global(.child_window_hiding_with_animation){
        display: flex;

        & .backdrop{
            opacity: 1;
        }
    }

    .window_container:global(.child_window_hiding_with_animation .window_main_content) {
        animation: modalExit 0.3s ease forwards;
    }
    .window_container:global(.child_window_hiding_with_animation .backdrop) {
        opacity: 0;
    }

    .window_container:global(.child_window_visible_with_animation .window_main_content) {
        animation: modalEnter 0.3s ease forwards;
    }


    @keyframes modalEnter {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .window_container.closing {
        animation: modalExit 0.3s ease forwards;
    }

    @keyframes modalExit {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }



    /*@keyframes backdropFade {*/
    /*    from {*/
    /*        opacity: 0;*/
    /*    }*/
    /*    to {*/
    /*        opacity: 1;*/
    /*    }*/
    /*}*/

    .header_content{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        padding: 10px 20px;
    }


</style>


