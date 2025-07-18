<script>
    export let item;
    export let dashboard_item_config;

    // console.log("item report", item)
    let report_data = {};
    let module_name

    console.log(item); 


    export async function on_new_data_received(new_data) {
        console.log('on_new_data_received', new_data)
        report_data = new_data;
        console.log(report_data)
        if(item.icon){
            const module_path = `./icons_lib/fa/${item.icon}.svelte`;       
            module_name = (await import(module_path)).default;  
        }
    }

                                                        
</script>

<div class="item_container" class:icon_present={item.icon} class:icon_absent={!item.icon} style="width:{item.width}px; min-height:{item.height}px; background-color:{report_data.background_color}; color:{report_data.color};">
    <div class="top_portion" class:icon_present={item.icon}>
        <div class="card_main_contents" class:icon_present={item.icon}>
            <p style="color: {report_data.color};">{item.title}</p>
            <h5 style="color: {report_data.color};">{report_data.value_1} <span>{report_data.sub_note_1 || report_data.subnote_1 || ''}</span></h5>
        </div>
        {#if item.icon}
            <div class="icons_box">
                <span style="background-color:{report_data.icon_background_color}; color:{report_data.icon_color}"> <svelte:component this={module_name}></svelte:component> </span>
            </div>
        {/if}
    </div>
    <div class="bottom_portion" class:icon_present={item.icon}>
        {#if report_data.value_2}
            <p style="color: {report_data.color};">{report_data.value_2} {report_data.sub_note_2 || report_data.subnote_2 || ''}</p>
        {/if}
    </div>
</div>

<style>

    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

    .item_container {
        border-radius: 15px;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        padding-block: 15px;
        padding-top: 22px;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        font-family: "Open Sans", sans-serif;
        margin: 10px;
        background-color: blueviolet;
        width: 300px;
        height: 150px;
    }
    .item_container:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    .item_container.icon_present {
        align-items: flex-start;
        text-align: left;
    }
    .item_container.icon_absent {
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .item_container p {
        font-size: 20px;
        margin: 0;
        color: #FFF;
        font-weight: 700;
        font-family: "Open Sans", sans-serif;
    }
    .item_container h5 {
        font-size: 25px;
        font-weight: 600;
        font-family: "Open Sans", sans-serif;
        color: #FFF;
        margin: 10px 0;
    }
    .item_container h5 span {
        font-size: 16px;
        font-family: "Open Sans", sans-serif;
        font-weight: 400;
    }
    .card_main_contents {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /*margin-bottom: 15px;*/
    }
    .card_main_contents.icon_present {
        align-items: flex-start;
    }
    .top_portion {
        padding-inline: 15px;
        width: 100%;
    }
    .top_portion.icon_present {
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }
    .bottom_portion {
        padding-inline: 15px;
        width: 100%;
        /*text-align: left;*/
        /*display: flex;*/
        text-align: center;
        align-items: center;
        gap: 5px;
    }
    .bottom_portion.icon_present {
        text-align: left;
        justify-content: center;
    }
    .bottom_portion p {
        font-family: "Open Sans", sans-serif;
        font-size: 16px;
        color: #FFF;
        letter-spacing: 1px;
        font-weight: 700;
        margin: 0;
    }
    .bottom_portion span{
        font-family: "Open Sans", sans-serif;
        font-size: 20px;
    }
    .icons_box span {
        display: inline-block;
        width: 50px;
        color: #FF4500;
        font-family: "Open Sans", sans-serif;
        background-color: #FFF;
        padding: 10px;
        border-radius: 50%;
        transform: translateY(-3px);
        transition: all 0.3s ease;
    }
    .item_container:hover .icons_box span {
        transform: scale(0.9) translateY(0px);
    }
</style>