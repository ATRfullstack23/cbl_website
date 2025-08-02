
<script>

    import {onMount, tick} from "svelte";
    import CardViewDataMappingPopup from "$lib/card_view/CardViewDataMappingPopup.svelte";


    let shall_show_card_view_data_mapping_popup;
    let to_edit__data_mapping_existing_config;
    let to_edit__card_view_type;
    let to_edit__sub_module;

    export function show_card_view_data_mapping_config_popup(sub_module, card_view_type, data_mapping_existing_config) {
        to_edit__sub_module = sub_module;
        to_edit__card_view_type = card_view_type;
        to_edit__data_mapping_existing_config = data_mapping_existing_config;

        console.log('show_form_view_custom_element_customization_popup to_edit__sub_module', to_edit__sub_module)
        console.log('show_form_view_custom_element_customization_popup data_mapping_existing_config', data_mapping_existing_config)

        shall_show_card_view_data_mapping_popup = true;
    }

    function handle_card_view_data_mapping_config_popup_confirm(evt) {
        to_edit__sub_module.handle_card_view_data_mapping_config_updated(to_edit__card_view_type, evt.detail.new_config);

        to_edit__sub_module = null;
        shall_show_card_view_data_mapping_popup = false;
    }

    function handle_card_view_data_mapping_config_popup_cancel() {
        to_edit__sub_module = null;
        shall_show_card_view_data_mapping_popup = false;
    }

    onMount(()=>{
        window.show_card_view_data_mapping_config_popup = show_card_view_data_mapping_config_popup;
    });


</script>



{#if shall_show_card_view_data_mapping_popup}
    <CardViewDataMappingPopup
            sub_module="{to_edit__sub_module}"
            card_view_type="{to_edit__card_view_type}"
            card_view_existing_data_mapping="{to_edit__data_mapping_existing_config}"
            on:confirm={handle_card_view_data_mapping_config_popup_confirm} on:cancel={handle_card_view_data_mapping_config_popup_cancel}/>
{/if}



<div style="display: none;" class="card_view_mount_helper">
    <!--    <TitleWithCaptionCustomElement/>-->

</div>


<style>

</style>

