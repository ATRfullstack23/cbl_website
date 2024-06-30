<svelte:options accessors/>

<script>
    import AddNewDashboardPopup from '$lib/dashboard_utils/AddNewDashboardPopup.svelte';
    import Chart from 'chart.js/auto'
    import {onMount, setContext, tick} from 'svelte'
    // import chart_data from '$lib/dashboard_utils/chart_data.json'
    import DashboardFilterItem from "$lib/dashboard_utils/DashboardFilterItem.svelte";
    import {get_dashboard_report_item_data_from_server} from "$lib/dashboard_utils/DashboardHelper.js";
    import DashboardItem from "$lib/dashboard_utils/DashboardItem.svelte";

    export let dashboard_configuration;
    export let id = dashboard_configuration.id;
    export let unique_id = dashboard_configuration.unique_id;
    export let display_name = dashboard_configuration.display_name;

    let chart_data = dashboard_configuration.dashboard_items.filter(item => item.config.type !== "filter");

    const latest_filter_values_map = {};
    // setContext('latest_filter_values_map', latest_filter_values_map);

    function create_chart_reports() {
        if(!dashboard_configuration.dashboard_items.length){
            return;
        }

        filter_items = dashboard_configuration.dashboard_items.filter(item => item.config.type === "filter");

        report_items = dashboard_configuration.dashboard_items.filter(item => item.config.type === "report_item");
        // for(let chart of report_items.filter(data => data.type == "chart")){
        //     new Chart(chart.chart_instance,{
        //         type: chart.chart_type,
        //         data: chart.data,
        //         options: chart.options
        //     })
        // }
    }


    let is_hidden = true;
    let shall_initialize = false;
    export function show(){
        is_hidden = false;
        if(!shall_initialize){
            shall_initialize = true;
            create_chart_reports();

            tick().then(()=>{
                refresh_data_of_all_report_items().then(()=>{});
                // create_chart_reports()
            });

        }
    }

    export function hide(){
        is_hidden = true;
    }

    export async function refresh_data() {
        window._filter_instances = filter_instances;
        window._filter_items = filter_items;
        window._report_item_instances = report_item_instances;
        window._dashboard_items = dashboard_configuration.dashboard_items;
        console.log('getting report items data : ', report_item_instances, latest_filter_values_map);
    }


    let filter_items = [];
    let report_items = [];
    let filter_instances = {};
    let report_item_instances = {};
    let show_add_new_popup = false;
    onMount(async () => {
        // console.log('dashboard_configuration', dashboard_configuration);
    });


    async function handle_filter_value_changed(single_filter_config, new_value_obj) {
        console.log('filter changed', single_filter_config)
        latest_filter_values_map[single_filter_config.config.unique_id] = new_value_obj;
        await refresh_data_of_all_report_items();
    }

    async function refresh_data_of_all_report_items(){
        for(let item_id of Object.keys(report_item_instances)){
            let report_item_instance = report_item_instances[item_id];
            await report_item_instance.refresh_data(latest_filter_values_map);
        }
        report_items = report_items;
    }


</script>

<div class="chart_container single_dashboard_container"  class:hidden={is_hidden}>
    <div class="add_new_dashboard">
        <button on:click={() => show_add_new_popup = true}>Add New Dashboard</button>
        <button class="filter_button"><i class="fa-solid fa-filter"></i>Add Filter</button>
    </div>

    {#if shall_initialize}

        <div class="dashboard_filters">
            {#each filter_items as single_filter_config}
                <DashboardFilterItem dashboard_id="{id}"
                                     dashboard_item_config="{single_filter_config}"
                                     on:filter_value_changed={async (evt)=>{await handle_filter_value_changed(single_filter_config, evt.detail);}}
                    bind:this={filter_instances[single_filter_config.id]}/>
            {/each}
        </div>

        <div class="dashboard_report_items">

            {#each report_items as single_report_item_config}
                <DashboardItem dashboard_id="{id}"
                               bind:this={report_item_instances[single_report_item_config.id]}
                               dashboard_item_config="{single_report_item_config}"/>
            {/each}

        </div>


    {/if}


</div>
{#if show_add_new_popup}
    <AddNewDashboardPopup on:cancel={() => show_add_new_popup = false}/>
{/if}

<style>
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #9c9b9b;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #6d6c6c;

    }

    .single_dashboard_container.hidden{
        display: none;
    }

    .add_new_dashboard{
        display: flex;
        width: 100%;
        justify-content: flex-end;
        align-items: center;
        padding: 15px 20px 15px 0;
    }
    .add_new_dashboard button{
        background-color: #fff;
        border: 1px solid #6e6e6e;
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 15px;
        transition: all 0.3s ease;
    }
    .add_new_dashboard button:hover{
        color: #fff;
        background-color: #000;
    }
    .filter_button{
        margin-left: 10px;
    }
    .filter_button i{
        padding-right: 5px;
    }

    .dashboard_report_items{
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
    }
</style>