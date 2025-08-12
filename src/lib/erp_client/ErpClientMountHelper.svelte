
<script>

    import {onMount, tick} from "svelte";
    import ButtonElement from "$lib/button_manager/ButtonElement.svelte";
    import ButtonAdvancedSettingsPopup from "$lib/button_manager/ButtonAdvancedSettingsPopup.svelte";
    import MainNavigationEditorPopup from "$lib/erp_client/MainNavigationEditorPopup.svelte";


    let shall_show_edit_main_navigation_popup;
    let to_edit__existing_config;
    let to_edit__erp_instance;

    export function show_edit_main_navigation_popup(erp_instance) {
        to_edit__erp_instance = erp_instance;
        to_edit__existing_config = erp_instance.latest_navigation_configuration;

        console.log('show_edit_main_navigation_popup existing_navigation_config', to_edit__existing_config)

        shall_show_edit_main_navigation_popup = true;
    }

    function handle_edit_main_navigation_popup_confirm(evt) {
        to_edit__erp_instance.handle_main_navigation_config_updated(evt.detail.new_config);

        to_edit__erp_instance = null;
        shall_show_edit_main_navigation_popup = false;
    }

    function handle_edit_main_navigation_popup_cancel() {
        to_edit__erp_instance = null;
        shall_show_edit_main_navigation_popup = false;
    }

    onMount(()=>{
        window.show_edit_main_navigation_popup = show_edit_main_navigation_popup;
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



{#if shall_show_edit_main_navigation_popup}
    <MainNavigationEditorPopup
            erp_instance="{to_edit__erp_instance}"
            config="{to_edit__existing_config}"
            on:confirm={handle_edit_main_navigation_popup_confirm} on:cancel={handle_edit_main_navigation_popup_cancel}/>
{/if}



<div style="display: none;" bind:this={mount_helper_container} class="button_manager_mount_helper">
    <!--    <TitleWithCaptionCustomElement/>-->

</div>


<style>

</style>

