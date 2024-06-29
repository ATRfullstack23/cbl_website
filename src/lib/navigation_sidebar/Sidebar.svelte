<script>
    import {createEventDispatcher} from "svelte";

    export let navigation_config;
    import SidebarItem from './SidebarItem.svelte'
    import SidebarDropdownWrapper from './SidebarDropdownWrapper.svelte' 

    const dispatch_event = createEventDispatcher();
    function handle_sidebar_item_click(navigation_item) {
        dispatch_event('navigation_item_selected', navigation_item);
    }
</script>

<ul class="sidebar">
    {#each navigation_config.items as navigation_item (navigation_item.id)}
        <li>
            {#if navigation_item.item_type == "group"}
                <div>
                    <SidebarDropdownWrapper array={navigation_item.items} label={navigation_item.display_name}
                    ></SidebarDropdownWrapper>
                </div>
            {:else if navigation_item.item_type == "item"}
                <SidebarItem on:click={()=>{handle_sidebar_item_click(navigation_item);}} label={navigation_item.display_name}></SidebarItem>
<!--                <SidebarItem label=" Sharon "></SidebarItem>-->
            {/if}
        </li>
    {/each}
</ul>

<style>


    li,ul{
        color: white;
    }

    .sidebar{
        padding: 1rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;  
        
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 1rem;
        flex-direction: column;
    }
</style>
