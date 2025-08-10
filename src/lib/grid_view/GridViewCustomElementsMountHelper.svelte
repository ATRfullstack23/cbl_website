
<script>

    import {onMount, tick} from "svelte";
    import CustomElementCustomizationPopup from "$lib/grid_view/CustomElementCustomizationPopup.svelte";
    import NormalElementCustomizationPopup from "$lib/grid_view/NormalElementCustomizationPopup.svelte";
    import CurrencyAmountDisplayCustomElement from "$lib/grid_view/CurrencyAmountDisplayCustomElement.svelte";
    import InlineTableDisplayCustomElement from "$lib/grid_view/InlineTableDisplayCustomElement.svelte";

    export async function mount_grid_custom_element(grid, target_container_element, data_row, element_type, outer_config) {
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
            data_row: data_row
        };
        // need to pass customizations as well

        switch (element_type) {
            case Grid.CUSTOM_ELEMENTS.inline_table_display.id:
                svelte_instance = new InlineTableDisplayCustomElement({
                    target: target_container_element,
                    props : props,
                });
                break;
            // case Grid.CUSTOM_ELEMENTS.currency_amount_display.id:
            //     svelte_instance = new CurrencyAmountDisplayCustomElement({
            //         target: target_container_element,
            //         props : props,
            //     });
            //     break;
        }

        await tick();

        return svelte_instance;
    }


    let shall_show_custom_element_customization_popup;
    let to_edit__custom_element_id;
    let to_edit__custom_element_type;
    let to_edit__custom_element_existing_config;
    let to_edit__grid;

    export function show_grid_custom_element_customization_popup(grid, custom_element_id, custom_element_type, custom_element_existing_config) {
        to_edit__grid = grid;
        to_edit__custom_element_id = custom_element_id;
        to_edit__custom_element_type = custom_element_type;
        to_edit__custom_element_existing_config = custom_element_existing_config;

        console.log('show_grid_custom_element_customization_popup to_edit__grid', to_edit__grid)
        console.log('show_grid_custom_element_customization_popup custom_element_id', custom_element_id)

        shall_show_custom_element_customization_popup = true;
    }

    function handle_custom_element_customization_popup_confirm(evt) {

        to_edit__grid.handle_custom_grid_element_config_updated(to_edit__custom_element_id, evt.detail.new_config);

        to_edit__grid = null;
        shall_show_custom_element_customization_popup = false;
    }

    function handle_custom_element_customization_popup_cancel() {
        to_edit__grid = null;
        shall_show_custom_element_customization_popup = false;
    }

    onMount(()=>{
       window.mount_grid_custom_element = mount_grid_custom_element;
       window.show_grid_custom_element_customization_popup = show_grid_custom_element_customization_popup;

       window.show_grid_normal_element_customization_popup = show_grid_normal_element_customization_popup;
    });






    let shall_show_normal_element_customization_popup = false;
    let to_edit__column_info, to_edit__custom_element_info, to_edit__column_existing_config;

    export function show_grid_normal_element_customization_popup(grid, column_info, custom_element_info, existing_config) {
        to_edit__grid = grid;
        to_edit__column_info = column_info;
        to_edit__custom_element_info = custom_element_info;
        to_edit__column_existing_config = existing_config;

        shall_show_normal_element_customization_popup = true;
    }

    function handle_normal_element_customization_popup_confirm(evt) {

        to_edit__grid.handle_normal_grid_element_config_updated(to_edit__column_info, to_edit__custom_element_info, evt.detail.new_config);

        to_edit__grid = null;
        to_edit__column_info = null;
        to_edit__custom_element_info = null;
        shall_show_normal_element_customization_popup = false;
    }

    function handle_normal_element_customization_popup_cancel() {
        to_edit__grid = null;
        shall_show_normal_element_customization_popup = false;
        to_edit__column_info = null;
        to_edit__custom_element_info = null;
    }

</script>



{#if shall_show_normal_element_customization_popup}
    <NormalElementCustomizationPopup
            grid="{to_edit__grid}"
            column_info="{to_edit__column_info}"
            column_existing_config="{to_edit__column_existing_config}"
            on:confirm={handle_normal_element_customization_popup_confirm} on:cancel={handle_normal_element_customization_popup_cancel}/>
{/if}


{#if shall_show_custom_element_customization_popup}
    <CustomElementCustomizationPopup
            grid="{to_edit__grid}"
            custom_element_id="{to_edit__custom_element_id}"
            custom_element_type="{to_edit__custom_element_type}"
            custom_element_existing_config="{to_edit__custom_element_existing_config}"
            on:confirm={handle_custom_element_customization_popup_confirm} on:cancel={handle_custom_element_customization_popup_cancel}/>
{/if}

<div style="display: none;" class="grid_custom_elements_mount_helper">
<!--    <TitleWithCaptionCustomElement/>-->

</div>


<style>

</style>

