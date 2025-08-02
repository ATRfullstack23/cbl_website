
<script>


    export let sub_module;
    export let form_view;
    export let editable_data;
    export let editable_items_arr;
    export let editable_array_of_object_item;


    let custom_schema_array = editable_array_of_object_item.custom_schema
    if(!editable_data[editable_array_of_object_item.unique_id]){
        const key_object = {}
        custom_schema_array.forEach(item => {
            key_object[item.unique_id] = ""
        })
        editable_data[editable_array_of_object_item.unique_id] = [
            key_object
        ];
    }

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


    export function insert_into_custom_schema(item){

    }

</script>

<div class="outer_container">
    {#each editable_data[editable_array_of_object_item.unique_id] as item}
        <div class="editor-container">
            <div class="form_table">
                <div class="editable_item_form_element">
                    <div class="inputs_container">
                        {#if item.input_type === 'column_id'}
                            <select class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                    on:change={handle_value_changed}>
                                {#each get_all_columns_as_array() as option}
                                    <option value="{option.id}">{option.displayName}</option>
                                {/each}
                            </select>
                        {/if}
                        {#if item.input_type === 'single_line'}
                            <input class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                   placeholder="{item.placeholder}"
                                   on:change={handle_value_changed}
                                   type="text"/>
                        {/if}

                        {#if item.postfix}
                            <span class="form_input_postfix">{item.postfix}</span>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>


<style>
.outer_container{
    display: flex;
}
    .form_table{
        display: block;
    }

    .editor-container td{
        padding: 10px;
    }

    .editor-container {
        width: 60%;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 12px 12px 0 0;
        padding-bottom: 10px;
    }

    .form_input_element{
        min-width: 150px;
        padding: 5px;
    }



</style>