<script>
    import { onMount } from 'svelte'
    import SimpleQuery from '$lib/query_utils/SimpleQuery.svelte'
    import JoinQuery from '$lib/query_utils/JoinsQuery.svelte'
    let current_tab = 'JOINS'
    function handle_change_tab(e) {
        current_tab = e.target.innerText
    }

    onMount(async () => {})
</script>

<div class="table_selector_container">
    <div class="category_tabs">
        <ul>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li
                class:active={current_tab == 'SIMPLE'}
                on:click={handle_change_tab}>
                SIMPLE
            </li>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li
                class:active={current_tab == 'JOINS'}
                on:click={handle_change_tab}>
                JOINS
            </li>
        </ul>
    </div>

    {#if current_tab == 'SIMPLE'}
        <SimpleQuery />
    {:else if current_tab == 'JOINS'}
        <JoinQuery />
    {/if}
</div>

<style>
    .table_selector_container {
    }
    .category_tabs {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        margin-bottom: 15px;
        /* background-color: cadetblue; */
        background-color: #5ba8da;
        padding: 5px;
        border-radius: 12px;
    }
    .category_tabs ul {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        margin-bottom: 5px;
    }
    .category_tabs ul li {
        list-style-type: none;
        font-size: 20px;
        cursor: pointer;
        color: #fff;
    }
    .category_tabs ul li.active {
        font-weight: bold;
        text-decoration: underline #fff;
        text-decoration-thickness: 2px;
        /* color: #000; */
        text-underline-offset: 5px;
    }
</style>
