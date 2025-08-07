
<script>

    import {onMount, tick} from "svelte";
    // import FilterElement from "$lib/filter_manager/FilterElement.svelte";
    import FilterAdvancedSettingsPopup from "$lib/filter_manager/FilterAdvancedSettingsPopup.svelte";


    let shall_show_filter_advanced_settings_popup;
    let to_edit__filter_advanced_settings;
    let to_edit__filter_info;

    export function show_edit_filter_advanced_settings_popup(filter_info, filter_advanced_settings) {
        to_edit__filter_info = filter_info;
        to_edit__filter_advanced_settings = filter_advanced_settings;

        console.log('show_card_view_data_mapping_config_popup to_edit__filter_info', to_edit__filter_info)
        console.log('show_card_view_data_mapping_config_popup to_edit__filter_advanced_settings', to_edit__filter_advanced_settings)

        shall_show_filter_advanced_settings_popup = true;
    }

    function handle_filter_advanced_settings_popup_confirm(evt) {
        to_edit__filter_info.filterManager.handle_filter_advanced_settings_updated(to_edit__filter_info, evt.detail.new_config);

        to_edit__filter_info = null;
        shall_show_filter_advanced_settings_popup = false;
    }

    function handle_filter_advanced_settings_popup_cancel() {
        to_edit__filter_info = null;
        shall_show_filter_advanced_settings_popup = false;
    }

    onMount(()=>{
        window.show_edit_filter_advanced_settings_popup = show_edit_filter_advanced_settings_popup;
        // window.mount_filter_element = mount_filter_element;
    });


    let mount_helper_container;

    // export function mount_filter_element(filter_info, filter_advanced_settings, context_type) {
    //
    //     let svelte_instance ;
    //
    //     const props = {
    //         // filter_manager: filter_manager,
    //         filter_info: filter_info,
    //         advanced_settings: filter_advanced_settings,
    //         context_type: context_type,
    //         unique_id: filter_info.unique_id,
    //         config: filter_info.config,
    //     };
    //     // need to pass customizations as well
    //
    //     svelte_instance = new FilterElement({
    //         target: mount_helper_container,
    //         props: props,
    //     });
    //
    //     // await tick();
    //
    //     return svelte_instance;
    // }

</script>



{#if shall_show_filter_advanced_settings_popup}
    <FilterAdvancedSettingsPopup
            filter_info="{to_edit__filter_info}"
            filter_advanced_settings="{to_edit__filter_advanced_settings}"
            on:confirm={handle_filter_advanced_settings_popup_confirm} on:cancel={handle_filter_advanced_settings_popup_cancel}/>
{/if}



<div style="display: none;" bind:this={mount_helper_container} class="filter_manager_mount_helper">
    <!--    <TitleWithCaptionCustomElement/>-->

</div>


<style>

</style>

