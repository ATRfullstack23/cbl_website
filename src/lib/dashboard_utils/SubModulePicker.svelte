<svelte:options accessors/>

<script>


    import {createEventDispatcher, onMount, tick} from "svelte";

    //
    export let erp_instance;
    export let selected_module_id;
    export let selected_sub_module_id;

    let modules_arr = [];
    let sub_modules_arr = [];


    onMount(()=>{
        initialize();
    });

    let selected_module_instance;
    let selected_sub_module_instance;

    const dispatch = createEventDispatcher();

    function initialize() {
        if(!erp_instance){
            erp_instance = window.erp;
        }

        modules_arr = erp_instance.get_all_modules_arr();

        if(selected_module_id){
            selected_module_instance = erp_instance.getModuleById(selected_module_id);
        }

        if(selected_module_instance){
            sub_modules_arr = selected_module_instance.get_all_sub_modules_arr();
        }

    }

    function handle_selected_module_changed(evt, prevent_event_trigger=false) {
        if(selected_module_id){
            selected_module_instance = erp_instance.get_module_from_id(selected_module_id);
        }
        console.log('selected_module_instance', selected_module_instance)
        sub_modules_arr = selected_module_instance?.get_all_sub_modules_arr() || [];
        console.log('sub_modules_arr', sub_modules_arr)
    }

    function handle_selected_sub_module_changed(evt, prevent_event_trigger = false) {
        selected_sub_module_instance = selected_module_instance?.get_sub_module_from_id(selected_sub_module_id) || null;
        console.log('selected_sub_module_instance', selected_sub_module_instance);

        if(!prevent_event_trigger){
            dispatch('selected_sub_module_changed', {
                module: selected_module_instance,
                sub_module: selected_sub_module_instance,
            });
        }

    }

    export async function set_edit_value(edit_value_obj){
        console.log('set_edit_value', set_edit_value)
        selected_module_id = edit_value_obj.module_id;
        handle_selected_module_changed(null, true);
        await tick();
        selected_sub_module_id = edit_value_obj.sub_module_id;
        await tick();
        handle_selected_sub_module_changed(null, true);
    }

</script>



<div class="submodule_picker">

    <div class="single_block">
        <h3>Module</h3>
        <select name="" id="" bind:value={selected_module_id} on:change={handle_selected_module_changed}>
            <option value="">-</option>
            {#each modules_arr as module}
                <option value="{module.id}">{module.displayName}</option>
            {/each}
        </select>
    </div>
    <div class="single_block">
        <h3>Sub Module</h3>
        <select name="" id="" bind:value={selected_sub_module_id} on:change={handle_selected_sub_module_changed}>
            <option value="">-</option>
            {#each sub_modules_arr as sub_module}
                <option value="{sub_module.id}">{sub_module.displayName}</option>
            {/each}
        </select>
    </div>

</div>



<style>

    .submodule_picker{
        display: inline-flex;
    }

    .single_block{
        display: flex;
        align-items: center;
    }
    .single_block h3{
        margin: 0;
        font-size: 14px;
        padding-right: 8px;
    }
    .single_block select{
        width: unset;
    }
    .button_group {
        display: flex;
        justify-content: center;
        padding-top: 30px;
    }

</style>