
<script>

    import {onMount, tick} from "svelte";
    import ButtonElement from "$lib/button_manager/ButtonElement.svelte";
    import ButtonAdvancedSettingsPopup from "$lib/button_manager/ButtonAdvancedSettingsPopup.svelte";
    import HorizontalProfitAndLoss from "$lib/reports/custom_layouts/HorizontalProfitAndLoss.svelte";
    import AccountTypeSummary from "$lib/reports/custom_layouts/AccountTypeSummary.svelte";


    let shall_show_report_advanced_settings_popup;
    let to_edit__report_advanced_settings;
    let to_edit__report_info;

    export function show_edit_report_advanced_settings_popup(list_report_info, report_advanced_settings) {
        to_edit__report_info = list_report_info;
        to_edit__report_advanced_settings = report_advanced_settings;

        console.log('show_card_view_data_mapping_config_popup to_edit__report_info', to_edit__report_info)
        console.log('show_card_view_data_mapping_config_popup to_edit__report_advanced_settings', to_edit__report_advanced_settings)

        shall_show_report_advanced_settings_popup = true;
    }

    function handle_button_advanced_settings_popup_confirm(evt) {
        to_edit__report_info.handle_report_advanced_settings_updated(to_edit__report_info, evt.detail.new_config);

        to_edit__report_info = null;
        shall_show_report_advanced_settings_popup = false;
    }

    function handle_button_advanced_settings_popup_cancel() {
        to_edit__report_info = null;
        shall_show_report_advanced_settings_popup = false;
    }

    onMount(()=>{
        window.show_edit_report_advanced_settings_popup = show_edit_report_advanced_settings_popup;
        window.mount_custom_report_element = mount_custom_report_element;
    });


    // let mount_helper_container;

    export function mount_custom_report_element(container_element, list_report_info, report_advanced_settings, layout_type) {

        let svelte_instance ;
        if(container_element.get){
            container_element = container_element.get(0);
        }

        const props = {
            // button_manager: button_manager,
            list_report_info: list_report_info,
            advanced_settings: report_advanced_settings,
            layout_type: layout_type,
            unique_id: list_report_info.id,
            config: list_report_info.config,
        };
        // need to pass customizations as well

        switch (layout_type) {
            case 'horizontal_profit_and_loss_new':
                svelte_instance = new HorizontalProfitAndLoss({
                    target: container_element,
                    props: props,
                });
                break;
            case 'account_type_summary':
                svelte_instance = new AccountTypeSummary({
                    target: container_element,
                    props: props,
                });
                break;
        }
        
        // await tick();

        return svelte_instance;
    }

</script>


{#if shall_show_report_advanced_settings_popup}
    <ButtonAdvancedSettingsPopup
            button_info="{to_edit__button_info}"
            button_advanced_settings="{to_edit__button_advanced_settings}"
            on:confirm={handle_button_advanced_settings_popup_confirm} on:cancel={handle_button_advanced_settings_popup_cancel}/>
{/if}


<!--<div style="display: none;" bind:this={mount_helper_container} class="button_manager_mount_helper">-->
<!--    &lt;!&ndash;    <TitleWithCaptionCustomElement/>&ndash;&gt;-->

<!--</div>-->


<style>

</style>

