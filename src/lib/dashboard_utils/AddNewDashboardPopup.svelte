<script>
	import { createEventDispatcher } from 'svelte';
  let dispatch = createEventDispatcher();
  let config_json = {
    modules:[
      {
        title:"Module 1",
        id:"mod_1"
      },
      {
        title:"Module 2",
        id:"mod_2"
      },
      {
        title:"Module 3",
        id:"mod_3"
      }
    ],
    submodules:[
      {
        title:"Sub Module 1",
        id:"sub_mod_1",
        module:"mod_1"
      },
      {
        title:"Sub Module 2",
        id:"sub_mod_2",
        module:"mod_2"
      },
      {
        title:"Sub Module 3",
        id:"sub_mod_3",
        module:"mod_3"
      },
      {
        title:"Sub Module 4",
        id:"sub_mod_4",
        module:"mod_3"
      },
      {
        title:"Sub Module 5",
        id:"sub_mod_5",
        module:"mod_1"
      }
    ]
  }
    let dashboard_types =[
        {
            "type": "line",
            "image": "assets/images/cardWithImage.png",
            "label": "Line Chart"
        },
        {
            "type": "bar",
            "image": "assets/images/cardWithHeadingText.png",
            "label": "Bar Chart"
        },
        {
            "type": "pie",
            "image": "assets/images/cardWithHeadingText.png",
            "label": "Pie Chart"
        },
        {
            "type": "table",
            "image": "assets/images/cardWithHeadingText.png",
            "label": "Table"
        },
        {
            "type": "list",
            "image": "assets/images/cardWithHeadingText.png",
            "label": "List" 
        },
        {
            "type":"doughnut",
            "image": "assets/images/cardWithHeadingText.png",
            "label": "Doughnut Chart"
        },
        {
            "type":"card",
            "image": "assets/images/cardWithHeadingText.png",
            "label": "Card"
        }
    ]
    let dashboard_height = '200'
    let dashboard_width = '40'
    let dashboard_title = ''
    let dashboard_description = ''
    let dashboard_title_sql = ''
    let dashboard_data_sql = ''

    function get_image_for_dashboard_type(type) {
        const layout = dashboard_types.find(layout => layout.type === type);
        return layout ? layout.image : '';
    }
    let selected_dashboard_type = 'card';
    function handle_change_dashboard_type(){
      if(dashboard_type != 'card' && dashboard_type != 'list' && dashboard_type != 'table'){
        selected_dashboard_type = 'chart'
        return
      }
        selected_dashboard_type = dashboard_type
    }

    function handle_confirm() {
      handle_cancel()
    }

  function handle_cancel() {
    dispatch('cancel');
  }


  let dashboard_type = 'card';
  let selected_module
  let selected_sub_module
</script>

<div class="popup_overlay">
    <div class="popup_container">
        <div class="select_container">
            <div class="select_options_container">
              <label for="dashboard_type">Dashboard Type:</label>
              <select id="dashboard_type" bind:value={dashboard_type} on:change={handle_change_dashboard_type}>
                {#each dashboard_types as layout}
                  <option value={layout.type}>{layout.label}</option>
                {/each}
              </select>
            </div>
            <div class="selected_option_image_container">
              <img class="layout_image" src={get_image_for_dashboard_type(dashboard_type)} alt={dashboard_type} />
            </div>
        </div>
        <div class="select_container">
            <div class="select_options_container">
                <label for="dashboard_title">Dashboard Title</label>
                <input type="text" id="dashboard_title" bind:value={dashboard_title}>  
            </div>
        </div>
        {#if dashboard_type == "table"}
          <div class="select_container">
              <div class="select_options_container">
                  <label for="dashboard_description">Description</label>
                  <input type="text" id="dashboard_description" bind:value={dashboard_description}> 
              </div>
          </div>
        {/if}
        {#if dashboard_type != 'card' && dashboard_type != 'list' && dashboard_type != 'table'}  
          <div class="select_container">
              <div class="select_options_container">
                  <label for="dashboard_title_sql">Title SQL</label>
                  <textarea name="" id="dashboard_title_sql" bind:value={dashboard_title_sql}></textarea>
              </div>
          </div>
        {/if}
        <div class="select_container">
          <div class="select_options_container">
              <label for="dashboard_width">Width (in %)</label>
              <input type="text" id="dashboard_width" bind:value={dashboard_width}>
          </div>
        </div>
        <div class="select_container">
          <div class="select_options_container">
              <label for="dashboard_height">Height (in px)</label>
              <input type="text" id="dashboard_height" bind:value={dashboard_height}/>
          </div>
        </div>
        <div class="select_container">
          <div class="select_options_container">
              <label for="dashboard_data_sql">Dashboard Data SQL</label>
              <textarea name="" id="dashboard_data_sql" bind:value={dashboard_data_sql}></textarea>
          </div>
        </div>
        <div class="select_container action_button_container">
          <div class="select_options_container">
              <label for="dashboard_action_button">Action Button</label>
              <div class="selection_blocks">
                <div class="single_block">
                  <h3>Module</h3>
                  <select name="" id="" bind:value={selected_module}>
                    {#each config_json.modules as module}
                      <option value="{module.id}">{module.title}</option>  
                    {/each}
                  </select>
                </div>
                <div class="single_block">
                  <h3>Sub Module</h3>
                  <select name="" id="" bind:value={selected_sub_module}>
                    {#each config_json.submodules.filter(item=>item.module == selected_module) as sub_module}
                      <option value="{sub_module.id}">{sub_module.title}</option>  
                    {/each}
                  </select>
                </div>
              </div>
          </div>
        </div>
        <div class="button_group">
          <button on:click={handle_confirm}>Add Dashboard</button>
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
    flex-direction: column;
    width: 900px;
    height: 600px;
    overflow-y: auto;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  label{
    min-width: 130px;
  }
  select,input,textarea{
    width: 60%;
  }
  .select_container{
    display: flex;
    justify-content: space-between;
  }
  .select_container:first-child{
    margin-bottom: 12px;
  }
  .select_options_container{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 50%;
    padding-bottom: 15px;
  }
  
  .select_options_container:last-child{
    width: 100%;
    justify-content: flex-start;
  }
  .selected_option_image_container{
    border: 1px solid rgb(221 220 220);
    border-radius: 4px;
  }
  .layout_image {
    width: 200px;
    height: auto;
    margin: 10px;
  }
  .selection_blocks{
    display: flex;
    gap: 20px;
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
  .button_group {
    display: flex;
    justify-content: center;
    padding-top: 30px;
  }
  .popup_container button {
    width: 200px;
    padding: 8px;
    margin-bottom: 15px;
    margin-right: 15px;
    border-radius: 10px;
  }

  .popup_container button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  .popup_container button.cancel {
    background-color: #6c757d;
  }
</style>