<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import * as monaco from 'monaco-editor';
    export let dashboard_data_sql = ''
    let editorContainer;
    let editor
    let dispatch = createEventDispatcher()

  
    onMount(() => {
        editor = monaco.editor.create(editorContainer, {
        value: dashboard_data_sql || '-- Write Your SQL Code',
        language: 'sql',
        theme: 'vs-light',
        automaticLayout: true,
        minimap: {
          enabled: false
        },
        fontSize: 16,
        lineHeight: 1.5,
        wordWrap: 'on',
        scrollbar: {
          vertical: 'none',
          horizontal: 'none'
        }
      });
  
      return () => editor.dispose();
    });
    function get_sql(){
      const sql = editor.getValue();
      dispatch('get_sql', sql);
    }
    function cancel_popup(){
        dispatch('close_popup');
    }
  </script>
  
  <div class="sql_container">
    <div bind:this={editorContainer} class="editor-container"></div>
    <div class="button_container">
      <button class="button confirm_button" on:click={get_sql}>Confirm</button>
      <button class="button cancel_button" on:click={cancel_popup}>Cancel</button>
    </div>
  </div>
  
  <style>
    .sql_container{
      width: 100%;
      background-color: rgba(135, 207, 235, 0.363);
      background-color: #2d3e50a1;
      position: fixed;
      top: 0;
      left: 0;
      min-height: 100vh;
      z-index: 999999;
  
    }
    .editor-container {
      width: 60%;
      margin: 0 auto;
      height: 400px;
      border-bottom: 1px solid #ddd;
      margin-top: 50px;
      padding: 10px;
      background-color: #fff;
      border-radius: 12px 12px 0 0;
    }
    div{
      max-width: 100%;
    }
    .button_container{
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
    .button{
      padding: 5px 15px;
      color: #fff;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s;
      font-size: 14px;
      font-weight: 600;
    }
    .confirm_button{
      background-color: #4889f4;
    }
    .cancel_button{
      background-color: #fff;
      color: rgb(109, 108, 108);
      border: 1px solid #ddd;
    }
    .confirm_button:hover{
      background-color: #447ae8;
    }
    .cancel_button:hover{
      background-color: #ddd;
      border: 1px solid #a5a3a3;
    }
  </style>
  