<script>
    import CardReport from "./CardReport.svelte";
    import ChartReport from "./ChartReport.svelte";
    import ListReport from "./ListReport.svelte";
    import TableReport from "./TableReport.svelte";
    import {get_dashboard_report_item_data_from_server} from "$lib/dashboard_utils/DashboardHelper.js";
    import {createEventDispatcher, getContext} from "svelte";

    export let dashboard_item_config;
    let config = dashboard_item_config.config;
    let dashboard_item_id = dashboard_item_config.id;
    const dispatch_event = createEventDispatcher();


    let report_item_instance;



    let latest_report_item_data;
    export async function refresh_data(latest_filter_values_map){
        latest_report_item_data = await get_dashboard_report_item_data_from_server(dashboard_item_config, latest_filter_values_map);
        await report_item_instance.on_new_data_received(latest_report_item_data);
    }

    export async function handle_primacy_action_button_click(){
        let button_info = config.primary_action_button;
        dispatch_event('primacy_action_button_click', {
            button_info,
            latest_report_item_data
        });
    }


</script>

<div class="single_dashboard_report_item"
     data-dashboard_item_id="{dashboard_item_id}"
     class:with_action_button={!!config.primary_action_button} style="width:{config.width};min-height:{config.height}px;">
    {#if config.report_item_type == "card"}
        <CardReport bind:this={report_item_instance} dashboard_item_config="{dashboard_item_config}" item={config}/>
    {:else if config.report_item_type == "chart"}
        <ChartReport bind:this={report_item_instance} dashboard_item_config="{dashboard_item_config}" item={config}/>
    {:else if config.report_item_type == "list"}
        <ListReport bind:this={report_item_instance} dashboard_item_config="{dashboard_item_config}" list={config}/>
    {:else if config.report_item_type == "table"}
        <TableReport bind:this={report_item_instance} dashboard_item_config="{dashboard_item_config}" table={config}/>
    {/if}

    {#if config.primary_action_button}
        <button class="action_button" on:click={handle_primacy_action_button_click}>
            <span>{config.primary_action_button.text}</span>
            <span class="fa fa-icon fa-arrow-right"></span>
        </button>
    {/if}
</div>

<style>
    .single_dashboard_report_item{
        background-color: #fff;
        border-radius: 15px;
        border: 1px solid #2623383b;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .single_dashboard_report_item.with_action_button {
        padding-bottom: 30px;
    }

    button.action_button:hover {
        opacity: 1;
    }

    button.action_button {
        position: absolute;
        opacity: 0.80;
        bottom: 5px;
        right: 10px;
        background: transparent;
        color: black;
        font-weight: bold;
    }

</style>