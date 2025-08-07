
<script>

    import {onMount, tick} from "svelte";
    import ButtonElement from "$lib/button_manager/ButtonElement.svelte";
    import ButtonAdvancedSettingsPopup from "$lib/button_manager/ButtonAdvancedSettingsPopup.svelte";
    import ChildWindowElement from "$lib/child_window/ChildWindowElement.svelte";
    import ChildWindowAdvancedSettingsPopup from "$lib/child_window/ChildWindowAdvancedSettingsPopup.svelte";


    let shall_show_child_window_advanced_settings_popup;
    let to_edit__child_window_advanced_settings;
    let to_edit__child_window_info;

    export function show_edit_child_window_advanced_settings_popup(child_window, child_window_advanced_settings) {
        to_edit__child_window_info = child_window;
        to_edit__child_window_advanced_settings = child_window_advanced_settings;
        window._cw = child_window;

        console.log('show_edit_child_window_advanced_settings_popup to_edit__child_window_info', child_window)
        console.log('show_edit_child_window_advanced_settings_popup to_edit__child_window_advanced_settings', to_edit__child_window_advanced_settings)

        shall_show_child_window_advanced_settings_popup = true;
    }

    function handle_child_window_advanced_settings_popup_confirm(evt) {
        to_edit__child_window_info.handle_child_window_advanced_settings_updated(evt.detail.new_config);

        to_edit__child_window_info = null;
        shall_show_child_window_advanced_settings_popup = false;
    }

    function handle_child_window_advanced_settings_popup_cancel() {
        to_edit__child_window_info = null;
        shall_show_child_window_advanced_settings_popup = false;
    }

    onMount(() => {
        window.show_edit_child_window_advanced_settings_popup = show_edit_child_window_advanced_settings_popup;
        window.mount_child_window_element = mount_child_window_element;
        window.mount_button_element = mount_button_element;
    });


    let mount_helper_container;

    export function mount_child_window_element(child_window_info, child_window_advanced_settings, context_type) {

        let svelte_instance;

        const props = {
            // button_manager: button_manager,
            child_window_info: child_window_info,
            advanced_settings: child_window_advanced_settings,
            context_type: context_type,
            unique_id: child_window_info.unique_id,
            config: child_window_info.config,
        };
        // need to pass customizations as well

        svelte_instance = new ChildWindowElement({
            target: mount_helper_container,
            props: props,
        });

        // await tick();

        return svelte_instance;
    }

</script>


{#if shall_show_child_window_advanced_settings_popup}
    <ChildWindowAdvancedSettingsPopup
            child_window_info="{to_edit__child_window_info}"
            child_window_advanced_settings="{to_edit__child_window_advanced_settings}"
            on:confirm={handle_child_window_advanced_settings_popup_confirm} on:cancel={handle_child_window_advanced_settings_popup_cancel}/>
{/if}


<div style="display: none;" bind:this={mount_helper_container} class="button_manager_mount_helper">
    <!--    <TitleWithCaptionCustomElement/>-->

</div>


<style>

</style>

