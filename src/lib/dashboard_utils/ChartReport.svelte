<script>
    import { onMount } from 'svelte';
    import Chart, { plugins } from 'chart.js/auto'
    export let item;
    export let dashboard_item_config;
    export let container_element;

    let canvas_initial_width_to_use = 500;

    async function create_item_reports() {
        console.log('report_data', report_data)
        console.log(item);
        item.options = {
                            datasets: {
                            bar: {
                                barThickness: report_data.barThickness || 20
                            }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: item.legend_position,
                                    title: {
                                        display: true,
                                        text: ' ',
                                        padding: {
                                            top: 5,
                                            bottom: 5,
                                            left:5,
                                            right:5
                                        }
                                    }
                                }
                            }
                        }
        
        // item.chart_type = 'pie';
        // report_data = {
        //     "labels":["US","UK","EU"],
        //     "datasets":[
        //         {
        //             "label":"Sales",
        //             "data":[6356,6218,6156],
        //             "borderWidth": 0,
        //             "backgroundColor": ["#1b53d4","#fe8d51","#000"],
        //             "hoverOffset": 4
        //         }
        //     ]
        // }
        // report_data.datasets[0].backgroundColor = ["#1b53d4","#fe8d51","#000", "#1b53d4","#fe8d51","#000", "#EFEFEF"];
        // report_data.datasets[0].radius = undefined;
        // report_data.datasets[0].tension = undefined;

        canvas_initial_width_to_use = container_element.clientWidth - 50;
        // canvas_initial_width_to_use = 500
        // console.log('canvas_initial_width_to_use', canvas_initial_width_to_use)


        new Chart(item.canvas_element_instance,{
            type: item.dashboard_type,
            data: report_data,
            options: item.options
        })
    }

    let report_data = {};
    let is_chart_initialized = false;
    export async function on_new_data_received(new_data) {
        report_data = new_data;
        console.log('report_data', report_data);
        if(!is_chart_initialized){
            is_chart_initialized = true;
            await create_item_reports();
        }
        else{
            // update chart here
        }
    }

</script>

<div class="inner" bind:this={container_element} style="width:{item.width}px;min-height:{item.height}px;">    <!-- height={item.height}px; -->
    <div class="header">
        <!-- <p>{report_data?.chart_title_value || ''}</p> -->
        {#if item.title}
            <p>{item.title}</p>
        {/if}
    </div>
    <canvas width="500" bind:this={item.canvas_element_instance}/>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
    /* .inner{
        display: block;
        width: 90%;
        padding: 8px;
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
    } */

    .inner{
        background-color: #fff;
        padding: 8px;
        border-radius: 15px;

    }
    .inner .header p{
        margin: 0;
        padding: 0;
        font-size: 18px;
        font-family: 'Montserrat', sans-serif;
        color: #3e3c3c;
        font-weight: 600;
    }
    .inner .header p:nth-child(2){
        font-size: 15px;
        color: #6e6e6e;
    }
    .header{
        padding: 10px 0 12px 10px;
        
    }

</style>