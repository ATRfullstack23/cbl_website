<script>
    import { createEventDispatcher } from 'svelte';
    import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte'
    let dispatch = createEventDispatcher();
    let fitler_types = [
        {
            "type":"lookup_dropdown",
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
        {
            display_name:"",
            value:""
        }
    ]
    function handle_add_choice(){
        choice_filter_array = [...choice_filter_array,{
            display_name:"",
            value:""
        }]
    }
    function handle_delete_choice(choice,index){
        choice_filter_array = choice_filter_array.filter((item,i) => i != index)
    }
    let selected_filter_type = 'lookup_dropdown';
    
    function handle_confirm() {
      handle_cancel()
    }

    function handle_cancel() {
      dispatch('cancel');
    }
</script>

<div class="popup_overlay">
    <div class="popup_container">
        <div class="select_outer">
            <div class="select_container">
              <div class="select_options_container">
                <label for="filter_type">Display Name</label>
                <input type="text" id="filter_display_name">
              </div>
            </div>
            <div class="select_container">
                <div class="select_options_container">
                    <label for="filter_type">Filter Type</label>
                    <select name="" id="filter_type" bind:value={selected_filter_type}>
                        {#each fitler_types as single_filter}
                            <option value="{single_filter.type}">{single_filter.label}</option>
                        {/each}
                    </select> 
                </div>
            </div>
            {#if selected_filter_type == 'lookup_dropdown'}
                <div class="select_container">
                    <div class="select_options_container">
                        <label for="data_sql">SQL Data</label>
                        <input type="text" id="data_sql">
                    </div>
                </div> 
            {:else if selected_filter_type == 'date'}
                <div class="select_container">
                    <div class="select_options_container">
                        <label for="filter_date">Date</label>
                        <input type="date" id="filter_date">
                    </div>
                </div>
                {:else if selected_filter_type == 'choice'} 
                <div class="choice_container">
                    <div class="choice_container_inner">
                        <label for="filter_date">Choice Values</label>
                        <div class="add_choice_button">
                            <button on:click={handle_add_choice}><i class="fa fa-plus"></i> add</button>
                        </div>
                    </div>
                    <div class="choice_array_container">
                        {#each choice_filter_array as single_choice,index}
                            <div class="single_choice_outer">
                                <div class="single_choice">
                                    <label for="">Name</label>
                                    <input type="text" bind:value={single_choice.display_name}>
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
                    </div>
                </div>
            {/if}
        </div>
        <div class="button_group">
            <button on:click={handle_confirm}>Add Filter</button>
            <button class="cancel" on:click={handle_cancel}>Cancel</button>
        </div>
    </div>
</div>

<style>
  .popup_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
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
        margin-top: 15px;
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