
<script>

    import TitleWithCaptionCustomElement from "$lib/form_view/TitleWithCaptionCustomElement.svelte";
    import {onMount} from "svelte";
    import CustomElementCustomizationPopup from "$lib/form_view/CustomElementCustomizationPopup.svelte";

    export function mount_form_view_custom_element(target_container_element, element_type, outer_config) {
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

        switch (element_type) {
            case 'title_with_caption':
                svelte_instance = new TitleWithCaptionCustomElement({
                    target: target_container_element,
                    props : {
                        unique_id: outer_config.unique_id,
                        config: outer_config.config,
                    },
                });
                break;
        }

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
    });

</script>



{#if shall_show_custom_element_customization_popup}
    <CustomElementCustomizationPopup
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

