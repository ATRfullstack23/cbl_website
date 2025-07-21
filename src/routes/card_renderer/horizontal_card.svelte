<script>
    export let data;
    export let config;
</script>

<div class="card_container">
    {#each config as item}
        <div class="card_row">
            <div class="label">{item.label}:</div>
            <div class="value">{data[item.column_id]}</div>
        </div>
    {/each}
</div>

<style>
    .card_container {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        background-color: #f9f9f9;
        width: 100%;
        max-width: 600px;
    }

    .card_row {
        display: flex;
        justify-content: space-between;
        padding: 0.25rem 0;
    }

    .label {
        font-weight: bold;
        color: #333;
    }

    .value {
        color: #555;
        text-align: right;
    }
</style>
