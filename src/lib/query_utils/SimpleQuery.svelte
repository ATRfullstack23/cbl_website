<script>
    import { onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte'
    let table_data = [
        {
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    id: 1,
                },
                {
                    title: 'Age',
                    dataIndex: 'age',
                    id: 2,
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    id: 3,
                },
            ],
            table_name: 'customer_profile',
            table_id: 1,
        },
    ]
    let show_conditions = false
    let show_multiselection = false

    let selected_columns = []
    let all_columns_selected = '*'
    let selected_table = ''
    let where_clause = ''

    let show_advanced_section = false
    let icon_arrow
    function handle_show_advance_query() {
        show_advanced_section = !show_advanced_section
        jQuery(icon_arrow).toggleClass('change_icon')
    }

    let top_checked = false
    let distinct_checked = false
    let order_by_checked = false
    let top_value = ''
    let order_by_label

    function fadeSlide(node, options) {
        const slideTrans = slide(node, options)
        return {
            duration: options.duration,
            css: (t) => `
				${slideTrans.css(t)}
				opacity: ${t};
			`,
        }
    }

    let order_by_items_array = [
        {
            table_name: selected_table,
            column_name: '',
            order: 'ASC',
        },
    ]
    function handle_toggle_order_by() {
        if (order_by_checked) {
            order_by_label.style.textDecoration = 'underline'
        } else {
            order_by_label.style.textDecoration = 'none'
        }
    }

    function handle_add_order_by() {
        let addition_object = {
            table_name: selected_table,
            column_name: '',
            order: 'ASC',
        }

        order_by_items_array.push(addition_object)
        order_by_items_array = order_by_items_array
        console.log(order_by_items_array);
    }

    function handle_delete_order_by(item, index) {
        if (order_by_items_array.length === 1) {
            alert('You Cannot delete last item')
            return
        }
        order_by_items_array.splice(index, 1)
        order_by_items_array = order_by_items_array
    }

    function handle_toggle_selected_columns(selected_column) {
        if (!selected_column) {
            all_columns_selected = '*'
            show_multiselection = false
            selected_columns = table_data.filter(
                (table) => table.table_name === selected_table,
            )[0].columns
            // selected_columns = table_data[0].columns
            for (let single_column of table_data.filter(
                (table) => table.table_name === selected_table,
            )[0].columns) {
                single_column.selected = true
                table_data = table_data
            }
            console.log(all_columns_selected)
            return
        }
        if (selected_column.selected) {
            selected_columns = [...selected_columns, selected_column]
            if (
                selected_columns.length ===
                table_data.filter(
                    (table) => table.table_name === selected_table,
                )[0].columns.length
            ) {
                all_columns_selected = '*'
            }
        } else {
            selected_columns = selected_columns.filter(
                (column) => column !== selected_column,
            )
            all_columns_selected = ''
        }
        for (let single_column of table_data.filter(
            (table) => table.table_name === selected_table,
        )[0].columns) {
            if (!single_column.selected) {
                all_columns_selected = ''
            }
        }
        console.log(selected_columns, all_columns_selected)
    }
    function handle_show_conditions(action) {
        show_multiselection = false
        if (action === 'add') {
            show_conditions = true
            where_clause = 'WHERE'
        } else if (action === 'cancel') {
            show_conditions = false
            where_clause = ''
        }
    }
    function handle_select_colums(e) {
        show_multiselection = !show_multiselection
        if (show_multiselection) {
            e.target.innerText = 'Close'
        } else {
            e.target.innerText = 'Select'
        }
    }

    function handle_generate_query() {
        show_multiselection = false
        if (!selected_table) {
            alert('Please select table')
            return
        }
        if (!show_conditions) {
            let order_by_query = ''
            order_by_query = order_by_items_array.map(item=>`${item.column_name} ${item.order}`).join(',')
            if (all_columns_selected === '*') {
                if(top_checked && top_value.length){
                    if(distinct_checked){
                        if(order_by_checked){
                            console.log(
                                `SELECT DISTINCT TOP ${top_value} ${all_columns_selected} FROM ${selected_table} ORDER BY ${order_by_query}`,
                            )
                        }else{
                            console.log(
                                `SELECT DISTINCT TOP ${top_value} ${all_columns_selected} FROM ${selected_table}`,
                            )
                        }
                    }else if(order_by_checked){
                        console.log(
                                `SELECT TOP ${top_value} ${all_columns_selected} FROM ${selected_table} ORDER BY ${order_by_query}`,
                            )
                    }else{
                        console.log(
                        `SELECT TOP ${top_value} ${all_columns_selected} FROM ${selected_table}`,
                        )
                    }
                }
                else if(distinct_checked){
                    if(order_by_checked){
                        console.log(
                                `SELECT DISTINCT ${all_columns_selected} FROM ${selected_table} ORDER BY ${order_by_query}`,
                            )
                    }else{
                        console.log(
                            `SELECT DISTINCT ${all_columns_selected} FROM ${selected_table}`,
                        )
                    }
                }else if(order_by_checked){
                    console.log(
                                `SELECT ${all_columns_selected} FROM ${selected_table} ORDER BY ${order_by_query}`,
                            )
                }else{
                    console.log(
                        `SELECT ${all_columns_selected} FROM ${selected_table}`,
                    )
                }
            }
            else {
                if(top_checked && top_value.length){
                    if(distinct_checked){
                        if(order_by_checked){
                            console.log(
                                `SELECT DISTINCT TOP ${top_value} ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ORDER BY ${order_by_query}`,
                            )
                        }else{
                            console.log(
                                `SELECT DISTINCT TOP ${top_value} ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table}`,
                            )
                        }
                    }else if(order_by_checked){
                        console.log(
                                `SELECT TOP ${top_value} ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ORDER BY ${order_by_query}`,
                            )
                    }else{
                        console.log(
                        `SELECT TOP ${top_value} ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table}`,
                        )
                    }
                }
                else if(distinct_checked){
                    if(order_by_checked){
                        console.log(
                                `SELECT DISTINCT ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ORDER BY ${order_by_query}`,
                            )
                    }else{
                        console.log(
                            `SELECT DISTINCT ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table}`,
                        )
                    }
                }else if(order_by_checked){
                    console.log(
                                `SELECT ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ORDER BY ${order_by_query}`,
                            )
                }else{

                    console.log(
                        `SELECT ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table}`,
                    )
                }
            }
        }
        else{
            let json = jQuery('#builder').queryBuilder('getSQL')
            console.log(json)
            let order_by_query = ''
            order_by_query = order_by_items_array.map(item=>`${item.column_name} ${item.order}`).join(',')

            const result_obj ={};

            if (show_conditions && !json) {
                alert('Please apply conditions')
                return
            }
            else if (json) {
                result_obj.order_by_checked = order_by_checked;
                result_obj.distinct_checked = distinct_checked;

                if (all_columns_selected === '*') {
                    if(top_checked && top_value.length){
                        if(distinct_checked){
                            if(order_by_checked){
                                result_obj.sql_query = `SELECT DISTINCT TOP ${top_value} ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`;
                                console.log(
                                    `SELECT DISTINCT TOP ${top_value} ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                            }
                            else{
                                console.log(
                                    `SELECT DISTINCT TOP ${top_value} ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql}`,
                                )
                            }
                        }
                        else if(order_by_checked){
                            console.log(
                                    `SELECT TOP ${top_value} ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                        }
                        else{
                            console.log(
                            `SELECT TOP ${top_value} ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql}`,
                            )
                        }
                    }
                    else if(distinct_checked){
                        if(order_by_checked){
                            console.log(
                                    `SELECT DISTINCT ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                        }else{
                            console.log(
                                `SELECT DISTINCT ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql}`,
                            )
                        }
                    }else if(order_by_checked){
                        console.log(
                                    `SELECT ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                    }else{
                        console.log(
                            `SELECT ${all_columns_selected} FROM ${selected_table} ${where_clause} ${json.sql}`,
                        )
                    }
                }
                else {
                    if(top_checked && top_value.length){
                        if(distinct_checked){
                            if(order_by_checked){
                                console.log(
                                    `SELECT DISTINCT TOP ${top_value} ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                            }else{
                                console.log(
                                    `SELECT DISTINCT TOP ${top_value} ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ${where_clause} ${json.sql}`,
                                )
                            }
                        }else if(order_by_checked){
                            console.log(
                                    `SELECT TOP ${top_value} ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                        }else{
                            console.log(
                            `SELECT TOP ${top_value} ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ${where_clause} ${json.sql}`,
                            )
                        }
                    }
                    else if(distinct_checked){
                        if(order_by_checked){
                            console.log(
                                    `SELECT DISTINCT ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ORDER BY ${order_by_query} ${where_clause} ${json.sql}`,
                                )
                        }else{
                            console.log(
                                `SELECT DISTINCT ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ${where_clause} ${json.sql}`,
                            )
                        }
                    }else if(order_by_checked){
                        console.log(
                                    `SELECT ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                    }else{

                        console.log(
                            `SELECT ${selected_columns.map((column) => column.dataIndex).join(',')} FROM ${selected_table} ${where_clause} ${json.sql}`,
                        )
                    }
                }
            }
        }
    }
    let options = {
        allow_empty: false,
        display_errors: true,
        default_condition: 'AND',
        filters: [
            {
                id: 'name',
                label: 'Name',
                type: 'string',
                description: 'sample abn',
            },
            {
                id: 'category',
                label: 'Category',
                type: 'integer',
                input: 'select',
                values: {
                    1: 'Books',
                    2: 'Movies',
                    3: 'Music',
                    4: 'Tools',
                    5: 'Goodies',
                    6: 'Clothes',
                },
                operators: [
                    'equal',
                    'not_equal',
                    'in',
                    'not_in',
                    'is_null',
                    'is_not_null',
                ],
            },
            {
                id: 'in_stock',
                label: 'In stock',
                type: 'integer',
                input: 'radio',
                values: {
                    1: 'Yes',
                    0: 'No',
                },
                operators: ['equal'],
            },
            {
                id: 'price',
                label: 'Price',
                type: 'double',
                validation: {
                    min: 0,
                    step: 0.01,
                },
            },
            {
                id: 'id',
                label: 'Identifier',
                type: 'string',
                placeholder: '____-____-____',
                operators: ['equal', 'not_equal'],
                validation: {
                    format: /^.{4}-.{4}-.{4}$/,
                },
            },
        ],
    }
    onMount(() => {
        console.log('the simple query component is being mounted')
        jQuery('#builder').queryBuilder(options)
    })
</script>

<div class="table_selector_inner">
    <div class="inner_container">
        <div class="table_selector">
            <h3>Module</h3>
            <select
                name=""
                id="">
                {#each table_data as table}
                    <option value={table.table_name}>{table.table_name}</option>
                {/each}
            </select>
        </div>
        <div class="table_selector">
            <h3>SubModule</h3>
            <select
                name=""
                id=""
                bind:value={selected_table}>
                {#each table_data as table}
                    <option value={table.table_name}>{table.table_name}</option>
                {/each}
            </select>
        </div>
        <div class="table_selector">
            <h3>Columns</h3>
            <!-- <span on:click={handle_select_colums}>Select</span> -->
            <div
                class="multiselection"
                class:show_multiselection={selected_table !== ''}>
                <p
                    style="text-align: center;"
                    on:click={() => handle_toggle_selected_columns()}>
                    Select All
                </p>
                {#each table_data as table}
                    {#if table.table_name === selected_table}
                        {#each table.columns as column, index}
                            <p>
                                <input
                                    type="checkbox"
                                    name=""
                                    id="col_{index}"
                                    bind:checked={column.selected}
                                    on:change={() =>
                                        handle_toggle_selected_columns(
                                            column,
                                        )} />
                                <label for="col_{index}">{column.title}</label>
                            </p>
                        {/each}
                    {/if}
                {/each}
            </div>
        </div>
    </div>
    <div class="advance_query_container">
        <div class="advance_header">
            <p on:click={handle_show_advance_query}>
                Advanced Queries <span
                    class="icon_arrow"
                    bind:this={icon_arrow}
                    ><i class="fa fa-angle-down"></i></span>
            </p>
        </div>
        {#if show_advanced_section}
            <div
                class="advance_query_body"
                transition:fadeSlide={{ duration: 400 }}>
                <div class="multiple_query_adder">
                    <div class="query_input">
                        <input
                            bind:checked={top_checked}
                            type="checkbox"
                            name=""
                            id="top" />
                        <label for="top"> TOP </label>
                        <input
                            bind:value={top_value}
                            class:not_allowed={!top_checked}
                            type="text"
                            disabled={!top_checked} />
                    </div>
                </div>
                <div class="multiple_query_adder">
                    <div class="query_input">
                        <input
                            bind:checked={distinct_checked}
                            type="checkbox"
                            name=""
                            id="top" />
                        <label for="top"> DISTINCT </label>
                    </div>
                </div>
                <div class="multiple_query_adder">
                    <div class="query_input">
                        <input
                            bind:checked={order_by_checked}
                            on:change={handle_toggle_order_by}
                            type="checkbox"
                            name=""
                            id="order_by" />
                        <label
                            for="order_by"
                            bind:this={order_by_label}>
                            ORDER BY
                        </label>
                        {#if order_by_checked}
                            <button
                                class="btn btn-primary add_button"
                                on:click={handle_add_order_by}>
                                + Add
                            </button>
                        {/if}
                    </div>
                    {#if order_by_checked}
                        <div class="order_by_selector">
                            {#each order_by_items_array as item, index}
                                <div class="main_table_selector">
                                    <div class="table_selector">
                                        <h3>Module</h3>
                                        <select
                                            name=""
                                            id="">
                                            {#each table_data as table}
                                                <option value={table.table_name}
                                                    >{table.table_name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div class="table_selector">
                                        <h3>SubModule</h3>
                                        <select
                                            name=""
                                            id=""
                                            >
                                           
                                                <option value={selected_table}
                                                    >{selected_table}</option>
                                            
                                        </select>
                                    </div>
                                    <div class="column_selector">
                                        <h3>Columns</h3>
                                        <!-- <span on:click={handle_select_columns}>Select</span> -->
                                        <div>
                                            {#each table_data as table}
                                                {#if table.table_name === selected_table}
                                                    <select
                                                        name=""
                                                        id=""
                                                        bind:value={item.column_name}>
                                                        {#each table.columns as column, index}
                                                            <option
                                                                value={column.title}
                                                                >{column.title}</option>
                                                        {/each}
                                                    </select>
                                                {/if}
                                            {/each}
                                        </div>
                                    </div>
                                    <div
                                        class="column_selector"
                                        style="margin-left: 25px;">
                                        <h3>Order Type</h3>
                                        <!-- <span on:click={handle_select_columns}>Select</span> -->
                                        <div>
                                            <select
                                                name=""
                                                id=""
                                                bind:value={item.order}>
                                                <option value="ASC">ASC</option>
                                                <option value="DESC"
                                                    >DESC</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="order_item_delete_container">
                                        <button
                                            on:click={() =>
                                                handle_delete_order_by(
                                                    item,
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
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<div class="create_condition_container">
    {#if !show_conditions}
        <button
            class="btn btn-success"
            on:click={() => handle_show_conditions('add')}>
            Add Condition</button>
    {/if}
    {#if show_conditions}
        <button
            class="btn btn-danger"
            on:click={() => handle_show_conditions('cancel')}
            >Remove Condition</button>
    {/if}
</div>
<div
    class="conditions_outer"
    class:show_conditions={!show_conditions}>
    <div id="builder"></div>
</div>
<div class="query_confirmation_container">
    <button
        class="btn btn-primary parse_json"
        on:click={handle_generate_query}>Apply</button>
    <button class="btn btn-secondary parse_json cancel_button">Cancel</button>
</div>

<style>
    .table_selector_inner {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 5px;
        border: 1px solid #00000036;
        padding: 15px;
        border-radius: 15px;
    }
    .inner_container {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding-bottom: 20px;
    }
    .table_selector {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .table_selector h3 {
        margin: 0;
        margin-bottom: 5px;
        color: #606060;
        font-size: 12px;
    }
    .table_selector select {
        padding: 10px 20px;
        padding-left: 0px;
        border-radius: 4px;
        margin: 0 0px;
        text-transform: capitalize;
        position: relative;
        font-size: 14px;
        font-weight: 500;
        color: #303030;
        padding-bottom: 10px;
        height: 40px;
        box-sizing: border-box;
        cursor: pointer;
        /* border: 0; */
        /* outline: none !important; */
        width: 100%;
        padding: 6px;
        border-radius: 8px;
    }

    .table_selector .multiselection {
        display: none;
        visibility: hidden;
        opacity: 0;
        background-color: #fff;
        /* width: 100%; */
        border: 1px solid #80808036;
        display: flex;
        max-width: 400px;
        overflow-x: auto;
        min-width: 150px;
        flex-wrap: wrap;
    }
    .table_selector .show_multiselection {
        display: flex;
        visibility: visible;
        opacity: 1;
    }
    .multiselection p {
        padding-inline: 5px;
        margin: 0;
        margin-right: 10px;
        margin-bottom: 10px;
        margin-top: 10px;
        border: 1px solid #0000006e;
        border-radius: 5px;
    }
    .multiselection p:hover {
        cursor: pointer;
        color: #000;
        background-color: #8080804a;
    }
    .create_condition_container {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 2px;
        padding: 10px;
    }
    #builder {
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
    }
    .parse_json {
        width: 200px;
        margin-top: 15px;
    }
    :global(.query-builder .rules-group-container) {
        width: 80%;
    }
    :global(#builder_group_0) {
        margin: 0 auto;
    }
    .show_conditions {
        display: none;
        visibility: hidden;
        opacity: 0;
    }
    .query_confirmation_container {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 20px;
        padding: 10px;
        display: flex;
        justify-content: center;
    }
    .query_confirmation_container .cancel_button {
        margin-left: 20px;
        background-color: burlywood;
        outline: none;
        border: none;
    }
    .query_confirmation_container .cancel_button:hover {
        background-color: #ccaf58;
    }

    .advance_query_container {
        padding-left: 25px;
    }
    .advance_header {
        display: flex;
    }
    .advance_header p {
        margin: 0;
        color: #0064bd;
        /* text-decoration: underline #0064bd; */
        /* text-underline-offset: 5px; */
        cursor: pointer;
        border-bottom: 2px solid #0064bd;
    }
    .icon_arrow {
        margin-left: 10px;
        font-weight: 500;
    }
    .icon_arrow i {
        transition: all 0.3s ease;
    }
    :global(.icon_arrow.change_icon) i {
        transform: rotate(-180deg);
    }
    .advance_query_body {
        padding-top: 15px;
    }
    .advance_query_body input:first-child {
        margin-right: 10px;
    }
    .advance_query_body input:last-child {
        margin-left: 10px;
        outline: none;
        border: 1px solid rgb(156, 154, 154);
        border-radius: 5px;
        cursor: pointer;
        padding: 3px;
    }
    .advance_query_body input:last-child:global(.not_allowed) {
        cursor: not-allowed;
        background-color: #f7f7f7;
    }
    .multiple_query_adder:first-child {
        margin-bottom: 10px;
    }
    .multiple_query_adder:last-child label {
        font-size: 18px;
        /* text-decoration: underline; */
        text-underline-offset: 5px;
        transition: all 1000ms ease;
    }
    .order_by_selector .main_table_selector {
        margin-top: 17px;
        flex-wrap: wrap;
    }
    .order_by_selector .column_selector {
        min-height: 65px;
    }
    .order_by_selector .column_selector:last-child {
        margin-left: 25px;
    }
    .add_button_container {
        margin-top: 10px;
    }
    .add_button {
        margin-left: 13px;
        padding: 4px 7px;
        font-size: 10px;
        cursor: pointer;
    }
    .add_button:hover {
        background-color: #0d4c83;
    }
    .order_item_delete_container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 15px;
        margin-left: 20px;
    }

    .order_item_delete_container button {
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        color: #c01414;
    }
    .main_table_selector {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding-left: 25px;
        margin-top: 25px;
        margin-bottom: 25px;
    }
    .main_table_selector {
        margin-bottom: 5px;
    }
    .table_selector {
        margin-right: 20px;
        position: relative;
    }
    .table_selector h3,
    .column_selector h3 {
        font-size: 16px;
        margin-bottom: 5px;
        font-weight: 500;
        color: #606060;
    }
    .table_selector select {
        padding: 10px 20px;
        padding-left: 0px;
        border-radius: 4px;
        margin: 0 0px;
        text-transform: capitalize;
        position: relative;
        font-size: 14px;
        font-weight: 500;
        color: #303030;
        padding-bottom: 10px;
        height: 40px;
        box-sizing: border-box;
        cursor: pointer;
        border: 1px solid #00000014;
        width: 100%;
    }
</style>
