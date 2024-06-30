<svelte:options accessors/>

<script>
    import AddNewDashboardPopup from '$lib/dashboard_utils/AddNewDashboardPopup.svelte';
    import Chart from 'chart.js/auto'
    import {onMount, tick} from 'svelte'
    import chart_data from '$lib/dashboard_utils/chart_data.json'

    export let dashboard_configuration;
    export let id = dashboard_configuration.id;
    export let unique_id = dashboard_configuration.unique_id;
    export let display_name = dashboard_configuration.display_name;

    function create_chart_reports() {

        if(!dashboard_configuration.dashboard_items.length){
            return;
        }

        for(let chart of chart_data.filter(data => data.type == "chart")){
            new Chart(chart.chart_instance,{
                type: chart.chart_type,
                data: chart.data,
                options: chart.options
            })
        }


    }


    let is_hidden = true;
    let shall_initialize = false;
    export function show(){
        is_hidden = false;
        if(!shall_initialize){
            shall_initialize = true;
            tick().then(()=>{
                create_chart_reports()
            });
        }
    }
    export function hide(){
        is_hidden = true;
    }

    export async function refresh_data() {

    }


    let show_add_new_popup = false
    onMount(async () => {
        console.log('dashboard_configuration', dashboard_configuration)
    });
</script>

<div class="chart_container single_dashboard_container"  class:hidden={is_hidden}>
    <div class="add_new_dashboard">
        <button on:click={() => show_add_new_popup = true}>Add New Dashboard</button>
        <button class="filter_button"><i class="fa-solid fa-filter"></i>Add Filter</button>
    </div>

    {#if shall_initialize}


        {#each chart_data.filter(data => data.type == "card") as card}
            <div class="card_container" style="width:{card.width}; height:{card.height}px; background-color:{card.data.backgroundColor}; color:{card.data.color};">
                <p>{card.title}</p>
                <h5>{card.data.value} <span>{card.data.sub_note}</span></h5>
            </div>
        {/each}
        {#each chart_data.filter(data => data.type == "chart") as chart}
            <div class="inner" style ="width:{chart.chart_width};">
                <div class="header">
                    <p>{chart.chart_value}</p>
                    <p>{chart.chart_title}</p>
                </div>
                <canvas width="500" height={chart.chart_height} bind:this={chart.chart_instance}/>
            </div>
        {/each}
        {#if chart_data.filter(data => data.type == "list").length}
            {#each chart_data.filter(data => data.type == "list") as list}
                <div class="inner_list" style="height: {list.list_height}px; overflow-y: scroll; width:{list.list_width}">
                    <div class="heading_container">
                        <p>{list.title}</p>
                        <button>{list.button.title}</button>
                    </div>
                    <div class="list_inner">
                        {#each list.data as item}
                            <div class="single_item">
                                <div class="left_container">
                                    <img src="{item.image}" alt="">
                                    <div class="single_content">
                                        <p>{item.value_1}</p>
                                        <p>{item.value_2}</p>
                                    </div>
                                </div>
                                <div class="right_container">
                                    <p>{item.data_value}</p>
                                </div>
                            </div>
                        {/each}
                    </div>

                </div>
            {/each}
        {/if}
        {#if chart_data.filter(data=>data.type=='table').length}
            {#each chart_data.filter(data=>data.type=='table') as table}
                <div class="inner_table" style="width:{table.table_width};">
                    <div class="heading_container">
                        <div class="header_contents">
                            <p>{table.title}</p>
                            <p>{table.description}</p>
                        </div>
                        <button>{table.button.title}</button>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            {#each table.table_data.columns as column}
                                <th>{column.title}</th>
                            {/each}
                        </tr>
                        </thead>
                        <tbody>
                        {#each table.table_data.data as row_data}
                            <tr>
                                <td>{row_data.col_1}</td>
                                <td>{row_data.col_2}</td>
                                <td>{row_data.col_4}</td>
                                <td>{row_data.col_3}</td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>
            {/each}
        {/if}

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
    .card_container{
        border-radius: 15px;
        padding: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column ;
        cursor: pointer;
    }
    .card_container p{
        font-size: 35px;

    }
    .card_container h5{
        font-size: 25px;
        font-weight: 800;
        color: #3f3f3f;
    }
    .card_container h5 span{
        font-size: 20px;
        font-weight: 500;
    }
    .chart_container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        background-color: #f9fafb;
        padding: 10px;
    }
    .inner{
        background-color: #fff;
        padding: 8px;
        border-radius: 15px;

    }
    .inner .header p{
        margin: 0;
        padding: 0;
        font-size: 18px;
        font-weight: 800;
        color: #3f3f3f;
    }
    .inner .header p:nth-child(2){
        font-size: 15px;
        color: #6e6e6e;
    }
    .inner_list{
        background-color: #fff;
        border-radius: 15px;
        padding: 10px;
        padding-inline: 30px;
    }
    .inner_list .heading_container{
        padding-block: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .inner_list .heading_container p{
        font-size: 20px;
        font-weight: 700;
        font-family: 'Inter', sans-serif;
        color: #000;
        margin: 0;
        padding: 0;
    }
    .inner_list .heading_container button{
        font-family: 'Inter', sans-serif;
        color: #1d4ed8;
        font-size: 14px;
        font-weight: 500;
        padding: 5px 10px;
        border-radius: 5px;
        transition: all 0.2s linear;
    }
    .inner_list .heading_container button:hover{
        background-color: rgb(243 244 246);
    }
    .list_inner .single_item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px solid #e5e7eb;
        padding-top: 20px;
        padding-right: 10px;
    }
    .list_inner .single_item .left_container{
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .left_container img{
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
    }
    .left_container .single_content{

    }
    .left_container .single_content p{
        margin: 0;
        padding: 0;
        color: #6b7280;
        font-size: 14px;
    }
    .left_container .single_content p:nth-child(1){
        font-size: 14px;
        font-weight: 700;
        color: #111827;
    }
    .right_container p{
        font-size: 14px;
        font-weight: 700;
        color: #111827;
        margin: 0;
        padding: 0;
    }

    .inner_table{
        background-color: #fff;
        border-radius: 15px;
        padding: 10px;
        padding-inline: 30px;
    }
    .inner_table .heading_container{
        padding-block: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .heading_container .header_contents p{
        font-size: 20px;
        font-weight: 700;
        font-family: 'Inter', sans-serif;
        color: #000;
        margin: 0;
        padding: 0;
    }
    .heading_container .header_contents p:last-child{
        font-size: 15px;
        color: #6e6e6e;
        font-weight: 400;
        padding-top: 10px;
    }
    .heading_container button{
        font-family: 'Inter', sans-serif;
        color: #1d4ed8;
        font-size: 14px;
        font-weight: 500;
        padding: 5px 10px;
        border-radius: 5px;
        transition: all 0.2s linear;
    }
    .heading_container button:hover{
        background-color: rgb(243 244 246);
    }
    .inner_table table{
        width: 100%;
        border-collapse: collapse;
    }
    .inner_table table thead{
        background-color: #f9fafb;
    }
    .inner_table table th, .inner_table table td{

        padding-block: 15px;
    }
    .inner_table table tbody tr:nth-child(2n){
        background-color: #f9fafb;
    }
</style>