<script>
    import {createEventDispatcher, onMount} from 'svelte';

    export let custom_element_id;
    export let custom_element_type;
    export let custom_element_existing_config;
    let editorContainer;
    let editor
    let dispatch = createEventDispatcher()

    let editable_items_arr = [];
    let editable_data = {};

    onMount(() => {
        console.log('custom_element_id', custom_element_id)
        console.log('custom_element_type', custom_element_type)
        console.log('custom_element_existing_config', custom_element_existing_config)

        editable_data = JSON.parse(JSON.stringify(custom_element_existing_config || {}));
        editable_items_arr = JSON.parse(JSON.stringify(FormView.CUSTOM_ELEMENTS[custom_element_type].customization_config.items));
    });


    function handle_value_changed(evt) {
        console.log('handle_value_changed', evt)
    }



    function parse_form_data() {
        console.log('parse_form_data', editable_data);
        return editable_data;
    }


    function confirm_update() {
        dispatch('confirm', {new_config: editable_data});
    }


    function cancel_popup() {
        dispatch('cancel');
    }
</script>

<div class="sql_container">
    <div bind:this={editorContainer} class="editor-container">

        <table>

            {#each editable_items_arr as item}
                <tr>
                    <td class="editable_item_display_name">{item.display_name}</td>
                    <td class="editable_item_form_element">

                        <div>
                            {#if item.input_type === 'single_line'}
                                <input class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                       on:change={handle_value_changed}
                                       type="text"/>
                            {/if}

                            {#if item.data_type === 'boolean' || item.data_type === 'bit'}
                                <input class="form_input_element" bind:this={item.form_element} bind:checked={editable_data[item.unique_id]}
                                       on:change={handle_value_changed}
                                       type="checkbox"/>
                            {/if}

                            {#if item.input_type === 'multiple_line'}
                                <textarea class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                          on:change={handle_value_changed}></textarea>
                            {/if}

                            {#if item.input_type === 'dropdownlist' || item.input_type === 'select'}
                                <select class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                        on:change={handle_value_changed}>
                                    {#each item.options as option}
                                        <option value="{option.value}">{option.text}</option>
                                    {/each}
                                </select>
                            {/if}

                        </div>

                    </td>
                </tr>
            {/each}


        </table>


    </div>

    <div class="button_container">
        <button class="button confirm_button" on:click={confirm_update}>Confirm</button>
        <button class="button cancel_button" on:click={cancel_popup}>Cancel</button>
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

    }

    .editor-container td{
        padding: 10px;
    }

    .editor-container {
        width: 60%;
        margin: 0 auto;
        min-height: 200px;
        border-bottom: 1px solid #ddd;
        margin-top: 50px;
        padding: 10px;
        background-color: #fff;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .form_input_element{
        min-width: 250px;
        padding: 5px;
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
