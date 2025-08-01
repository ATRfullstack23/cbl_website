
<script>

    import TitleWithCaptionCustomElement from "$lib/form_view/TitleWithCaptionCustomElement.svelte";
    import CaptionOnlyCustomElement from "$lib/form_view/CaptionOnlyCustomElement.svelte";
    import LabelWithValueCustomElement from "$lib/form_view/LabelWithValueCustomElement.svelte";
    import StatCardDisplayCustomElement from "$lib/form_view/StatCardDisplayCustomElement.svelte";
    import {onMount, tick} from "svelte";
    import CustomElementCustomizationPopup from "$lib/form_view/CustomElementCustomizationPopup.svelte";
    import NormalElementCustomizationPopup from "$lib/form_view/NormalElementCustomizationPopup.svelte";
    import NumberDisplayCustomElement from "$lib/form_view/NumberDisplayCustomElement.svelte";

    export async function mount_form_view_custom_element(form_view, target_container_element, element_type, outer_config) {
        // const target = document.querySelector(target_selector);
        if (!target_container_element) {
            console.error("Target element not found:", target_container_element);
            return;
        }
        if(target_container_element.get){
            target_container_element = target_container_element.get(0);
        }

        // Optional: clear previous content
        // target_container_element.innerHTML = '';
        let svelte_instance ;

        const props = {
            unique_id: outer_config.unique_id,
            config: outer_config.config,
        };
        // need to pass customizations as well

        switch (element_type) {
            case FormView.CUSTOM_ELEMENTS.title_with_caption.id:
                svelte_instance = new TitleWithCaptionCustomElement({
                    target: target_container_element,
                    props : props,
                });
                break;
            case FormView.CUSTOM_ELEMENTS.caption_only.id:
                svelte_instance = new CaptionOnlyCustomElement({
                    target: target_container_element,
                    props : props,
                });
                break;
            case FormView.CUSTOM_ELEMENTS.label_with_value.id:
                svelte_instance = new LabelWithValueCustomElement({
                    target: target_container_element,
                    props : props,
                });
                break;
            case FormView.CUSTOM_ELEMENTS.stat_card_with_value.id:
                svelte_instance = new StatCardDisplayCustomElement({
                    target: target_container_element,
                    props : props,
                });
            case FormView.CUSTOM_ELEMENTS.number_display.id:
                svelte_instance = new NumberDisplayCustomElement({
                    target: target_container_element,
                    props : props,
                });
                break;
        }

        await tick();

        return svelte_instance;
    }


    let shall_show_custom_element_customization_popup;
    let to_edit__custom_element_id;
    let to_edit__custom_element_type;
    let to_edit__custom_element_existing_config;
    let to_edit__form_view;

    export function show_form_view_custom_element_customization_popup(form_view, custom_element_id, custom_element_type, custom_element_existing_config) {
        to_edit__form_view = form_view;
        to_edit__custom_element_id = custom_element_id;
        to_edit__custom_element_type = custom_element_type;
        to_edit__custom_element_existing_config = custom_element_existing_config;

        console.log('show_form_view_custom_element_customization_popup to_edit__form_view', to_edit__form_view)
        console.log('show_form_view_custom_element_customization_popup custom_element_id', custom_element_id)

        shall_show_custom_element_customization_popup = true;
    }

    function handle_custom_element_customization_popup_confirm(evt) {

        to_edit__form_view.handle_custom_form_view_element_config_updated(to_edit__custom_element_id, evt.detail.new_config);

        to_edit__form_view = null;
        shall_show_custom_element_customization_popup = false;
    }

    function handle_custom_element_customization_popup_cancel() {
        to_edit__form_view = null;
        shall_show_custom_element_customization_popup = false;
    }

    onMount(()=>{
       window.mount_form_view_custom_element = mount_form_view_custom_element;
       window.show_form_view_custom_element_customization_popup = show_form_view_custom_element_customization_popup;

       window.show_form_view_normal_element_customization_popup = show_form_view_normal_element_customization_popup;
    });






    let shall_show_normal_element_customization_popup = false;
    let to_edit__column_info, to_edit__custom_element_info, to_edit__column_existing_config;

    export function show_form_view_normal_element_customization_popup(form_view, column_info, custom_element_info, existing_config) {
        to_edit__form_view = form_view;
        to_edit__column_info = column_info;
        to_edit__custom_element_info = custom_element_info;
        to_edit__column_existing_config = existing_config;

        shall_show_normal_element_customization_popup = true;
    }

    function handle_normal_element_customization_popup_confirm(evt) {

        to_edit__form_view.handle_normal_form_view_element_config_updated(to_edit__column_info, to_edit__custom_element_info, evt.detail.new_config);

        to_edit__form_view = null;
        to_edit__column_info = null;
        to_edit__custom_element_info = null;
        shall_show_normal_element_customization_popup = false;
    }

    function handle_normal_element_customization_popup_cancel() {
        to_edit__form_view = null;
        shall_show_normal_element_customization_popup = false;
        to_edit__column_info = null;
        to_edit__custom_element_info = null;
    }

</script>



{#if shall_show_normal_element_customization_popup}
    <NormalElementCustomizationPopup
            form_view="{to_edit__form_view}"
            column_info="{to_edit__column_info}"
            column_existing_config="{to_edit__column_existing_config}"
            on:confirm={handle_normal_element_customization_popup_confirm} on:cancel={handle_normal_element_customization_popup_cancel}/>
{/if}


{#if shall_show_custom_element_customization_popup}
    <CustomElementCustomizationPopup
            form_view="{to_edit__form_view}"
            custom_element_id="{to_edit__custom_element_id}"
            custom_element_type="{to_edit__custom_element_type}"
            custom_element_existing_config="{to_edit__custom_element_existing_config}"
            on:confirm={handle_custom_element_customization_popup_confirm} on:cancel={handle_custom_element_customization_popup_cancel}/>
{/if}

<div style="display: none;" class="form_view_custom_elements_mount_helper">
<!--    <TitleWithCaptionCustomElement/>-->

</div>


<style>

</style>

