<svelte:options accessors/>

<script>
    import {createEventDispatcher, onMount} from "svelte";
    import {get_dashboard_filter_data_from_server} from './DashboardHelper.js'

    export let container_element;
    export let container;
    export let dashboard_id;
    export let dashboard_item_config;
    export let config = dashboard_item_config.config;
    let self = this;

    const dispatch_event = createEventDispatcher();

    let select_options_data = [];
    let filter_value;

    function handle_filter_value_changed() {
        dispatch_event('filter_value_changed', {
            value : filter_value
        });
    }

    async function do_initialize() {
        if(config.filter_type === 'choice'){
            select_options_data = config.data_config.items || [];
        }
        else if(config.filter_type === 'lookup_dropdownlist'){
            let api_result = await get_dashboard_filter_data_from_server(dashboard_item_config);
            console.log('filter data :', api_result)
            select_options_data = api_result;
        }
    }


    onMount(async () => {
        await do_initialize();
    });

</script>


<div bind:this={container_element} class="dashboard_filter">
    <div class="display_name">{config.title}</div>
<!--    <pre>{JSON.stringify(config)}</pre>-->

    {#if config.filter_type === 'choice' ||  config.filter_type === 'lookup_dropdownlist'}
        <select class="filter_ddl" bind:value={filter_value} on:change={handle_filter_value_changed}>
            {#each select_options_data as single_option}
                <option value="{single_option.value}">{single_option.text}</option>
            {/each}
        </select>
    {/if}
</div>


<style>

    .dashboard_filter{
        display: flex;
        margin: 5px;
        margin-left: 15px;
        align-items: center;
        gap: 15px;
    }

</style>

