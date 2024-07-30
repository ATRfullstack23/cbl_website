<script>
    import { onMount } from 'svelte';
      import { createEventDispatcher } from 'svelte';
    import icons from '$lib/svelte_icons/icons.json'
    import SqlEditorPopup from '$lib/editor_utils/SqlEditorPopup.svelte';
    import {
        update_dashboard_item_in_server,
        get_all_dashboards_of_user
    } from "$lib/dashboard_utils/DashboardHelper.js";
    export let dashboard_item_config
    console.log('dashboard_item_config', dashboard_item_config);
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
        console.log('dashboard_icon', dashboard_item_config.config.icon);
      show_icon_suggestions = true
      if(dashboard_item_config.config.icon.length){
        temp_imported_icons = imported_icons.filter(item=>item.name.toLowerCase().includes(dashboard_item_config.config.icon.toLowerCase()))
      }else{
        temp_imported_icons = temp_imported_icons
        show_icon_suggestions = false
      }
    }
    function handle_select_icon(icon_data){
      show_icon_suggestions = false
      dashboard_item_config.config.icon = icon_data.name.match(/<(.*?)>/)[1]
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
      "title": "",
      "icon":"",
      "data_config": {
          "sql": "" },
      "width": "25%",
      "height": "150"
    }
  
    async function handle_confirm() {
  
      //   test hardcoded insert by aki
  
        // let dashboard_item_to_insert = {};
        // if(dashboard_type == "card"){
        //   card_dashboard_config.title = dashboard_title
        //   card_dashboard_config.icon = dashboard_icon
        //   card_dashboard_config.data_config.sql = dashboard_data_sql
        //   dashboard_item_to_insert = card_dashboard_config
        // }else{
        //   dashboard_item_to_insert = {
        //     "type": "report_item",
        //     "report_item_type": "card",
        //     "title": "Credit Notes",
        //     "icon":"FaAd",
        //     "data_config": {
        //         "sql": "select total_amount as value_1, 'Approved' as sub_note_1, '22' as value_2, 'Total Sales' as sub_note_2\nfrom sales_credit_note scn where scn.credit_note_status = 'approved'" },
        //     "width": "25%",
        //     "height": "150"
        //   }
        // }
        console.log('dashboard_item_config', dashboard_item_config);
        await update_dashboard_item_in_server(1000003, dashboard_item_config.id, dashboard_item_config);
  
        await get_all_dashboards_of_user();
        location.href = location.href + '';
        location.reload();
  
  
      handle_cancel()
    }
  
    function handle_cancel() {
      dispatch('cancel');
    }
  
  
    let dashboard_type = 'card';
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
      dashboard_data_sql = e.detail
      handle_close_data_sql_editor()
    }
  
    function get_sample_sql_code(dashboard_type){
      switch (dashboard_type) {
        case 'line':
            return '-- Sample line chart sql'
        case 'bar':
            return '-- Sample bar chart sql'
        case 'pie':
            return '-- Sample pie chart sql'
        case 'table':
            return '-- Sample table sql'
        case 'list':
            return '-- Sample list sql'
        case 'doughnut':
            return '-- Sample doughnut chart sql'
        case 'card':
            return `select total_amount as value_1, 'Approved V2' as sub_note_1, '22' as value_2, 'Total Sales V2' as sub_note_2  from sales_credit_note scn where scn.credit_note_status = 'approved'`
        default:
            return '-- Sample card sql'
      }
    }
  
    async function handle_copy_sample_sql(event){
      let button_text = event.target.innerText
      try{
        sample_sql_code = get_sample_sql_code(dashboard_item_config.config.dashboard_type)
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
  
    
    onMount(async () => {
      await import_icons();
      temp_imported_icons = imported_icons
    })
  </script>
  
  <div class="popup_overlay">
    <div class="popup_container">
        <div class="select_container">
            <div class="select_options_container">
              <label for="dashboard_type">Dashboard Type:</label>
                <select id="dashboard_type" bind:value={dashboard_item_config.config.dashboard_type} on:change={handle_change_dashboard_type}>
                    {#each dashboard_types as layout}
                    <option value={layout.type}>{layout.label}</option>
                    {/each}
                </select>
            </div>
            <div class="selected_option_image_container">
              <img class="layout_image" src={get_image_for_dashboard_type(dashboard_item_config.config.dashboard_type)} alt={dashboard_item_config.config.dashboard_type} />
            </div>
        </div>
        <div class="select_container">
            <div class="select_options_container">
                <label for="dashboard_title">Dashboard Title</label>
                <input type="text" id="dashboard_title" bind:value={dashboard_item_config.config.title}>  
            </div>
        </div>
        {#if dashboard_type == "table"}
          <div class="select_container">
              <div class="select_options_container">
                  <label for="dashboard_description">Description</label>
                  <input type="text" id="dashboard_description" bind:value={dashboard_item_config.config.dashboard_description}> 
              </div>
          </div>
        {/if}
        {#if dashboard_type != 'card' && dashboard_type != 'list' && dashboard_type != 'table'}  
          <div class="select_container">
              <div class="select_options_container">
                  <label for="dashboard_title_sql">Title SQL</label>
                  <textarea name="" id="dashboard_title_sql" bind:value={dashboard_item_config.config.dashboard_title_sql}></textarea>
              </div>
          </div>
        {/if}
        <div class="select_container">
          <div class="select_options_container icons_container">
            <label for="icon">Choose_icon</label>
            <div class="icon_search">
              <input type="text" id="icon" disabled={!is_icon_needed} bind:value={dashboard_item_config.config.icon} placeholder="Search Icon" on:input={handle_icon_search}>
              <span class="icon_decision"><input type="checkbox" name="" id="icon_decision" bind:checked={is_icon_needed}> <label for="icon_decision">Uncheck if you dont want icon</label></span>
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
        <div class="select_container">
          <div class="select_options_container">
              <label for="dashboard_width">Width (in px)</label>
              <input type="text" id="dashboard_width" bind:value={dashboard_item_config.config.width}>
          </div>
        </div>
        <div class="select_container">
          <div class="select_options_container">
              <label for="dashboard_height">Height (in px)</label>
              <input type="text" id="dashboard_height" bind:value={dashboard_item_config.config.height}/>
          </div>
        </div>
        <div class="select_container">
          <div class="select_options_container">
              <label for="dashboard_data_sqll">Dashboard Data SQL</label>
              <textarea name="" id="dashboard_data_sql" bind:value={dashboard_item_config.config.data_config.sql} on:click={handle_open_data_sql_editor}></textarea> 
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
          <button on:click={handle_confirm}>Update Item</button>
          <button class="cancel" on:click={handle_cancel}>Cancel</button>
        </div>
    </div>
    {#if show_data_sql_popup}
      <SqlEditorPopup bind:dashboard_data_sql={dashboard_item_config.config.data_config.sql} on:close_popup={handle_close_data_sql_editor} on:get_sql={handle_get_data_sql}/>
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
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
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
  </style>