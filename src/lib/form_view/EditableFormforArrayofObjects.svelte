
<script>


    export let sub_module;
    export let form_view;
    export let editable_data;
    export let editable_items_arr;
    export let editable_array_of_object_item;


    let custom_schema_array = editable_array_of_object_item.custom_schema;
    // if(!editable_data[editable_array_of_object_item.unique_id]){
    //     const key_object = {}
    //     custom_schema_array.forEach(item => {
    //         key_object[item.unique_id] = ""
    //     })
    //     editable_data[editable_array_of_object_item.unique_id] = [
    //         key_object
    //     ];
    // }

    editable_data[editable_array_of_object_item.unique_id] = editable_data[editable_array_of_object_item.unique_id] || [];

    function handle_value_changed(evt) {
        console.log('handle_value_changed', evt)
    }

    function handle_form_item_focus(evt, item) {
        console.log('handle_form_item_focus', item);

        if(item.input_type === 'color'){
            Coloris({
                // parent: `#form_element_${item.unique_id}`,
                theme: 'pill',
                themeMode: 'dark',
                format: 'rgb',
                formatToggle: false,
                closeButton: true,
                clearButton: true,
                alpha: true,

                swatches: [
                    '#264653',
                    '#2a9d8f',
                    '#e9c46a',
                    '#f4a261',
                    '#e76f51',
                    '#d62828',
                    '#023e8a',
                    '#0077b6',
                    '#0096c7',
                    '#00b4d8',
                    '#48cae4'
                ]
            });
        }
    }

    function get_all_columns_as_array() {
        return form_view?.get_all_columns_as_array() || sub_module?.get_all_columns_as_array();
    }


    function add_new_object_into_custom_schema() {
        editable_data[editable_array_of_object_item.unique_id].push({
            _created_at: Date.now()
        });
        editable_data = editable_data;
    }

    function delete_editable_data_array_item(index) {
        if(editable_data[editable_array_of_object_item.unique_id].length === 0){
            return
        }
        editable_data[editable_array_of_object_item.unique_id].splice(index, 1);
        editable_data = editable_data;
    }



    function get_all_conditions_as_array() {
        return [
            {
                text: "Equals",
                value: 'equals'
            },
            {
                text: "Not Equals",
                value: 'not_equals'
            },
            {
                text: "Greater than",
                value: 'greater_than'
            },
            {
                text: "Less than",
                value: 'less_than'
            },
            {
                text: "Greater than or Equal To",
                value: 'greater_than_or_equals'
            },
            {
                text: "Less than or Equal To",
                value: 'less_than_or_equals'
            },
        ];
    }



</script>
<div class="button_container">
    <button on:click={add_new_object_into_custom_schema}>add</button>
</div>

<div class="outer_container">
    {#each editable_data[editable_array_of_object_item.unique_id] as data_row, index}
        <div class="editor-container">

        {#each custom_schema_array as item}
                <div class="form_table">
                    <div class="editable_item_form_element">
                        <div class="inputs_container">
                            {#if item.input_type === 'column_id'}
                                <select class="form_input_element" bind:value={data_row[item.unique_id]}
                                        on:change={handle_value_changed}>
                                    {#each get_all_columns_as_array() as option}
                                        <option value="{option.id}">{option.displayName}</option>
                                    {/each}
                                </select>
                            {/if}
                            {#if item.input_type === 'single_line'}
                                <input class="form_input_element" bind:value={data_row[item.unique_id]}
                                       placeholder="{item.placeholder}"
                                       on:change={handle_value_changed}
                                       type="text"/>

                            {/if}


                            {#if item.input_type === 'condition'}
                                <select class="form_input_element" bind:this={item.form_element} bind:value={data_row[item.unique_id]}
                                        on:change={handle_value_changed}>
                                    {#each get_all_conditions_as_array() as option}
                                        <option value="{option.value}">{option.text}</option>
                                    {/each}
                                </select>
                            {/if}


                            {#if item.postfix}
                                <span class="form_input_postfix">{item.postfix}</span>
                            {/if}
                        </div>
                    </div>
                </div>

        {/each}
            <div class="delete_button_container">
                <button on:click={()=>delete_editable_data_array_item(index)}><span class="fa fa-trash"></span></button>
            </div>
        </div>
    {/each}
</div>


<style>
    .outer_container{
        min-height: 50px;
        /*max-height: 200px;*/
        overflow-y: scroll;
    }
    .form_table{
        display: block;
    }

    .editor-container td{
        padding: 10px;
    }

    .editor-container {
        width: 60%;
        /*margin: 0 auto;*/
        background-color: #fff;
        border-radius: 12px 12px 0 0;
        padding-bottom: 10px;
        display: flex;
        gap: 10px;
    }

    .form_input_element{
        min-width: 150px;
        padding: 5px;
    }

    .button_container{
        text-align: right;
        padding-right: 25px;
        margin-bottom: 10px;
        margin-top: -30px;
        position: relative;
        z-index: 2;
    }
    .button_container button{
        padding: 5px 10px;
        background-color: #007bff;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
    }
    .delete_button_container button{
        padding: 5px 10px;
        background-color: #c61b1b;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        margin-top: -1px;
    }



</style>