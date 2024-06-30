<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto'
    export let item;
    export let dashboard_item_config;
    export let container_element;

    let canvas_initial_width_to_use = 500;

    async function create_item_reports() {
        console.log('report_data', report_data)
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
        console.log('canvas_initial_width_to_use', canvas_initial_width_to_use)


        new Chart(item.canvas_element_instance,{
            type: item.chart_type,
            data: report_data,
            options: item.options
        })
    }

    let report_data = {};
    let is_chart_initialized = false;
    export async function on_new_data_received(new_data) {
        report_data = new_data;
        if(!is_chart_initialized){
            is_chart_initialized = true;
            await create_item_reports();
        }
        else{
            // update chart here
        }
    }

</script>

<div class="inner" bind:this={container_element}>
    <div class="header">
        <p>{report_data?.chart_title_value || ''}</p>
        <p>{item.title}</p>
    </div>
    <canvas width="{canvas_initial_width_to_use}" height={item.height} bind:this={item.canvas_element_instance}/>
</div>

<style>
    .inner{
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
    }
</style>