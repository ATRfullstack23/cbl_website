
<script>


    import EditableFormforArrayofObjects from "$lib/form_view/EditableFormforArrayofObjects.svelte";

    export let sub_module;
    export let grid;
    export let form_view;
    export let editable_data;
    export let editable_items_arr;

    let editable_form_for_array_of_objects_instance

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


<div class="editor-container">
    <div class="form_table">

        {#each editable_items_arr as item}

            {#if item.group_header}
                <p class="form_group_header">{item.group_header}</p>
            {/if}

            <div class="single_form_item" class:display_as_inline={item.display_as_inline}>
                <div class="editable_item_display_name" class:special_heading={item.data_type === 'array_of_objects'}>{item.display_name}</div>
                <div class="editable_item_form_element">

                    <div>
                        {#if item.input_type === 'single_line'}
                            <input class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                   on:change={handle_value_changed}
                                   type="text"/>
                        {/if}
                        {#if item.input_type === 'emoji'}
                            <input class="form_input_element emoji" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                   on:change={handle_value_changed}
                                   type="text"/>
                        {/if}

                        {#if item.input_type === 'css_unit'}
                            <input class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                   on:change={handle_value_changed}
                                   type="number"/>
                        {/if}

                        {#if item.input_type === 'color'}
                            <input class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                   data-coloris
                                   on:focus={(evt)=>{handle_form_item_focus(evt, item)}}
                                   on:change={handle_value_changed}
                                   type="text"/>
                        {/if}

                        {#if item.data_type === 'boolean' || item.data_type === 'bit'}
                            <input class="form_input_element" bind:this={item.form_element} bind:checked={editable_data[item.unique_id]}
                                   on:change={handle_value_changed}
                                   type="checkbox"/>
                        {/if}

                        {#if item.input_type === 'multiple_line'}
                                <textarea class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                          on:change={handle_value_changed}></textarea>
                        {/if}

                        {#if item.input_type === 'dropdownlist' || item.input_type === 'select'}
                            <select class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                    on:change={handle_value_changed}>
                                {#each item.options as option}
                                    <option value="{option.value}">{option.text}</option>
                                {/each}
                            </select>
                        {/if}


                        {#if item.input_type === 'column_id'}
                            <select class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                    on:change={handle_value_changed}>
                                {#each get_all_columns_as_array() as option}
                                    <option value="{option.id}">{option.displayName}</option>
                                {/each}
                            </select>
                        {/if}

                        {#if item.input_type === 'condition'}
                            <select class="form_input_element" bind:this={item.form_element} bind:value={editable_data[item.unique_id]}
                                    on:change={handle_value_changed}>
                                {#each get_all_conditions_as_array() as option}
                                    <option value="{option.value}">{option.text}</option>
                                {/each}
                            </select>
                        {/if}

                        <!--{#if item.data_type === 'array_of_objects'}-->
                        <!--&lt;!&ndash;    to do abn &ndash;&gt;-->
                        <!--    <EditableFormforArrayofObjects-->
                        <!--            sub_module="{sub_module}"-->
                        <!--            editable_data="{editable_data}"-->
                        <!--            editable_items_arr="{editable_items_arr}"-->
                        <!--            editable_array_of_object_item="{item}"-->
                        <!--            />-->
                        <!--{/if}-->

                        {#if item.postfix}
                            <span class="form_input_postfix">{item.postfix}</span>
                        {/if}
                    </div>

                </div>
            </div>
            {#if item.data_type === 'array_of_objects'}
                <!--    to do abn -->
                <EditableFormforArrayofObjects
                        bind:this={editable_form_for_array_of_objects_instance}
                        sub_module="{sub_module}"
                        editable_data="{editable_data}"
                        editable_items_arr="{editable_items_arr}"
                        editable_array_of_object_item="{item}"
                />
            {/if}
        {/each}

    </div>

</div>


<style>


    .form_table{
        display: block;
    }

    .single_form_item{
        align-items: center;
        display: flex;
        text-align: left;
        position: relative;

        & .editable_item_display_name{
            width: 200px;
        }

    }
    .editable_item_display_name.special_heading{
        /*border-bottom: 2px solid #2196F3;*/
        font-weight: 700;
        padding-top: 20px;
        position: relative;
    }
    .editable_item_display_name.special_heading::after{
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 130px;
        height: 2px;
        background-color: #2196F3;
    }

    .editor-container td{
        padding: 10px;
    }

    .editor-container {
        /*width: 100%;*/
        margin: 0 auto;
        min-height: 200px;
        border-bottom: 1px solid #ddd;
        margin-top: 50px;
        padding: 10px;
        background-color: #fff;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 75vh;
        overflow: auto;
    }

    .form_input_element{
        min-width: 250px;
        padding: 5px;
    }

    .form_group_header {
        padding: 5px;
        padding-left: 0;
        font-weight: bold;
        font-size: 16px;
        margin-top: 15px;
        margin-bottom: 20px;
    }

    .single_form_item.display_as_inline {
        display: inline-flex;
        margin-left: 10px;

        & .editable_item_display_name{
            width: 80px;
            font-size: 12px;
            position: absolute;
            left: 0;
            top: -20px;
        }

        & .form_input_element{
            min-width: 50px;
            width: 80px;
        }
    }


</style>