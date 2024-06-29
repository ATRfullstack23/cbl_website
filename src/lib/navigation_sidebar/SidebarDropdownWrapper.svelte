<script>
    import SidebarDropdownItem from "./SidebarDropdownItem.svelte";
    import { slide } from "svelte/transition";
    import { sineInOut } from "svelte/easing";
    export let array, label;
    let show = false;
    const show_hide_slide = () => {
        show = !show;
    };
</script>

<div class="label-container">
    <span class="icon"> </span>
    <span class="label" on:click={show_hide_slide}>{label}</span>
    <span class="icon">
        {#if show}
            <svg width=12 height=12
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
                ><path stroke="#fff" stroke-width="2" d="M9 5 5 1 1 5"
                ></path></svg
            >
        {:else}
            <svg width=12 height=12
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
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
            ></SidebarDropdownItem>
        {/each}
    </ul>
{/if}

<style>
     .icon{
        display: flex;
        margin: 0 4px;
    }
    .label-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    span {
        font-weight: 700;
    }
</style>
