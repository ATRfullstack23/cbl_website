

<script>
    import {onMount} from "svelte";

    export let sub_module;

    let filters_arr = [];
    export let filter_configuration = {};


    export let selected_filters = []

    function open_filter_configuration_popup(){
        show_filter_config_maker_popup = true
    }
    function close_filter_configuration_popup(){
        show_filter_config_maker_popup = false
        reset_filter_options()
    }

    let show_filter_config_maker_popup = false;


    function delete_filter_data(index){
        selected_filters.splice(index, 1);
        selected_filters = [...selected_filters];
    }

    function add_new_filter_config(){
        const selected_filter = filters_arr.find(f => f.id === newFilter.filter_id);
        if (selected_filter && newModule.target_value_type && newModule.filter_value) {
            const newEntry = {
                filter_id: selected_filter.id,
                // filter_: selected_filter.displayName,
                target_value_type: newModule.target_value_type,
                filter_value: newModule.filter_value || '',
            };

            selected_filters = [...selected_filters, newEntry];

            close_filter_configuration_popup();
            reset_filter_options()
        } else {
            alert('Please select a filter.');
        }
    }



    let newModule = {
        filter: '',
        target_value_type: '',
        filter_value: '',

    };
    let newFilter = {
        filter_id: '',
        filter_title: ''
    };


    function reset_filter_options(){
        // selected_module = ''
        // selected_sub_module = ''
        // selected_filters = []
        newModule = {
            filter: '',
            target_value_type: '',
            filter_value: '',

        }
        newFilter = {
            filter_id: '',
            filter_title: ''
        }
    }

    export function handle_sub_module_changed(new_sub_module) {
        sub_module = new_sub_module;
        filters_arr = sub_module?.get_all_filters_arr()
    }


    onMount(()=>{
        handle_sub_module_changed(sub_module);
    });
</script>


<div class="filter-control-container">
    <div class="insert-container">
        <h6>Filter Configuration</h6>
        {#if sub_module}
            <button on:click={open_filter_configuration_popup}>Add</button>
        {/if}
    </div>
    {#if selected_filters.length}
        <div class="filter-container">
            <ul>
                {#each selected_filters as mod, index}
                    <li>
                        <div class="single_filter">
                            <span class="filter_name">{mod.filter_id}</span>
                            <span class="filter_value_type"> = </span>
                            <span class="filter_value">({mod.filter_value})</span>
                        </div>
                        <div class="delete-btn"  on:click={() => delete_filter_data(index)}><i class="fa-solid fa-trash"></i></div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}


</div>


{#if show_filter_config_maker_popup}
    <div class="filter-popup-overlay">
        <div class="filter-popup-wrapper">
            <div class="filter-header-section">
                <button class="filter-close-button" on:click={close_filter_configuration_popup} aria-label="Close">✕</button>
            </div>

            <div>
                {#if filters_arr?.length}
                    <div class="filter-input-section">
                        <label>Select Filter</label>
                        <select bind:value={newFilter.filter_id}>
                            <option value="">Select Filter</option>
                            {#each filters_arr as f}
                                <option value={f.id}>{f.displayName}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="filter-input-section">
                        <label>Filter Type</label>
                        <label><input type="radio" value="dynamic" bind:group={newModule.target_value_type}>Dynamic</label>
                        <label><input type="radio" value="static" bind:group={newModule.target_value_type}>Static</label>
                    </div>
                    {#if newModule.target_value_type}
                        <div class="filter-input-section_dynamic">
                            <label>Filter Value</label>
                            <input type="text" bind:value={newModule.filter_value} placeholder="Enter filter value" />
                        </div>
                    {/if}


                    <div class="filter-popup-buttons">
                        <button class="add_filter" on:click={add_new_filter_config}>Add</button>
                        <button class="cancel" on:click={close_filter_configuration_popup}>Cancel</button>

                    </div>
                {:else}
                    <div class="filter-input-section">
                        <p style="color: red; font-weight: bold;">No filters available for this sub module.</p>
                    </div>
                {/if}
            </div>

        </div>
    </div>
{/if}





<style>


    .filter-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000000;
    }
    .filter-popup-wrapper {
        background: white;
        padding: 2rem;
        padding-top: 0;
        padding-right: 10px;
        border-radius: 10px;
        width: 400px;
        height: 370px;
        position: relative;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    .filter-input-section {
        margin-bottom: 1rem;
    }
    .filter-input-section_dynamic input{
        width: 100%;
    }
    .filter-input-section label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
    .delete-btn{
        background: none;
    }
    .filter-input-section select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
    }
    .filter-popup-buttons {
        position: absolute;
        bottom: 7px;
        right: 7px;
        display: flex;
        justify-content: flex-end;
        margin-top: 1.5rem;
    }
    .filter-popup-buttons button {
        padding: 0.5rem 1.2rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
    .filter-popup-buttons .cancel {
        background: #888;
        color: white;
    }
    .filter-popup-buttons .add_filter {
        background: #28a745;
        color: white;
    }
    .filter-header-section{
        display: flex;
        justify-content: right;
    }
    .filter-close-button {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #c61b1b;
        font-weight: 800;
    }
    .filter-container ul{
        max-height: 100px;
        overflow: scroll;
        border: 1px solid grey;
        padding: 10px;
    }
    .filter-container ul li{
        display: flex;
        align-items: center;
        gap: 20px;
        cursor: pointer;
        margin-bottom: 5px;
        padding-block: 2px;
    }
    .filter-container ul li:hover{
        background-color: #007bff;
        color: #fff;
    }



    /*CSS for Integration of Filter Configuration from ATR */
    .filter-control-container{
        border: 1px solid rgb(128 128 128 / 22%);
        padding: 10px 5px 5px 10px;
        border-radius: 10px;
        /*pa*/
    }
    .insert-container{
        display: flex;
        align-items: center;
        gap: 25px;
    }
    .insert-container button{
        width: 60px;
        padding: 2px 3px;
        margin-top: 6px;
        font-size: 12px;
    }

</style>