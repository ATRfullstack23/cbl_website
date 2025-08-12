<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import EditableFormItemsManager from "$lib/form_view/EditableFormItemsManager.svelte";

    export let erp_instance;
    // export let column_id;
    export let existing_value;
    export let config;


    let editorContainer;
    let editor
    let dispatch = createEventDispatcher()

    let select_column_form_element;


    let selected_value;
    onMount(() => {
        selected_value = existing_value;
    });

    let title = config.title || 'Choose Item';

    function confirm_update() {
        dispatch('confirm', {selected_value});
    }

    function cancel_popup() {
        dispatch('cancel');
    }


    function handle_value_changed() {

    }

    function get_all_columns_as_array() {
        return config.options || [];
    }

</script>

<div class="sql_container">

    <div class="main_content">

        <div class="header"><h2>{title}</h2></div>

        <div class="main_form" bind:this={editorContainer}>

            {#if config}
                <select class="form_input_element" bind:this={select_column_form_element}
                        bind:value={selected_value}
                        on:change={handle_value_changed}>
                    {#each get_all_columns_as_array() as option}
                        <option value="{option.value}">{option.text}</option>
                    {/each}
                </select>

            {/if}
        </div>

        <div class="button_container">
            <button class="button confirm_button" on:click={confirm_update}>{config.confirm_button_text || 'Confirm'}</button>
            <button class="button cancel_button" on:click={cancel_popup}>Cancel</button>
        </div>

    </div>

</div>

<style>
    .sql_container {
        width: 100%;
        background-color: rgba(135, 207, 235, 0.363);
        background-color: #2d3e50a1;
        position: fixed;
        top: 0;
        left: 0;
        min-height: 100vh;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
    }


    .main_content {
        width: 60%;
        margin: 0 auto;
        min-height: 200px;
        border-bottom: 1px solid #ddd;
        margin-top: 50px;
        padding: 10px;
        background-color: #fff;
        border-radius: 12px 12px 0 0;
    }


    .main_form {
        display: flex;
        justify-content: center;
        /* min-height: 100px; */
        padding: 50px;
    }

    .button_container {
        width: 60%;
        margin: 0 auto;
        display: flex;
        justify-content: flex-end;
        gap: 20px;
        padding-inline: 45px;
        padding-block: 20px;
        background-color: #fff;
        border-radius: 0 0 12px 12px;
    }

    .button {
        padding: 5px 15px;
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s;
        font-size: 14px;
        font-weight: 600;
    }

    .confirm_button {
        background-color: #4889f4;
    }

    .cancel_button {
        background-color: #fff;
        color: rgb(109, 108, 108);
        border: 1px solid #ddd;
    }

    .confirm_button:hover {
        background-color: #447ae8;
    }

    .cancel_button:hover {
        background-color: #ddd;
        border: 1px solid #a5a3a3;
    }
</style>
