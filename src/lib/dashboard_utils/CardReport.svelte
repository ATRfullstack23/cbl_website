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

<div class="item_container" class:icon_present={item.icon} style="min-width:{item.width}px; min-height:{item.height}px; background-color:{report_data.background_color}; color:{report_data.color};">
    <div class="top_portion" class:icon_present={item.icon}>
        <div class="card_main_contents">
            <p style="color: {report_data.color};">{item.title}</p>
            <h5 style="color: {report_data.color};">{report_data.value_1} <span>{report_data.sub_note_1 || ''}</span></h5>
        </div>
        {#if item.icon}
            <div class="icons_box">
                <span style="background-color:{report_data.icon_background_color}; color:{report_data.icon_color}"> <svelte:component this={module_name}></svelte:component> </span>
            </div>
        {/if}
    </div>
    <div class="bottom_portion">
        {#if report_data.value_2}
            <p style="color: {report_data.color};">{report_data.value_2} {report_data.sub_note_2}</p>
        {/if}
    </div>
</div>

<style>
     .item_container{
        border-radius: 15px;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        padding-block: 15px;
        padding-top: 22px;
        align-items: center;
        flex-direction: column ;
        cursor: pointer;
        background-color: beige; 
        
    }
    .item_container.icon_present{
        align-items: flex-start;
    }
    .item_container p{
        font-size: 30px;

    }
    .item_container h5{
        font-size: 22px;
        font-weight: 800;
        color: #3f3f3f;
    }
    .item_container h5 span{
        font-size: 18px;
        font-weight: 500;
    }
    .card_main_contents{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .top_portion{
        padding-inline: 15px;
        width: 100%;
    }
    .top_portion.icon_present{
        width: 100;
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }
    .bottom_portion{
        padding-inline: 15px;
    }
    .bottom_portion p{
        font-size: 16px;
        color: #484848;
        letter-spacing: 2px;
        font-weight: 400;
        margin: 0;
        padding-left:5px;
    }
    .icons_box{

    }
    .icons_box span{
        display: inline-block;
        width: 50px;
        color: red;
        background-color: white;
        padding: 10px;
        border-radius: 50%;
        transform: translateY(-3px);
        transition: all 0.3s ease;

    }
    .item_container:hover .icons_box span{
        transform: scale(0.8) translateY(0px);
    }
</style>