<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import { dndzone } from 'svelte-dnd-action';
    import AddGroupPopup from '$lib/erp_client/AddGroupPopup.svelte';
    import EditableFormItemsManager from "$lib/form_view/EditableFormItemsManager.svelte";

    export let erp_instance;
    export let config;

    let editorContainer;
    let editor
    let dispatch = createEventDispatcher()
    let editable_items_arr = [];
    let editable_data = {};

    let module_items_arr = [];

    onMount(() => {
        console.log('edit nav erp_instance', erp_instance)
        console.log('edit nav config', config)

        // config.items

        for(const key in erp_instance.allModules){
            const module_info = erp_instance.allModules[key];
            module_items_arr.push({
                item_type: 'item',
                action_type: 'go_to_module',
                display_name: module_info.displayName,
                id: module_info.id,
                context_data: {
                    "module_id" : module_info.id,
                    "submodule_id" : module_info.getDefaultSubModule()?.id
                }
            })
        }
        module_items_arr = module_items_arr;

        editable_data = JSON.parse(JSON.stringify(config || {}));
        console.log("editable_data", editable_data)
        window._nav_editable_data = editable_data;
    });


    function handle_value_changed(evt) {
        console.log('handle_value_changed', evt)
    }


    function parse_form_data() {
        console.log('parse_form_data', editable_data);
        return editable_data;
    }


    function confirm_update() {
        console.log("configured_data===========", configured)
        dispatch('confirm', {new_config: editable_data});
    }


    function cancel_popup() {
        dispatch('cancel');
    }

    let configured = {
        version: '1.0',
        display_name: 'Demo',
        id: 'demo',
        items: [
            {id: 'root', display_name: 'Root', item_type: 'group', items: []}
        ]
    };

    let open_add_group_popup = false;

    function add_item_to_root(item) {
        const root_group = configured.items.find(group => group.id === 'root');
        if (root_group.items.some(existing => existing.id === item.id)) {
            alert(`"${item.display_name}" already exists in root group.`);
            return;
        }
        root_group.items.push(item);
        configured = configured
    }

    function handle_add_group({detail}) {
        configured.items.push({
            id: detail.id,
            display_name: detail.display,
            item_type: 'group',
            items: []
        });
        // configured = structuredClone(configured);
        configured = configured
        open_add_group_popup = false;
    }

    function handleDndGroupItems({detail}, groupIndex) {
        configured.items[groupIndex].items = detail.items;
        configured = configured
    }

    function handleDndFinalize({detail}, groupIndex) {
        configured.items[groupIndex].items = detail.items;
        configured = configured

    }

</script>

<AddGroupPopup bind:open_add_group_popup on:save={handle_add_group}/>

<div class="sql_container">


    <div class="main_content">

        <div class="header"><h2>Update Navigation settings</h2></div>

        <!--        <div class="main_form">-->

        <!--&lt;!&ndash;            <h4> ABN, need to continue here</h4>&ndash;&gt;-->

        <!--        </div>-->
        <div class="navigation_configuration_container">
            <div class="flex-wrap-container">
                <div class="card item-card">
                    <header class="card-header">
                        <p class="card-header-title">Module Items</p>
                    </header>
                    {#each module_items_arr as item}
                        <div class="card-content scrollable-content">
                            <div class="item-row">
                                <span class="item-name">{item.display_name}</span>
                                <button class="add-btn" on:click={() => add_item_to_root(item)}><i
                                        class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>


            <div class="add-container">
                <h2 class="title">Groups</h2>
                <button class="button add-group-btn is-primary" on:click={() => open_add_group_popup = true}><i
                        class="fa-solid fa-plus"></i><span>ADD</span></button>
            </div>
            <div class="flex-wrap-container">
                {#each configured.items as group, groupIndex (group.id)}
                    <div class="card item-card">
                        <header class="card-header">
                            <p class="card-header-title">{group.display_name}</p>
                        </header>
                        <div
                                use:dndzone={{
                    items: group.items,
                    flipDurationMs: 150,
                    dragDisabled: false
                }}
                                on:consider={(e) => handleDndGroupItems(e, groupIndex)}
                                on:finalize="{(e) =>handleDndFinalize(e, groupIndex)}"
                                class="card-content scrollable-content group-drop-area"
                        >
                            {#each group.items as item (item.id)}
                                <div class="box is-light mb-2">{item.display_name}</div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>


            <!--            <div class="box-container ">-->
            <!--                <h2 class="title is-5">Configured JSON</h2>-->
            <!--                <pre class="json-output">{JSON.stringify(configured, null, 2)}</pre>-->
            <!--            </div>-->
        </div>


        <div class="button_container">
            <button class="button confirm_button" on:click={confirm_update}>Confirm</button>
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }


    .main_content {
        width: 80vw;
        margin: 0 auto;
        min-height: 200px;
        max-height: 90vh;
        overflow-y: scroll;
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

    .editor-container td {
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

    .form_input_element {
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


    .navigation_configuration_container h2 {
        margin-left: 12px;
    }

    .flex-wrap-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 8px;
        padding-bottom: 20px;
    }

    .item-card {
        flex: 0 0 250px;
        display: flex;
        flex-direction: column;
        height: 300px;
        overflow-y: scroll;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        background: white;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .item-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
    }

    .card-header {
        /*background: #313468;*/
        background: #408dfb;
        border-bottom: 1px solid #ddd;
        padding: 10px;
        color: #fff;

    }

    .add-container {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .add-group-btn {
        width: 65px;
        height: 25px;
        background-color: #1c64f2;
        color: #fff;
        padding-right: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .add-group-btn i {
        padding: 6px;
    }


    .scrollable-content {
        /*overflow-y: auto;*/
        padding: 0.75rem;
        flex: 1;
    }

    .item-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.4rem 0;
        border-bottom: 1px solid #eee;
    }

    .item-name {
        font-size: 0.9rem;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .add-btn {
        /*background: #00d1b2;*/
        background: #408dfb;
        border: none;
        color: #ffffff;
        /*border-radius: 50%;*/
        width: 24px;
        height: 24px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        font-weight: bold;
        font-size: 1rem;
        transition: background 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .add-btn:hover {
        /*background: #00b89c;*/
        background: #2066ca;
    }

    .group-drop-area {
        min-height: 50px;
        border: 2px dashed #ccc;
        border-radius: 6px;
    }

    .box.is-light {
        background-color: #f5f5f5;
        cursor: grab;
    }

    .json-output {
        background: #f4f4f4;
        padding: 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
        max-height: 300px;
        overflow: auto;
        border: 1px solid #ddd;
    }

    /*ABN CSS UPDATES */
    .card-header-title {
        color: #fff;
        font-size: 18px;
        font-weight: 700;
    }


</style>
