<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import EditableFormItemsManager from "$lib/form_view/EditableFormItemsManager.svelte";

    export let child_window_info;
    export let child_window_advanced_settings;

    let editorContainer;
    let editor
    let dispatch = createEventDispatcher()

    let editable_items_arr = [];
    let editable_data = {};

    onMount(() => {
        console.log('child_window_info', child_window_info)
        console.log('child_window_advanced_settings', child_window_advanced_settings)

        editable_data = JSON.parse(JSON.stringify(child_window_advanced_settings || {}));
        editable_items_arr = JSON.parse(JSON.stringify(ChildWindow.ADVANCED_SETTINGS['default'].customization_config.items));
        console.log("editable_items_arr", editable_items_arr)
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

        <!--{#if form_view}-->
            <EditableFormItemsManager
                    child_window_info="{child_window_info}"
                    sub_module="{child_window_info.sub_module || child_window_info.subModule}"
                    editable_data="{editable_data}"
                    editable_items_arr="{editable_items_arr}"
            />
        <!--{/if}-->

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
