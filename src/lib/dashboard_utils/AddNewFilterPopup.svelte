<script>
    import { createEventDispatcher } from 'svelte';
    import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte'
    import SqlEditorPopup from '$lib/editor_utils/SqlEditorPopup.svelte';
    import {
        add_new_dashboard_item_in_server,
        get_all_dashboards_of_user
    } from "$lib/dashboard_utils/DashboardHelper.js";

    export let dashboard_id;

    let dispatch = createEventDispatcher();
    let fitler_types = [
        {
            "type":"lookup_dropdownlist",
            "label":"Lookup Dropdown"
        },
        {
            "type":"choice",
            "label":"Choice"
        },
        {
            "type":"date",
            "label":"Date"
        }
    ]
    let choice_filter_array = [
        
    ]
    function handle_add_choice(){
        choice_filter_array = [...choice_filter_array,{
            text:"",
            value:""
        }]
    }
    function handle_delete_choice(choice,index){
        choice_filter_array = choice_filter_array.filter((item,i) => i != index)
    }
    let selected_filter_type = 'lookup_dropdownlist';
    let filter_item_data = {
        type:"filter",
        data_config:{
          sql:"",
          items:[]
        }
    }
    let show_filter_item_popup = false
    export async function show_add_new_filter_item_dialog(data,show_add_filter_popup){
      console.log('show_add_new_filter_item_dialog', show_add_filter_popup);
        show_filter_item_popup = show_add_filter_popup
        filter_item_data = data;
    }
    let show_data_sql_popup = false
    function handle_open_data_sql_editor(){
        show_data_sql_popup = true
    }
    function handle_close_data_sql_editor(){
      show_data_sql_popup = false
    }
    function handle_get_data_sql(e){
      filter_item_data.data_config.sql = e.detail
      handle_close_data_sql_editor()
    }

    
    async function handle_confirm() {
        filter_item_data.data_config.items = choice_filter_array
        console.log("filter_item_data_to_insert", filter_item_data);
        await add_new_dashboard_item_in_server(dashboard_id, filter_item_data);
        await get_all_dashboards_of_user();
        location.href = location.href + '';
        location.reload();
        handle_cancel()
    }

    function handle_cancel() {
      show_filter_item_popup = false
      dispatch('cancel');
    }
</script>

<div class="popup_overlay" class:show={show_filter_item_popup}>
    <div class="popup_container">
      <div class="select_outer">
        <div class="select_container">
          <div class="select_options_container">
            <label for="filter_type">Filter Type</label>
            <select name="" id="filter_type" bind:value={filter_item_data.filter_type}>
                {#each fitler_types as single_filter}
                    <option value="{single_filter.type}">{single_filter.label}</option>
                {/each}
            </select> 
          </div>
      </div>
      <div class="select_container">
        <div class="select_options_container">
          <label for="filter_type">Display Name</label>
          <input type="text" id="filter_display_name" bind:value={filter_item_data.title}>
        </div>
      </div>
      <div class="select_container">
        <div class="select_options_container">
          <label for="filter_type">Unique ID</label>
          <input type="text" id="filter_display_name" bind:value={filter_item_data.unique_id}>
        </div>
      </div>
      {#if filter_item_data.filter_type == 'lookup_dropdownlist'}
          <div class="select_container">
              <div class="select_options_container">
                  <label for="data_sql">SQL Data</label>
                  <textarea name="" id="data_sql" bind:value={filter_item_data.data_config.sql} on:click={handle_open_data_sql_editor}></textarea>
              </div>
          </div> 
      {:else if filter_item_data.filter_type == 'date'}
          <div class="select_container">
              <div class="select_options_container">
                  <label for="filter_date">Date</label>
                  <input type="date" id="filter_date">
              </div>
          </div>
          {:else if filter_item_data.filter_type == 'choice'} 
          <div class="choice_container">
              <div class="choice_container_inner">
                  <label for="filter_date">Choice Values</label>
                  <div class="add_choice_button">
                      <button on:click={handle_add_choice}><i class="fa fa-plus"></i> add</button>
                  </div>
              </div>
              <div class="choice_array_container">
                  {#if choice_filter_array.length}
                    {#each choice_filter_array as single_choice,index}
                        <div class="single_choice_outer">
                            <div class="single_choice">
                                <label for="">Name</label>
                                <input type="text" bind:value={single_choice.text}>
                            </div>
                            <div class="single_choice">
                                <label for="">Value</label>
                                <input type="text" bind:value={single_choice.value}>
                            </div>
                            <div class="choice_item_delete_container">
                                <button
                                    on:click={() =>
                                        handle_delete_choice(
                                            single_choice,
                                            index,
                                        )}
                                    ><span
                                        style="width: 15px; display:inline-block;"
                                        ><FaTrashAlt /></span
                                    ></button>
                            </div>
                        </div>
                    {/each}
                    {:else}
                      <div class="no_choices_container" style="height: 100px; display: flex; justify-content: center; align-items: center;">
                          <p>No choices added</p>
                      </div>
                  {/if}
              </div>
          </div>
      {/if}
    </div>
    <div class="button_group">
        <button on:click={handle_confirm}>Add Filter</button>
        <button class="cancel" on:click={handle_cancel}>Cancel</button>
    </div>
  </div>
  {#if show_data_sql_popup}
    <SqlEditorPopup bind:dashboard_data_sql={filter_item_data.data_config.sql} on:close_popup={handle_close_data_sql_editor} on:get_sql={handle_get_data_sql}/>
  {/if}
</div>

<style>
  .popup_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
  }
  .popup_overlay.show{
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .popup_container {
    display: flex;
    flex-direction:column;
    justify-content: space-evenly;
    width: 600px;
    min-height: 300px;
    max-height: 500px;
    /* overflow-y: auto; */
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  .select_outer{
    padding-bottom: 20px;
  }
  label{
    min-width: 130px;
  }
  select,input,textarea{
    width: 60%;
  }

  
  .select_options_container{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    padding-bottom: 15px;
  }
  .choice_container{

  }
  .choice_container_inner{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    padding-bottom: 15px;
  }
  .choice_container_inner label{
    min-width: 130px;
  }
  .add_choice_button{
    width: 60%;
  }
 
  .choice_container_inner button{
    font-size: 10px;
    background-color: green;
    color: #fff;
    width: 50px;
    height: 25px;
    border-radius: 10px;
  }
  .choice_array_container{
    width: 70%;
    margin: 0 auto;
    max-height: 300px;
    overflow-y: auto;
  }
  .single_choice_outer{
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
    align-items: center;
  }
  .single_choice_outer label{
    font-size: 13px;
    min-width: unset;
    padding-right: 10px;
  }
  .choice_item_delete_container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

.choice_item_delete_container button {
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    color: #c01414;
}
  .button_group {
    display: flex;
    justify-content: center;
  }
  .button_group button {
    width: 200px;
    padding: 8px;
    margin-bottom: 15px;
    margin-right: 15px;
    border-radius: 10px;
  }

  .button_group button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  .button_group button.cancel {
    background-color: #6c757d;
  }
</style>