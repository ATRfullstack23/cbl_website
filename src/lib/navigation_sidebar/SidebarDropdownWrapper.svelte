<script>
    import SidebarDropdownItem from "./SidebarDropdownItem.svelte";
    import { slide } from "svelte/transition";
    import { sineInOut } from "svelte/easing";

    import {createEventDispatcher, onMount} from 'svelte';

    const dispatch_event = createEventDispatcher();

    export let array, label, icon;
    let show = false;
    const show_hide_slide = () => {
        show = !show;
        localStorage.setItem('sidebar_dropdown_wrapper_show_status__' + label, show ? '1' : '0');
    };

    function handle_sidebar_dropdown_item_click(item){
        dispatch_event('dropdown_item_click', item);
    }
    onMount(()=>{
        show = localStorage.getItem('sidebar_dropdown_wrapper_show_status__' + label) === '1';
    });

</script>

<div class="label-container" on:click={show_hide_slide}>
    <div class="labelhead_and_labelicon_container"  >
    <span class="icon"> 
         <svg width=17 height=17
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path
                stroke="{icon.color}"
                stroke-width="2px"
                 d="{icon.url}"
            />
        </svg>
    </span>
    <span class="label">{label}</span>
    </div>
    <span class="icon">
        {#if show}
            <svg width=12 height=12
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
                transform="rotate(180)"
                class="icon"
                ><path stroke="#fff" stroke-width="2" d="M9 5 5 1 1 5"
                ></path></svg
            >
        {:else}
            <svg width=12 height=12
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"   
                transform="rotate(-90)"
                class="icon"
                ><path stroke="#fff" stroke-width="2" 
                    d="m1 1 4 4 4-4"
                ></path></svg
            >
        {/if}
    </span>
</div>

{#if show}
    <ul
        transition:slide={{
            delay: 150,
            duration: 200,
            easing: sineInOut,
            axis: "y",
        }}
    >
        {#each array as item (item.id)}
            <SidebarDropdownItem label={item.display_name}
                on:click={()=>{handle_sidebar_dropdown_item_click(item);}}></SidebarDropdownItem>
        {/each}
    </ul>
{/if}

<style>

    
    ul{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 10px;
    }

    .icon{
        display: flex;
        margin: 0 4px;
    }
    .label-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-bottom: 10px;
    }
    span {
        font-weight: 700;
    }

    .labelhead_and_labelicon_container{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .5rem;
    }


</style>
