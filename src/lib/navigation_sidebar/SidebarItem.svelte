<script>
    import {env} from "$env/dynamic/public";

    export let icon;
    export let item;
    export let selected_navigation_item;
    // function dispatch_event(params) {

    // }

    function get_custom_icon_url() {
        return env.PUBLIC_ERP_ROOT_URL + `/iconsGenerated/${item.id}_${item.custom_icon.originalName}`;
    }

    function get_icon_color(icon) {
        let theme_name = localStorage.getItem("theme_name");
        console.log("theme_name from icon", theme_name);
        if (theme_name === "light_theme") {
            return "#333";
        }
        return icon.color;
    }

</script>

<div class="label-container"
     class:selected_navigation_item={selected_navigation_item?.id === item.id }
     on:click>

    {#if item.custom_icon}
        <div class="custom_icon" style="background-image: url({get_custom_icon_url()});"></div>
    {:else}

    <span class="icon">
        <svg width=18 height=18
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path
                    stroke="{get_icon_color(icon)}"
                    stroke-width="2px"
                    d="{icon.url}"
            />
        </svg>
    </span>
    {/if}


    <span class="label">{item.display_name}</span>
</div>

<style>

    .icon{
        display: flex;
        margin: 0 4px;
    }
    .label-container {
        gap: 0.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding-bottom: 10px;
        position: relative;
        border-radius: 3px;
        padding-left: 10px;
        background-color: transparent;
        transition: background-color 300ms ease;
    }

    .custom_icon{
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        /*position: absolute;*/
        /* float: left; */
        /*left: 3px;*/
        /*top: 2px;*/
        background-repeat: no-repeat;
        border: 0;
        border-radius: 50%;
        border: 2px solid transparent;
        transition: all 100ms ease-in-out;
    }

    .label{
        font-weight: 400;
    }


    li.selected_navigation_item {
        background-color: white;
        color: #000000;
    }

</style>
