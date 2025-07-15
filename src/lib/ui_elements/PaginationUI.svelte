<script>
    export let totalRows = 0;
    export let selectedPageIndex = 1;
    export let pageSize = 10;


    // Emit event to parent when page changes
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    $: totalPages = Math.ceil(pageSize / totalRows);
    $: from = totalRows === 0 ? 0 : (selectedPageIndex - 1) * pageSize + 1;
    $: to = Math.min(selectedPageIndex * pageSize, totalRows);

    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            dispatch('pageChange', { page });
        }
    }
</script>

<div class="pagination-container">
    <div class="info">Showing {from} to {to} of {totalRows}</div>

    <div class="buttons">
        <button on:click={() => goToPage(1)} disabled={selectedPageIndex === 1}>⏮ First</button>
        <button on:click={() => goToPage(selectedPageIndex - 1)} disabled={selectedPageIndex === 1}>◀ Prev</button>

        <span class="page-info">{selectedPageIndex}</span>

        <button on:click={() => goToPage(selectedPageIndex + 1)} disabled={selectedPageIndex === totalPages}>Next ▶</button>
        <button on:click={() => goToPage(totalPages)} disabled={selectedPageIndex === totalPages}>Last ⏭</button>
    </div>
</div>

<style>
    .pagination-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        font-family: sans-serif;
        margin: 1rem 0;
    }

    .info {
        font-size: 0.9rem;
        color: #333;
    }

    .buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    button {
        padding: 3px 5px;
        font-size: 11px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        cursor: pointer;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .page-info {
        padding: 0.4rem 0.6rem;
        font-weight: bold;
    }
</style>
