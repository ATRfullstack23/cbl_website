<script>
    export let item;
    export let dashboard_item_config;

    // console.log("item report", item)
    let report_data = {};
    let module_name

    console.log(item); 


    export async function on_new_data_received(new_data) {
        console.log('on_new_data_received by abn ======================================', new_data)
        report_data = new_data[0][0];
        console.log(report_data)
       
    }
</script>
<!-- <div class="main_container"> -->
    <div class="inner_container"  style="background-color:{report_data.background_color}; color:{report_data.color};">
        <div class="header">
            {item.title}
        </div>
        <div class="description">
            {item.description}
        </div>
        <div class="total">{report_data.subnote_1}: {report_data.value_1}</div>
        {#if report_data.value_2 && report_data.value_3} 
        <div class="progress-bar" style="background-color: {report_data.subnote_3_color};">
            <div class="status_bar" style="width: {(parseInt(report_data.value_2)/parseInt(report_data.value_3))*100}%;background-color:{report_data.subnote_2_color};position: absolute;inset:0;">

            </div>
        </div>
        {/if}
        <div class="status" style="--font_color:{report_data.color};">
            <div class="open">
                <span class="open_which" style="color:{report_data.subnote_2_color};">{report_data.subnote_2}</span>
                <span class="amount">{report_data.value_2}</span>
            </div>
            <div class="overdue">
                <span class="overdue_which" style="color:{report_data.subnote_3_color};">{report_data.subnote_3}</span>
                <span class="amount">{report_data.value_3}</span>
            </div>
        </div>
    </div>
<!-- </div> -->

<style>
    @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
    /* .main_container {
        margin: 0 auto;
        display: flex;
        justify-content: center;
    } */
    .inner_container {
        min-width: 500px;
        max-width: 600px;
        border: 1px solid #e0e0e0;
        padding-left: 30px;
        padding-top: 23px;
        padding-bottom: 34px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding-right: 30px;
        background-color: blueviolet;
        color:#fff;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        font-size: 16px;
        margin: 0;
        font-weight: 500;
        font-family: "Montserrat", sans-serif;
    }

    .description {
        font-size: 12px;
        padding-bottom: 16px;
        font-family: "Montserrat", sans-serif;
        border-bottom: 1px solid #e0e0e0;
    }
    .total {
        font-size: 16px;
        padding-block: 15px;
        font-family: "Montserrat", sans-serif;
    }
    .progress-bar {
        height: 8px;
        width: 100%;
        background-color: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 16px;
        position: relative;
    }
    .status {
        display: flex;
        gap: 30px;
    }
    .open_which {
        font-family: "Montserrat", sans-serif;
        font-size: 16px;
        color: #e7b15f; 
    }
    .overdue_which{
        color: #cc0000;
        font-family: "Montserrat", sans-serif;
        font-size: 16px;
    }
    .amount {
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
        font-weight:600;
        color: var(--font_color);
    }
    .status .open {
        color: #c2c2c2;
        display: flex;
        flex-direction: column;
        gap: 5px;
        text-transform: capitalize;
    }
    .status .overdue {
        color: #cc0000;
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 20px;
    }
</style>
