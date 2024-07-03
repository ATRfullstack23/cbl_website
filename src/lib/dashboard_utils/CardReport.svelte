<script>
    export let item;
    export let dashboard_item_config;

    // console.log("item report", item)
    let report_data = {};


    export function on_new_data_received(new_data) {
        console.log('on_new_data_received', new_data)
        report_data = new_data;
    }


</script>

<div class="item_container" style="background-color:{report_data.backgroundColor}; color:{report_data.color};">
    <p>{item.title}</p>
    <h5>{report_data.value} <span>{report_data.sub_note}</span></h5>
</div>

<style>
     .item_container{
        border-radius: 15px;
        padding: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column ;
        cursor: pointer;
    }
    .item_container p{
        font-size: 26px;

    }
    .item_container h5{
        font-size: 25px;
        font-weight: 800;
        color: #3f3f3f;
    }
    .item_container h5 span{
        font-size: 20px;
        font-weight: 500;
    }
</style>