<script>
    import CardReport from "./CardReport.svelte";
    import ChartReport from "./ChartReport.svelte";
    import ListReport from "./ListReport.svelte";
    import TableReport from "./TableReport.svelte";
    import {get_dashboard_report_item_data_from_server} from "$lib/dashboard_utils/DashboardHelper.js";
    import {getContext} from "svelte";

    export let dashboard_item_config;
    let config = dashboard_item_config.config;


    let report_item_instance;



    export async function refresh_data(latest_filter_values_map){
        let api_result = await get_dashboard_report_item_data_from_server(dashboard_item_config, latest_filter_values_map);
        await report_item_instance.on_new_data_received(api_result);
    }


</script>

<div class="single_dashboard_report_item" style="width:{config.width};min-height:{config.height}px;">
    {#if config.report_item_type == "card"}
        <CardReport bind:this={report_item_instance} dashboard_item_config="{dashboard_item_config}" item={config}/>
    {:else if config.report_item_type == "chart"}
        <ChartReport bind:this={report_item_instance} dashboard_item_config="{dashboard_item_config}" item={config}/>
    {:else if config.report_item_type == "list"}
        <ListReport bind:this={report_item_instance} dashboard_item_config="{dashboard_item_config}" list={config}/>
    {:else if config.report_item_type == "table"}
        <TableReport bind:this={report_item_instance} dashboard_item_config="{dashboard_item_config}" table={config}/>
    {/if}
</div>

<style>
    .single_dashboard_report_item{
        background-color: #fff;
        border-radius: 15px;
        border: 1px solid crimson;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>