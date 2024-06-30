<script>
    export let list = {};
</script>

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

<style>
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
</style>