
<script>

    import {onMount, tick} from "svelte";
    import ButtonElement from "$lib/button_manager/ButtonElement.svelte";
    import ButtonAdvancedSettingsPopup from "$lib/button_manager/ButtonAdvancedSettingsPopup.svelte";


    let shall_show_button_advanced_settings_popup;
    let to_edit__button_advanced_settings;
    let to_edit__button_info;

    export function show_edit_button_advanced_settings_popup(button_info, button_advanced_settings) {
        to_edit__button_info = button_info;
        to_edit__button_advanced_settings = button_advanced_settings;

        console.log('show_card_view_data_mapping_config_popup to_edit__button_info', to_edit__button_info)
        console.log('show_card_view_data_mapping_config_popup to_edit__button_advanced_settings', to_edit__button_advanced_settings)

        shall_show_button_advanced_settings_popup = true;
    }

    function handle_button_advanced_settings_popup_confirm(evt) {
        to_edit__button_info.buttonManager.handle_button_advanced_settings_updated(to_edit__button_info, evt.detail.new_config);

        to_edit__button_info = null;
        shall_show_button_advanced_settings_popup = false;
    }

    function handle_button_advanced_settings_popup_cancel() {
        to_edit__button_info = null;
        shall_show_button_advanced_settings_popup = false;
    }

    onMount(()=>{
        window.show_edit_button_advanced_settings_popup = show_edit_button_advanced_settings_popup;
        window.mount_button_element = mount_button_element;
    });


    let mount_helper_container;

    export function mount_button_element(button_info, button_advanced_settings, context_type) {

        let svelte_instance ;

        const props = {
            // button_manager: button_manager,
            button_info: button_info,
            advanced_settings: button_advanced_settings,
            context_type: context_type,
            unique_id: button_info.unique_id,
            config: button_info.config,
        };
        // need to pass customizations as well

        svelte_instance = new ButtonElement({
            target: mount_helper_container,
            props: props,
        });

        // await tick();

        return svelte_instance;
    }

</script>



{#if shall_show_button_advanced_settings_popup}
    <ButtonAdvancedSettingsPopup
            button_info="{to_edit__button_info}"
            button_advanced_settings="{to_edit__button_advanced_settings}"
            on:confirm={handle_button_advanced_settings_popup_confirm} on:cancel={handle_button_advanced_settings_popup_cancel}/>
{/if}



<div style="display: none;" bind:this={mount_helper_container} class="button_manager_mount_helper">
    <!--    <TitleWithCaptionCustomElement/>-->

</div>


<style>

</style>

