<script>
  import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
  import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte'
  import icons from '$lib/svelte_icons/icons.json'
  import SqlEditorPopup from '$lib/editor_utils/SqlEditorPopup.svelte';
  import {
      add_new_dashboard_item_in_server,
      update_dashboard_item_in_server,
      get_all_dashboards_of_user
  } from "$lib/dashboard_utils/DashboardHelper.js";
  export let dashboard_id;

  let dashboard_height = '200'
  let dashboard_width = '40'
  let dashboard_title = ''
  let dashboard_description = ''
  let dashboard_title_sql = ''
  let dashboard_data_sql = ''
  let dashboard_icon = ''
  let imported_icons = [];
  let fitered_icons_array = icons
  let temp_imported_icons = []
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
        },
        {
            "type":"custom_table",
            "image": "assets/images/cardWithHeadingText.png",
            "label": "Custom Table"
        }
    ]

  async function import_icons() {
    for(let i = 0; i < fitered_icons_array.length; i++){
      let module_name = ''
      let c_name = fitered_icons_array[i]
      const module_path = `./icons_lib/fa/${c_name}.svelte`;
      module_name = (await import(module_path)).default;
      imported_icons.push(module_name);
    }
    
  }
  let show_icon_suggestions = false;
  let is_icon_needed = true
  function handle_icon_search(){
    show_icon_suggestions = true
    if(dashboard_item_data.config.icon.length){
      temp_imported_icons = imported_icons.filter(item=>item.name.toLowerCase().includes(dashboard_item_data.config.icon.toLowerCase()))
    }else{
      temp_imported_icons = temp_imported_icons
      show_icon_suggestions = false
    }
  }
  function handle_select_icon(icon_data){
    show_icon_suggestions = false
    dashboard_item_data.config.icon = icon_data.name.match(/<(.*?)>/)[1]
    console.log("dashboard_item_data.config.icon",dashboard_item_data.config.icon);
  }
  

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


  let card_dashboard_config = {
    "type": "report_item",
    "report_item_type": "card",
    "dashboard_type": "card",
    "title": "",
    "icon":"",
    "data_config": {
        "sql": "" },
    "width": "25%",
    "height": "150"
  }

  async function handle_confirm() {
    let type_of_dashboard = dashboard_item_data.config.dashboard_type
    if(type_of_dashboard == "line" || type_of_dashboard == "bar" || type_of_dashboard == "pie" || type_of_dashboard == "doughnut"){
      dashboard_item_data.config.report_item_type = "chart"
    }else{
      dashboard_item_data.config.report_item_type = dashboard_item_data.config.dashboard_type 
    }
    dashboard_item_data.config.type = "report_item" 
    let dashboard_item_to_insert = dashboard_item_data.config
    if(dashboard_item_to_insert.dashboard_type == "custom_table"){
      dashboard_item_to_insert.table_column_data = added_columns_array
    }
    console.log("dashboard_item_to_insert", dashboard_item_to_insert);
    await add_new_dashboard_item_in_server(dashboard_id, dashboard_item_to_insert);
    await get_all_dashboards_of_user();
    location.href = location.href + '';
    location.reload();
    // handle_cancel()
  }

  function handle_cancel() {
    show_add_new_popup = false
    edit_mode = false
    dispatch('cancel');
  }

  async function handle_update(){
    console.log(dashboard_item_data);
    let updated_dashboard_item_config = dashboard_item_data.config
    let dashboard_item_id_to_update = dashboard_item_data.id
    await update_dashboard_item_in_server(dashboard_id, dashboard_item_id_to_update, updated_dashboard_item_config);
    await get_all_dashboards_of_user();
    location.href = location.href + '';
    location.reload();
  }


  
  let selected_module
  let selected_sub_module
  let show_data_sql_popup = false
  let sample_sql_code = '-- Sample card sql'
  function handle_open_data_sql_editor(){
      show_data_sql_popup = true
  }
  function handle_close_data_sql_editor(){
      show_data_sql_popup = false
  }
  function handle_get_data_sql(e){
    dashboard_item_data.config.data_config.sql = e.detail
    handle_close_data_sql_editor()
  }

  function get_sample_sql_code(dashboard_type){
    switch (dashboard_type) {
      case 'line':
          return '-- Sample line chart sql'
      case 'bar':
          return `-- Write Your SQL Code declare @sundry_debtors table  (customer varchar (255),total_invoice_amount dec(10,2),amount_received dec(10,2)) insert into @sundry_debtors select distinct cp.customer_name customer_name  ,(select sum(sales_ledger_debit) from ledger_transactions llt where llt.customer_profile_id = lt.customer_profile_id and llt.invoice_id is not null) accounts_payable  ,(select sum(sales_ledger_credit) from ledger_transactions llt where llt.customer_profile_id = lt.customer_profile_id and llt.invoice_id is not null) accounts_payable from  ledger_transactions lt inner join   customer_profile cp on cp.id = lt.customer_profile_id where  lt.customer_profile_id is not null and  lt.invoice_id is not null    select sum(total_invoice_amount) - sum(amount_received) as chart_title_value from @sundry_debtors  select customer as label from @sundry_debtors  select 'Outstanding Total' as label, 3 as borderWidth, '#1b53d4' as backgroundColor, '#1b53d4' as borderColor, 0.2 as tension, 5 as radius   select customer as label, (total_invoice_amount-amount_received) as value from @sundry_debtors  `
      case 'pie':
          return '-- Sample pie chart sql'
      case 'table':
          return '-- Sample table sql'
      case 'list':
          return '-- Sample list sql'
      case 'custom_table':
          return `select customer_profile_id, ( select customer_name from customer_profile cp where cp.id = i.customer_profile_id) as customer_name, id as invoice_id, invoice_number, total_amount from invoice i`
      case 'doughnut':
          return '-- Sample doughnut chart sql'
      case 'card':
          return `
select
\ttotal_amount as value_1,
\t'#f5f5dc' as background_color,
\t'Approved V2' as sub_note_1,
\t'22' as value_2,
\t'Total Sales V2' as sub_note_2,
\t'#000' as color,'#fff' as icon_background_color,
\t'#ce1331' as icon_color
from
\tsales_credit_note scn
where
\tscn.credit_note_status = 'approved'
          `
      default:
          return `select total_amount as value_1,'#f5f5dc' as background_color,'#000' as color,'#fff' as icon_background_color,'#ce1331' as icon_color, 'Approved V2' as sub_note_1, '22' as value_2, 'Total Sales V2' as sub_note_2  from sales_credit_note scn where scn.credit_note_status = 'approved'`
    }
  }

  async function handle_copy_sample_sql(event){
    let button_text = event.target.innerText
    try{
      sample_sql_code = get_sample_sql_code(dashboard_item_data.config.dashboard_type)
      await navigator.clipboard.writeText(sample_sql_code)
      event.target.innerText = 'Code Copied ✅'
      setTimeout(() => {
        event.target.innerText = button_text
      }, 2000);
    }
    catch(e){
      console.error("Failed to copy text: ", e);
      event.target.innerText = 'Failed To Copy ❌'
      setTimeout(() => {
        event.target.innerText = button_text
      }, 2000);
    }
    
  }


  let goto_action_module = ''
  let goto_action_submodule = ''
  let added_columns_array = []
  let column_data_obj = {}
  let show_add_column_popup = false
  function handle_show_add_new_column_dialogue_box(){
    show_add_column_popup = true
  }
  function handle_add_column(){
    if(column_data_obj.action_type != 'null'){
      let context_data = {
        module_id : goto_action_module,
        submodule_id : goto_action_submodule
      }
      column_data_obj.context_data = context_data
      added_columns_array = [...added_columns_array,column_data_obj]
      column_data_obj = {}
      show_add_column_popup = false
      return
    }

    added_columns_array = [...added_columns_array,column_data_obj]
    column_data_obj = {}
    show_add_column_popup = false
  }
  function handle_cancel_add_column(){
    show_add_column_popup = false
  }
  let dashboard_item_data = {
    config:{
      data_config:{
        sql:""
      }
    }
  }
  let show_add_new_popup = false
  let edit_mode = false
  export async function show_add_new_dashboard_item_dialogue(data_config,show_popup){
    dashboard_item_data = data_config
    console.log('dashboard_item_data', dashboard_item_data);
    dashboard_item_data.config.dashboard_type = 'card'
    show_add_new_popup = show_popup
    console.log('dashboard_item_data', dashboard_item_data);
  }

  export async function show_edit_dashboard_item_dialogue(data_config,show_popup){
    console.log('dashboard_item_data', data_config)
    dashboard_item_data = data_config
    edit_mode = true
    show_add_new_popup = show_popup

    if(dashboard_item_data.config.table_column_data){
      console.log('dashboard_item_data.config.table_column_data', dashboard_item_data.config.table_column_data);
      added_columns_array = dashboard_item_data.config.table_column_data
    }
  }

  let dashboard_type = 'card'
  onMount(async () => {
    await import_icons();
    temp_imported_icons = imported_icons
  })
</script>
<div class="popup_overlay" class:show_popup={show_add_new_popup}>
  <div class="popup_container">
      <div class="select_container">
          <div class="select_options_container">
            <label for="dashboard_type">Dashboard Type:</label>
            <select id="dashboard_type" bind:value={dashboard_item_data.config.dashboard_type} on:change={handle_change_dashboard_type}>
              {#each dashboard_types as layout}
                <option value={layout.type}>{layout.label}</option>
              {/each}
            </select>
          </div>
          <div class="selected_option_image_container">
            <img class="layout_image" src={get_image_for_dashboard_type(dashboard_item_data.config.dashboard_type)} alt={dashboard_item_data.config.dashboard_type} />
          </div>
      </div>
      <div class="select_container">
          <div class="select_options_container">
              <label for="dashboard_title">Dashboard Title</label>
              <input type="text" id="dashboard_title" bind:value={dashboard_item_data.config.title}>  
          </div>
      </div>
      {#if dashboard_item_data.config.dashboard_type == "table" || dashboard_item_data.config.dashboard_type == "custom_table"}
        <div class="select_container">
            <div class="select_options_container">
                <label for="dashboard_description">Description</label>
                <input type="text" id="dashboard_description" bind:value={dashboard_item_data.config.description}> 
            </div>
        </div>
      {/if}
      <!-- {#if dashboard_item_data.config.dashboard_type != 'card' && dashboard_item_data.config.dashboard_type != 'list' && dashboard_item_data.config.dashboard_type != 'table' && dashboard_item_data.config.dashboard_type != 'custom_table'}  
        <div class="select_container">
            <div class="select_options_container">
                <label for="dashboard_title_sql">Title SQL</label>
                <textarea name="" id="dashboard_title_sql" bind:value={dashboard_title_sql}></textarea>
            </div>
        </div>
      {/if} -->
      {#if dashboard_item_data.config.dashboard_type =='card'}
        <div class="select_container">
          <div class="select_options_container icons_container">
            <label for="icon">Choose_icon</label>
            <div class="icon_search">
              <input type="text" id="icon" bind:value={dashboard_item_data.config.icon} placeholder="Search Icon" on:input={handle_icon_search}>
              {#if show_icon_suggestions}
                <div class="search_results">
                    {#each temp_imported_icons as module_icons,index}
                    <div class="individual_icons" on:click={()=>handle_select_icon(module_icons)}>
                      <span style="display: inline-block; width: 25px;">
                        <svelte:component this={module_icons} />
                      </span>
                      <p>{module_icons.name.match(/<(.*?)>/)[1]}</p>
                    </div>
                    {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/if}
      <div class="select_container">
        <div class="select_options_container">
            <label for="dashboard_width">Width (in px)</label>
            <input type="text" id="dashboard_width" bind:value={dashboard_item_data.config.width}>
        </div>
      </div>
      <div class="select_container">
        <div class="select_options_container">
            <label for="dashboard_height">Height (in px)</label>
            <input type="text" id="dashboard_height" bind:value={dashboard_item_data.config.height}/>
        </div>
      </div>
      {#if dashboard_item_data.config.dashboard_type == 'custom_table'}
        <div class="custom_table_container_outer">
          <div class="custom_table_container">
              <label for="dashboard_height">Add Columns</label>
              <button class="custom_table_button" on:click={handle_show_add_new_column_dialogue_box}>Add </button>
          </div>
          <div class="" style="min-height: 150px;" >
            {#if added_columns_array.length}
              <div class="added_columns_container">
                {#each added_columns_array as added_column}
                  <div class="added_column">
                    <p style="min-width: 150px;">{added_column.display_name}</p>
                    <button>
                      <span style="width: 12px;display:inline-block;">
                        <FaTrashAlt />
                      </span>
                    </button>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="no_items">
                <p>No column added</p>
              </div>
            {/if}
          </div>
        
        </div>
      {/if}
      <div class="select_container">
        <div class="select_options_container">
            <label for="dashboard_data_sqll">Dashboard Data SQL</label>
            <textarea name="" id="dashboard_data_sql" bind:value={dashboard_item_data.config.data_config.sql} on:click={handle_open_data_sql_editor}></textarea> 
            <span class="copy_sample_sql" on:click={handle_copy_sample_sql}> Copy Sample SQL</span>
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
        {#if edit_mode}
          <button on:click={handle_update}>Update Dashboard</button>
        {:else}
          <button on:click={handle_confirm}>Add Dashboard</button>
        {/if}
        <button class="cancel" on:click={handle_cancel}>Cancel</button>
      </div>
  </div>
  {#if show_data_sql_popup}
    <SqlEditorPopup bind:dashboard_data_sql={dashboard_item_data.config.data_config.sql} on:close_popup={handle_close_data_sql_editor} on:get_sql={handle_get_data_sql}/>
  {/if}
</div>

{#if show_add_column_popup}
  <div class="add_new_column_popup">
    <div class="add_new_column_container">
      <div class="header_container">
        <h1>Add New Column</h1>
      </div>
      <div class="input_elements_container">
          <div class="single_input_container">
              <label for="display_name">Display Name</label>
              <input type="text" id="display_name" bind:value={column_data_obj.display_name}>
          </div>
          <div class="single_input_container">
              <label for="column_id">ID</label>
              <input type="text" id="column_id" bind:value={column_data_obj.id_value_column}>
          </div>
          <div class="single_input_container">
              <label for="column_display_text">Display_text</label>
              <input type="text" id="column_display_text" bind:value={column_data_obj.display_text_column}>
          </div>
          <div class="single_input_container">
            <label for="item_display_type">Item Display Type</label>
              <select name="" id="item_display_type" bind:value={column_data_obj.display_data_type}>
                <option value="null">Text</option>
                <option value="goto_module">Decimal</option>
              </select>
          </div>
          <div class="single_input_container">
            <label for="action_type">Action Type</label>
              <select name="" id="action_type" bind:value={column_data_obj.action_type}>
                <option value="null">No Action</option>
                <option value="goto_module">Goto Module</option>
              </select>
          </div>
          <div class="select_container action_button_container">
            <div class="select_options_container" style="width: 80%;margin:0 auto; justify-content: center;">
                <label for="dashboard_action_button">Action Destination</label>
                <div class="selection_blocks" style="min-width: 60%;">
                  <div class="single_block">
                    <h3>Module</h3>
                    <select name="" id="" bind:value={goto_action_module} style="min-width: 150px;">
                      {#each config_json.modules as module}
                        <option value="{module.id}">{module.title}</option>  
                      {/each}
                    </select>
                  </div>
                  <div class="single_block">
                    <h3>Sub Module</h3>
                    <select name="" id="" bind:value={goto_action_submodule} style="min-width: 150px;">
                      {#each config_json.submodules.filter(item=>item.module == goto_action_module) as sub_module}
                        <option value="{sub_module.id}">{sub_module.title}</option>  
                      {/each}
                    </select>
                  </div>
                </div>
            </div>
          </div>
          <div class="add_new_column_button_container">
            <button class="add_column_button" on:click={handle_add_column}>Add Column</button>
            <button class="cancel_button" on:click={handle_cancel_add_column}>Cancel</button>
          </div>
      </div>
    </div>
    
  </div>
{/if}

<style>
.popup_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}
.popup_overlay.show_popup {
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup_container {
  display: flex;
  flex-direction: column;
  width: 900px;
  height: 650px;
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
.icon_search{
  width: 60%;
  position: relative;
}
.icon_search input{
  width: 100%;
}
.icon_search .search_results{
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* padding: 10px; */
  max-height: 300px;
  overflow: auto;
}
.icon_decision{
  position: absolute;
  top: 10%;
  right: -32%;
}
.icon_decision input{
  /* width: 15px;
  height: 15px; */
}
input[type="checkbox"]:focus {
  outline: none !important;
  border: none;

}
.icon_decision input:focus{
  outline: none;
}
.icon_decision label{
  font-size: 10px;
}
input:disabled{
  cursor: not-allowed;
}
.individual_icons{
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}
.individual_icons:hover{
  background-color: #007bff;
  color: #fff;
}
.individual_icons:hover p{
  color: #fff;
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
.single_block select{
  width: unset;
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
.copy_sample_sql{
  cursor: pointer;
  color: #1d4ed8;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 12px;
  transition: all 0.3s ease-out 0s;
}
.copy_sample_sql:hover{
  text-decoration: underline;
  transform: scale(1.02) translateY(-0.6px);
  color: #1d4ed8;
}

.custom_table_container{
  border-bottom: 1px solid #ded3d3;
}
.custom_table_container button{
  width: 88px;
  padding: 5px;
  margin-left: 20px;
  border-radius: 6px;
  font-size: 13px;
  background-color: rgb(81 131 32);
  margin-top: 12px;
}
.custom_table_container button:hover{
  background-color: rgb(101, 161, 41);
}
.no_items{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  font-size: 20px;
  color: #6c757d
}
.add_new_column_popup{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  inset: 0;
  background-color: #0000007a;
  z-index: 9999;
}
.add_new_column_container{
  width: 50%;
  margin:auto;
  height: 500px;
  background-color: #fff;
  border-radius: 10px;
  overflow-y: auto;
}
.add_new_column_container .header_container h1{
  font-size: 28px;
  text-align: center;
  padding-block: 15px;
}
.single_input_container{
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}
.add_new_column_button_container{
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding-top: 25px;
  gap: 25px;
}
.add_new_column_container .cancel_button{
  background-color: #6c757d;
}
.added_columns_container{
  padding-top: 20px;
  padding-left: 15px;
  display: flex; 
  flex-wrap: wrap; 
  gap: 30px;
}
.added_columns_container .added_column{
  display: flex;
  align-items: center;
  gap: 30px;
  border: 1px solid #dcd6d6;
  padding: 8px;
  border-radius: 10px;
}
.added_columns_container .added_column p{
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}
.added_columns_container .added_column button{
  width: 35px;
  padding: 8px;
  margin-bottom: 0 !important;
  margin-right: 0 !important;
  border-radius: 10px;
  background-color: red;
}

</style>