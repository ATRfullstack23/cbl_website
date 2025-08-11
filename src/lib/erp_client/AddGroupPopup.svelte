<script>
    import { createEventDispatcher, onMount } from 'svelte';
    const dispatch = createEventDispatcher();

    export let open_add_group_popup = false;

    let dialog;
    let id = '';
    let display = '';

    // Watch for "open" prop change
    $: if (open_add_group_popup && dialog) {
        dialog.showModal();
    }

    function save() {
        if (id && display) {
            dispatch('save', { id, display });
            close();
        }
    }

    function close() {
        dialog.close();
        open_add_group_popup = false;
        id = '';
        display = '';
    }
</script>

<dialog bind:this={dialog} class="dialog">
    <form method="dialog" on:submit|preventDefault={save}>
        <h3>Add New Group</h3>

        <label>
            Group ID:
            <input type="text" bind:value={id} required/>
        </label>

        <label>
            Display Name:
            <input type="text" bind:value={display} required/>
        </label>

        <div class="buttons">
            <button type="submit">Save</button>
            <button type="button" on:click={close}>Cancel</button>
        </div>
    </form>
</dialog>

<style>
    dialog {
        padding: 2rem;
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        width: 300px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    h3 {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin: 0.5rem 0;
    }

    input {
        width: 100%;
        padding: 0.4rem;
        margin-top: 0.25rem;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    button {
        padding: 0.4rem 0.8rem;
        cursor: pointer;
    }
</style>
