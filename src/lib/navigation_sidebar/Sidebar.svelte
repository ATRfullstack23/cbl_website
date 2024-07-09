<script>
    export let navigation_config;
    import SidebarItem from './SidebarItem.svelte'
    import SidebarDropdownWrapper from './SidebarDropdownWrapper.svelte' 
    import { createEventDispatcher } from 'svelte';

    const dispatch_event = createEventDispatcher();


    export let selected_navigation_item;
    function handle_sidebar_item_selected(navigation_item){
        // selected_navigation_item = navigation_item;
        dispatch_event('navigation_item_selected', navigation_item);
    }

    export function handle_selected_main_navigation_item_change(new_navigation_item){
        let new_item_id = new_navigation_item.id;

        let selected_item_new;
        navigation_config.items.find((item)=>{
            if(item.item_type === 'group'){
                let result_item = item.items.find((inner_item)=>{
                    if(inner_item.id === new_item_id){
                        return true;
                    }
                });
                if(result_item){
                    selected_item_new = result_item;
                    return true;
                }

            }
            else{
                if(item.id === new_item_id){
                    selected_item_new = item;
                    return true;
                }
            }
        });
        selected_navigation_item = selected_item_new;
        // console.log('selected_navigation_item', selected_navigation_item)
        // if(selected_item_new){
        // }
    }

</script>

<ul class="sidebar">
    {#each navigation_config.items as navigation_item (navigation_item.id)}
        <li>
            {#if navigation_item.item_type == "group"}
                <div>
                    <SidebarDropdownWrapper array={navigation_item.items}
                                            selected_navigation_item="{selected_navigation_item}"
                                            on:dropdown_item_click={(evt)=>{handle_sidebar_item_selected(evt.detail)}}
                                            icon={navigation_item.custom_icon}
                                            label={navigation_item.display_name}
                    ></SidebarDropdownWrapper>
                </div>
            {:else if navigation_item.item_type == "item"}
                <SidebarItem item={navigation_item}
                             selected_navigation_item="{selected_navigation_item}"
                             on:click={()=>{handle_sidebar_item_selected(navigation_item);}}
                             icon={navigation_item.custom_icon}></SidebarItem>
            {/if}
        </li>
    {/each}
</ul>

<style>

    li,ul{
        color: white;
        cursor: pointer;
    }

    ul{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    li{
        width: 100%;
    }

    .sidebar{
        padding: 2rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;  
        
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 1rem;
        flex-direction: column;
    }

</style>
