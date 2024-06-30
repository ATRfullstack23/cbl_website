<script>
    import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
    import { onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte'
    let table_data = [
        {
            columns: [
                {
                    title: 'Id',
                    dataIndex: 'id',
                    id: 0,
                },
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
        {
            columns: [
                {
                    title: 'Customer_id',
                    dataIndex: 'customer_id',
                    id: 1,
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    id: 2,
                },
            ],
            table_name: 'address_profile',
            table_id: 2,
        },
    ]
    let join_types = [
        {
            id: 1,
            label: 'INNER',
            value: 'INNER JOIN',
        },
        {
            id: 2,
            label: 'LEFT',
            value: 'LEFT JOIN',
        },
        {
            id: 3,
            label: 'FULL',
            value: 'FULL OUTER JOIN',
        },
    ]

    let selected_table = ''
    let selected_secondary_table = ''
    let show_secondary_multi_selection = false
    let show_multi_selection = false
    let show_secondary_table_adder = false
    let selected_join_type = ''
    let selected_main_table_name = ''
    let selected_secondary_table_name = ''
    let selected_main_table_column = ''
    let selected_secondary_table_column = ''

    let show_advanced_section = false
    let icon_arrow
    let custom_query_checked = false
    let custom_query = ''
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
            table_name: '',
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

        order_by_items_array = [...order_by_items_array, addition_object]
    }

    function handle_delete_order_by(item, index) {
        if (order_by_items_array.length === 1) {
            alert('You Cannot delete last item')
            return
        }
        order_by_items_array.splice(index, 1)
        order_by_items_array = order_by_items_array
    }

    function handle_select_columns(e) {
        if (!selected_table) {
            alert('Please select a table')
            return
        }
        show_multi_selection = !show_multi_selection
        if (show_multi_selection) {
            e.target.innerText = 'Close'
        } else {
            e.target.innerText = 'Select'
        }
    }

    //  Handles the selection of secondary columns.
    function handle_select_secondary_columns(e) {
        show_secondary_multi_selection = !show_secondary_multi_selection
        if (show_secondary_multi_selection) {
            e.target.innerText = 'Close'
        } else {
            e.target.innerText = 'Select'
        }
    }
    let select_query_columns = ''
    let selected_column_array = []
    function handle_toggle_selected_columns(col) {
        if (!col) {
            show_multi_selection = false
            select_query_columns = `${selected_table}.*`
            selected_column_array = table_data.filter(
                (table) => table.table_name === selected_table,
            )[0].columns
            for (let single_column of table_data.filter(
                (table) => table.table_name === selected_table,
            )[0].columns) {
                single_column.selected = true
                table_data = table_data
            }
            console.log(select_query_columns)
            return
        }
        if (col.selected) {
            console.log(col)
            selected_column_array = [...selected_column_array, col]
            select_query_columns = selected_column_array
                .map((column) => `${selected_table}.${column.title}`)
                .join(',')
            if (
                selected_column_array.length ===
                table_data.filter(
                    (table) => table.table_name === selected_table,
                )[0].columns.length
            ) {
                select_query_columns = `${selected_table}.*`
            }
        } else {
            selected_column_array = selected_column_array.filter(
                (column) => column !== col,
            )
            console.log(selected_column_array)
            select_query_columns = selected_column_array
                .map((column) => `${selected_table}.${column.title}`)
                .join(',')
        }
        console.log(select_query_columns)
    }
    function reset_main_table_query() {
        selected_column_array = []
        select_query_columns = ''
        for (let single_column of table_data.filter(
            (table) => table.table_name === selected_table,
        )[0].columns) {
            single_column.selected = false
            table_data = table_data
        }
    }

    let select_query_secondary_columns = ''
    let selected_secondary_column_array = []
    function handle_update_selected_secondary_columns(index,sec_col,table_name,req_col_array){
        req_col_array = req_col_array.filter(col => col.selected)
        console.log(req_col_array);
        if(sec_col == null){
            for(let col of all_added_secondary_tables[index].req_columns){
                col.selected = true
            }
            all_added_secondary_tables = all_added_secondary_tables

            let temp_query = `${table_name}.*`
            select_query_secondary_columns_array[index] = temp_query
            return
        }
        if (sec_col.selected) {
            // req_col_array = [
            //     ...req_col_array,
            //     sec_col,
            // ]
            select_query_secondary_columns = req_col_array
                .map((column) => `${table_name}.${column.title}`)
                .join(',')
            if (
                req_col_array.length ===
                table_data.filter(
                    (table) => table.table_name === table_name
                )[0].columns.length
            ) {
                select_query_secondary_columns = `${table_name}.*`
            }
            select_query_secondary_columns_array[index] = select_query_secondary_columns
        } else {
            req_col_array =
            req_col_array.filter(
                    (column) => column !== sec_col,
                )
            select_query_secondary_columns = req_col_array
                .map((column) => `${table_name}.${column.title}`)
                .join(',')
            select_query_secondary_columns_array[index] = select_query_secondary_columns
        }
    }
    function handle_toggle_selected_secondary_columns(sec_col) {
        if (!sec_col) {
            show_secondary_multi_selection = false
            select_query_secondary_columns = `${selected_secondary_table}.*`
            selected_secondary_column_array = table_data.filter(
                (table) => table.table_name === selected_secondary_table,
            )[0].columns
            for (let single_column of table_data.filter(
                (table) => table.table_name === selected_secondary_table,
            )[0].columns) {
                single_column.selected = true
                table_data = table_data
            }
            console.log(select_query_secondary_columns)
            return
        }
        if (sec_col.selected) {
            selected_secondary_column_array = [
                ...selected_secondary_column_array,
                sec_col,
            ]
            select_query_secondary_columns = selected_secondary_column_array
                .map((column) => `${selected_secondary_table}.${column.title}`)
                .join(',')
            if (
                selected_secondary_column_array.length ===
                table_data.filter(
                    (table) => table.table_name === selected_secondary_table,
                )[0].columns.length
            ) {
                select_query_secondary_columns = `${selected_secondary_table}.*`
            }
        } else {
            selected_secondary_column_array =
                selected_secondary_column_array.filter(
                    (column) => column !== sec_col,
                )
            select_query_secondary_columns = selected_secondary_column_array
                .map((column) => `${selected_secondary_table}.${column.title}`)
                .join(',')
        }
        console.log('TEST', select_query_secondary_columns)
    }
    function reset_secondary_table_query() {
        selected_secondary_column_array = []
        select_query_secondary_columns = ''
        for (let single_column of table_data.filter(
            (table) => table.table_name === selected_secondary_table,
        )[0].columns) {
            single_column.selected = false
            table_data = table_data
        }
    }
    function check_query_validity() {
        if (!select_query_secondary_columns) {
            alert('Please select at least one column')
            return false
        }
        if (!selected_join_type) {
            alert('Please select join type')
            return false
        }
        if (!selected_main_table_name || !selected_secondary_table_name) {
            alert('Please select main and secondary table')
            return false
        }
        if (!selected_main_table_column || !selected_secondary_table_column) {
            alert('Please select main and secondary column')
            return false
        }
        return true
    }
    let final_query_string_array = []
    let all_added_secondary_tables = [
        // {
        //     table_name: 'customer_profile',
        //     req_columns: [
        //         {
        //             title: 'Id',
        //             dataIndex: 'id',
        //             id: 0,
        //             selected: true,
        //         },
        //         {
        //             title: 'Name',
        //             dataIndex: 'name',
        //             id: 1,
        //             selected: true,
        //         },
        //         {
        //             title: 'Age',
        //             dataIndex: 'age',
        //             id: 2,
        //             selected: true,
        //         },
        //         {
        //             title: 'Address',
        //             dataIndex: 'address',
        //             id: 3,
        //             selected: true,
        //         },
        //     ],
        //     join_type: 'INNER JOIN',
        //     main_table_name: 'customer_profile',
        //     main_table_column: 'Id',
        //     secondary_table_name: 'customer_profile',
        //     secondary_table_column: 'Id',
        // },
        // {
        //     table_name: 'address_profile',
        //     req_columns: [
        //         {
        //             title: 'Id',
        //             dataIndex: 'id',
        //             id: 0,
        //             selected: true,
        //         },
        //         {
        //             title: 'Name',
        //             dataIndex: 'name',
        //             id: 1,
        //             selected: true,
        //         },
        //         {
        //             title: 'Age',
        //             dataIndex: 'age',
        //             id: 2,
        //             selected: true,
        //         },
        //         {
        //             title: 'Address',
        //             dataIndex: 'address',
        //             id: 3,
        //             selected: true,
        //         },
        //     ],
        //     join_type: 'INNER JOIN',
        //     main_table_name: 'customer_profile',
        //     main_table_column: 'Id',
        //     secondary_table_name: 'customer_profile',
        //     secondary_table_column: 'Id',
        // },
    ]
    let select_query_secondary_columns_array = []

    function handle_confirm() {
        let is_valid = check_query_validity()
        if (!is_valid) {
            return
        }
        let req_table = table_data.filter(
            (table) => table.table_name === selected_secondary_table,
        )
        let final_query = {
            table_name: selected_secondary_table,
            columns: selected_secondary_column_array,
            req_columns: req_table[0].columns,
            join_type: selected_join_type,
            main_table_name: selected_main_table_name,
            main_table_column: selected_main_table_column,
            secondary_table_name: selected_secondary_table_name,
            secondary_table_column: selected_secondary_table_column,
        }
        all_added_secondary_tables = [
            ...all_added_secondary_tables,
            final_query,
        ]
        select_query_secondary_columns_array = [
            ...select_query_secondary_columns_array,
            select_query_secondary_columns,
        ]
        final_query_string_array = [
            ...final_query_string_array,
            `${selected_join_type} ${selected_secondary_table} ON ${selected_main_table_name}.${selected_main_table_column} = ${selected_secondary_table_name}.${selected_secondary_table_column}`,
        ]
        console.log(
            all_added_secondary_tables,
            select_query_secondary_columns_array,
            final_query_string_array,
        )
        handle_cancel()
    }

    function handle_cancel() {
        show_secondary_table_adder = false
        select_query_secondary_columns = ''
        selected_secondary_table = ''
        selected_secondary_column_array = []
        selected_join_type = ''
        selected_main_table_name = ''
        selected_secondary_table_name = ''
        selected_main_table_column = ''
        selected_secondary_table_column = ''
        show_secondary_multi_selection = false
    }
    function handle_delete_secondary_table(array_index) {
        all_added_secondary_tables.splice(array_index, 1)
        final_query_string_array.splice(array_index, 1)
        all_added_secondary_tables = [...all_added_secondary_tables]
        final_query_string_array = [...final_query_string_array]
    }
    let where_clause = ''
    let show_conditions = false
    function handle_show_conditions(action) {
        // show_multiselection = false
        if (action === 'add') {
            show_conditions = true
            where_clause = 'where'
        } else if (action === 'cancel') {
            show_conditions = false
            where_clause = ''
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

    function handle_generate_query() {
        console.log('the query is being generated',select_query_secondary_columns_array)
        console.log('final query', final_query_string_array)
        console.log('select_query_columns', select_query_columns)
        console.log('selected_table', selected_table)
        let sec_col_final_query = ''
        let final_balance_query = ''
        if(select_query_secondary_columns_array.length){
            sec_col_final_query = ',' + select_query_secondary_columns_array.join(',')
        }else{
            sec_col_final_query = ''
        }
        if(final_query_string_array.length){
            final_balance_query = final_query_string_array.join(' ')
        }else{
            final_balance_query = ''
        }
        if (!selected_table) {
            alert('Please select table')
            return
        }
        if (!show_conditions) {
            let order_by_query = ''
            order_by_query = order_by_items_array.map(item=>`${selected_table}.${item.column_name} ${item.order}`).join(',')

            if (select_query_columns.includes('*')) {
                if(top_checked && top_value.length){
                    if(distinct_checked){
                        if(order_by_checked){
                            console.log(
                                `SELECT DISTINCT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query}`,
                            )
                        }else{
                            console.log(
                                `SELECT DISTINCT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query}`,
                            )
                        }
                    }else if(order_by_checked){
                        console.log(
                                `SELECT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query}`,
                            )
                    }else{
                        console.log(
                        `SELECT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query}`,
                        )
                    }
                }
                else if(distinct_checked){
                    if(order_by_checked){
                        console.log(
                                `SELECT DISTINCT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query}`,
                            )
                    }else{
                        console.log(
                            `SELECT DISTINCT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query}`,
                        )
                    }
                }else if(order_by_checked){
                    console.log(
                                `SELECT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query}`,
                            )
                }else{
                    console.log(
                        `SELECT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query}`,
                    )
                }
            } else {
                if(top_checked && top_value.length){
                    if(distinct_checked){
                        if(order_by_checked){
                            console.log(
                                `SELECT DISTINCT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query}`,
                            )
                        }else{
                            console.log(
                                `SELECT DISTINCT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query}`,
                            )
                        }
                    }else if(order_by_checked){
                        console.log(
                                `SELECT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query}`,
                            )
                    }else{
                        console.log(
                        `SELECT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query}`,
                        )
                    }
                }
                else if(distinct_checked){
                    if(order_by_checked){
                        console.log(
                                `SELECT DISTINCT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query}`,
                            )
                    }else{
                        console.log(
                            `SELECT DISTINCT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query}`,
                        )
                    }
                }else if(order_by_checked){
                    console.log(
                                `SELECT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query}`,
                            )
                }else{

                    console.log(
                        `SELECT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query}`,
                    )
                }
            }
        }else{
            let json = jQuery('#builder').queryBuilder('getSQL')
            console.log(json)
            let order_by_query = ''
            order_by_query = order_by_items_array.map(item=>`${selected_table}.${item.column_name} ${item.order}`).join(',')

            if (show_conditions && !json) {
                alert('Please apply conditions')
                return
            } else if (json) {
                if (select_query_columns.includes('*')) {
                    if(top_checked && top_value.length){
                        if(distinct_checked){
                            if(order_by_checked){
                                console.log(
                                    `SELECT DISTINCT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                            }else{
                                console.log(
                                    `SELECT DISTINCT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql}`,
                                )
                            }
                        }else if(order_by_checked){
                            console.log(
                                    `SELECT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                        }else{
                            console.log(
                            `SELECT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql}`,
                            )
                        }
                    }
                    else if(distinct_checked){
                        if(order_by_checked){
                            console.log(
                                    `SELECT DISTINCT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                        }else{
                            console.log(
                                `SELECT DISTINCT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql}`,
                            )
                        }
                    }else if(order_by_checked){
                        console.log(
                                    `SELECT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                    }else{
                        console.log(
                            `SELECT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql}`,
                        )
                    }
                } else {
                    if(top_checked && top_value.length){
                        if(distinct_checked){
                            if(order_by_checked){
                                console.log(
                                    `SELECT DISTINCT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                            }else{
                                console.log(
                                    `SELECT DISTINCT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql}`,
                                )
                            }
                        }else if(order_by_checked){
                            console.log(
                                    `SELECT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                        }else{
                            console.log(
                            `SELECT TOP ${top_value} ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql}`,
                            )
                        }
                    }
                    else if(distinct_checked){
                        if(order_by_checked){
                            console.log(
                                    `SELECT DISTINCT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ORDER BY ${order_by_query} ${where_clause} ${json.sql}`,
                                )
                        }else{
                            console.log(
                                `SELECT DISTINCT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql}`,
                            )
                        }
                    }else if(order_by_checked){
                        console.log(
                                    `SELECT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql} ORDER BY ${order_by_query}`,
                                )
                    }else{

                        console.log(
                            `SELECT ${select_query_columns}${sec_col_final_query} FROM ${selected_table} ${final_balance_query} ${where_clause} ${json.sql}`,
                        )
                    }
                }
            }
        }
    }

    onMount(async () => {
        console.log('the joins query component is being mounted')
        jQuery('#builder').queryBuilder(options)
    })
</script>

<div class="joins_table_selector">
    <div class="table_selector_header">
        <div class="logo_container">
            <img
                src="/assets/images/table_logo.png"
                alt="" />
        </div>
        <div class="heading_container">
            <h3>Select Tables</h3>
        </div>
    </div>
    <div class="all_tables_container">
        <div class="main_table_outer">
            <div class="main_table_header">
                <h2>Main Table</h2>
            </div>
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
                        bind:value={selected_table}
                        on:change={reset_main_table_query}>
                        {#each table_data as table}
                            <option value={table.table_name}
                                >{table.table_name}</option>
                        {/each}
                    </select>
                </div>
                <div class="column_selector">
                    <h3>Columns</h3>
                    <!-- <span on:click={handle_select_columns}>Select</span> -->
                    <div
                        class="multiselection"
                        class:show_multi_selection={selected_table != ''}>
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
                                        <label for="col_{index}"
                                            >{column.title}</label>
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
                                        class="btn btn-success add_button"
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
                                                        <option
                                                            value={table.table_name}
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
                                            <div class="column_selector">
                                                <h3>Order Type</h3>
                                                <!-- <span on:click={handle_select_columns}>Select</span> -->
                                                <div>
                                                    <select
                                                        name=""
                                                        id=""
                                                        bind:value={item.order_by}>
                                                        <option value="ASC"
                                                            >ASC</option>
                                                        <option value="DESC"
                                                            >DESC</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div
                                                class="order_item_delete_container">
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
                        <div class="multiple_query_adder">
                            <div class="query_input">
                                <input
                                    bind:checked={custom_query_checked}
                                    type="checkbox"
                                    name=""
                                    id="top" />
                                <label for="top">Write Custom Query</label>
                                <input
                                    bind:value={custom_query}
                                    class:not_allowed={!custom_query_checked}
                                    type="text"
                                    disabled={!custom_query_checked} />
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
        <div class="secondary_table_outer">
            <div class="secondary_table_header">
                <h3>Secondary Table</h3>
                <button
                    on:click={() => {
                        if (!selected_table) {
                            alert('Please Select Table first')
                            return
                        }
                        show_secondary_table_adder = true
                    }}><span> <FaPlus /></span> Add Table</button>
            </div>
            {#if all_added_secondary_tables.length > 0}
                <div class="outer_secondary_tables">
                    {#each all_added_secondary_tables as table, index}
                        <div class="secondary_table">
                            <h3>
                                <span>{table.join_type.toLowerCase()}</span
                                >{table.table_name}
                            </h3>
                            <div class="selected_columns">
                                <p
                                    style="text-align: center;"
                                    on:click={() =>
                                        handle_update_selected_secondary_columns(index,null,table.table_name,null)}>
                                    Select All
                                </p>
                                {#each table.req_columns as single_column}
                                    <p>
                                        <input
                                            type="checkbox"
                                            name=""
                                            id="col_{index}"
                                            bind:checked={single_column.selected}
                                            on:change={() =>
                                                handle_update_selected_secondary_columns(
                                                    index,single_column,table.table_name,table.req_columns
                                                )} />
                                        <label for="col_{index}"
                                            >{single_column.title}</label>
                                    </p>
                                {/each}
                            </div>
                            <button
                                class="btn btn-danger"
                                on:click={() => {
                                    handle_delete_secondary_table(index)
                                }}>Delete</button>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no_secondary_table">
                    <p>No Secondary Table Added</p>
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

    <!-- Pop up for adding new secondary table -->
    {#if show_secondary_table_adder}
        <div class="secondary_table_adder_popup">
            <div class="adder_popup_header">
                <h3>ADD SECONDARY TABLE</h3>
                <span on:click={() => (show_secondary_table_adder = false)}
                    >X</span>
            </div>
            <div class="adder_popup_body">
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
                        bind:value={selected_secondary_table}
                        on:change={reset_secondary_table_query}>
                        {#each table_data as table}
                            <option value={table.table_name}
                                >{table.table_name}</option>
                        {/each}
                    </select>
                </div>
                <div class="column_selector">
                    <h3>Columns</h3>
                    <!-- <span on:click={handle_select_secondary_columns}
                        >Select</span> -->
                    <div
                        class="multiselection"
                        class:show_secondary_multi_selection={selected_secondary_table !=
                            ''}>
                        <p
                            style="text-align: center;"
                            on:click={() =>
                                handle_toggle_selected_secondary_columns()}>
                            Select All
                        </p>
                        {#each table_data as table}
                            {#if table.table_name === selected_secondary_table}
                                {#each table.columns as column, index}
                                    <p>
                                        <input
                                            type="checkbox"
                                            name=""
                                            id="col_{index}"
                                            bind:checked={column.selected}
                                            on:change={() =>
                                                handle_toggle_selected_secondary_columns(
                                                    column,
                                                )} />
                                        <label for="col_{index}"
                                            >{column.title}</label>
                                    </p>
                                {/each}
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <div class="join_type_selector">
                <label id="join_type">Join Type :</label>
                <select
                    placeholder="Select Join Type"
                    name=""
                    id="join_type"
                    bind:value={selected_join_type}>
                    {#each join_types as join_type}
                        <option value={join_type.value}
                            >{join_type.label}</option>
                    {/each}
                </select>
            </div>
            <div class="on_condition_manager">
                <h3>On Condition</h3>
            </div>
            <div class="all_table_and_column_selector">
                <div class="main_table_and_column_selector">
                    <div class="main_table_name_selector">
                        <h3>Main Table</h3>
                        <select
                            name=""
                            id=""
                            bind:value={selected_main_table_name}>
                            {#each table_data as table}
                                <option value={table.table_name}
                                    >{table.table_name}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="main_table_column_selector">
                        <h3>Column</h3>
                        {#each table_data as table}
                            {#if table.table_name === selected_main_table_name}
                                <select
                                    name=""
                                    id=""
                                    bind:value={selected_main_table_column}>
                                    {#each table.columns as column}
                                        <option value={column.title}
                                            >{column.title}</option>
                                    {/each}
                                </select>
                            {/if}
                        {/each}
                    </div>
                </div>
                <div class="equals_container">
                    <span>=</span>
                </div>
                <div class="main_table_and_column_selector">
                    <div class="main_table_name_selector">
                        <h3>Secondary Table</h3>
                        <select
                            name=""
                            id=""
                            bind:value={selected_secondary_table_name}>
                            {#each table_data as table}
                                <option value={table.table_name}
                                    >{table.table_name}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="main_table_column_selector">
                        <h3>Column</h3>
                        {#each table_data as table}
                            {#if table.table_name === selected_secondary_table_name}
                                <select
                                    name=""
                                    id=""
                                    bind:value={selected_secondary_table_column}>
                                    {#each table.columns as column}
                                        <option value={column.title}
                                            >{column.title}</option>
                                    {/each}
                                </select>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <div class="action_buttons_container">
                <button
                    class="btn btn-success"
                    on:click={handle_confirm}>Confirm</button>
                <button
                    class="btn btn-danger"
                    on:click={handle_cancel}>Cancel</button>
            </div>
        </div>
    {/if}

    <!-- Pop up for adding new secondary table -->
    <div class="query_confirmation_container">
        <button
            class="btn btn-primary parse_json"
            on:click={handle_generate_query}>Apply</button>
        <button class="btn btn-secondary parse_json cancel_button">Cancel</button>
    </div>
</div>

<style>
    .joins_table_selector {
        width: 80%;
        margin: 0 auto;
        border: 1px solid #00000036;
        border-radius: 15px;
        position: relative;
    }
    .table_selector_header {
        display: flex;
        /* justify-content: space-between; */
        align-items: center;
        padding: 15px;
        background-color: #0064bd;
        border-radius: 15px 15px 0 0;
    }
    .table_selector_header .logo_container img {
        width: 40px;
        height: 40px;
        object-fit: contain;
    }
    .heading_container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .table_selector_header .heading_container h3 {
        font-size: 30px;
        margin: 0;
        margin-left: 22px;
        font-weight: 500;
        color: #fff;
    }
    .all_tables_container {
    }
    .main_table_outer {
        width: 100%;
        background-color: #d2e3fc;
        padding-block: 15px;
    }
    .main_table_header {
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
        margin-bottom: 12px;
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
        margin-top: 5px;
        padding: 8px;
        padding-top: 15px;
        border: 2px solid #75757c5e;
        border-radius: 10px;
        width: 90%;
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
    .multiple_query_adder:last-child {
        padding-top: 15px;
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
        margin-left: 20px;
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
    .main_table_header h2,
    .secondary_table_header h3 {
        font-size: 26px;
        margin-bottom: 5px;
        font-weight: 500;
        color: #3a3737;
        margin: 0px 0 10px 20px;
        margin-bottom: 10px;
        text-align: left;
        text-decoration: underline #3094d6;
        text-underline-offset: 8px;
        font-weight: 500;
        letter-spacing: 2px;
    }
    .secondary_table_outer {
        background-color: #cedaeb;
        border-radius: 0 0 12px 12px;
        /* padding-top: 15px; */
    }
    .secondary_table_header {
        display: flex;
        align-items: center;
        padding-top: 15px;
        padding-bottom: 12px;
        border-bottom: 1px solid #4d4b4b2e;
        border-top: 1px solid #4d4b4b26;
        background-color: #71b4df;
    }
    .secondary_table_header button {
        margin-left: auto;
        margin-right: 20px;
        background-color: #0064bd;
        color: #fff;
        border: none;
        /* padding: 10px 15px; */
        border-radius: 5px;
        cursor: pointer;
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 120px;
    }
    .secondary_table_header button span {
        margin-right: 10px;
        width: 15px;
    }

    .secondary_table_header h3 {
        text-decoration: none;
        color: #fff;
        text-shadow: 1px 1px 2px #000000a8;
        font-size: 26px;
    }
    .main_table_selector,
    .adder_popup_body {
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

    .column_selector {
        position: relative;
    }
    /* .column_selector span {
        color: #606060;
        font-size: 15px;
        cursor: pointer;
        border: 1px solid #8080804a;
        width: 120px;
        text-align: center;
        height: 41px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        background-color: #fff;
    } */
    .column_selector .multiselection {
        display: none;
        visibility: hidden;
        opacity: 0;

        background-color: #fff;
        /* width: 100%; */
        border: 1px solid #80808036;
        padding: 5px;
        display: flex;
        max-width: 400px;
        overflow-x: auto;
        min-width: 150px;
        flex-wrap: wrap;
    }
    .selected_columns {
        background-color: #fff;
        /* width: 100%; */
        border: 1px solid #80808036;
        padding: 5px;
        display: flex;
        max-width: 400px;
        overflow-x: auto;
        min-width: 150px;
        flex-wrap: wrap;
    }
    .selected_columns p {
        padding-inline: 5px;
        margin: 0;
        margin-right: 10px;
        margin-bottom: 10px;
        margin-top: 10px;
        border: 1px solid #0000006e;
        border-radius: 5px;
    }
    .selected_columns p:hover {
        cursor: pointer;
        color: #000;
        background-color: #8080804a;
    }

    .column_selector .show_multi_selection,
    .column_selector .show_secondary_multi_selection {
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

    .secondary_table_adder_popup {
        position: absolute;
        /* top: 5%;
        left: 30%;
        width: 500px; */
        top: 0;
        left: 0;
        width: 100%;
        /* height: 100%; */
        background-color: #e5e5e5;
        z-index: 999;
        border-radius: 12px;
        box-shadow:
            2px 2px 4px #c1c1c1,
            -2px -2px 4px rgb(209 198 198);
        padding-bottom: 60px;
    }
    .adder_popup_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        /* background-color: #f8f8f8; */
        background-color: #0064bd;
        padding: 10px 15px;
        border-bottom: 1px solid #80808036;
        border-radius: 12px 12px 0 0;
    }
    .adder_popup_header h3 {
        margin: 0;
        font-size: 25px;
        font-weight: 600;
        color: #fff;
        text-shadow: 1px 1px 2px #000000b5;
    }
    .adder_popup_header span {
        cursor: pointer;
        color: #fff;
        font-size: 25px;
        font-weight: 700;
        margin-right: 5px;
        text-shadow: 1px 1px 2px #000000b5;
    }
    .adder_popup_body h3 {
        color: #000;
    }
    .join_type_selector {
        display: flex;
        padding-left: 25px;
        align-items: center;
    }
    .join_type_selector label {
        margin-right: 20px;
        font-size: 20px;
        font-weight: 500;
        color: #303030;
    }
    .join_type_selector select {
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
        width: 50%;
        outline: none;
    }
    .on_condition_manager {
        padding-top: 25px;
        padding-left: 25px;
    }
    .on_condition_manager h3 {
        color: #000005b9;
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 20px;
        text-decoration: underline #08067081;
        text-underline-offset: 5px;
    }

    .all_table_and_column_selector {
        display: flex;
        padding-left: 25px;
    }
    .main_table_and_column_selector {
        display: flex;
        border: 2px solid rgb(196, 194, 194);
        width: 350px;
        justify-content: space-between;
        padding: 10px;
        border-radius: 12px;
    }
    .main_table_name_selector,
    .main_table_column_selector {
        /* margin-right: 10px; */
    }
    .main_table_name_selector h3,
    .main_table_column_selector h3 {
        font-size: 16px;
    }
    .equals_container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 30px;
    }
    .equals_container span {
        font-size: 25px;
    }

    .action_buttons_container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 25px;
        padding-top: 30px;
    }
    .action_buttons_container button {
        margin-right: 15px;
        font-size: 17px;
        padding: 5px 25px;
    }
    .btn-success {
        background-color: #0064bd;
    }
    .no_secondary_table {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 150px;
    }
    .no_secondary_table p {
        font-size: 17px;
        color: grey;
    }
    .outer_secondary_tables {
        /* padding-top: 15px; */
        border-radius: 0 0 12px 12px;
        background-color: azure;
    }
    .outer_secondary_tables .secondary_table {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 8px;
        padding-top: 12px;
        padding-left: 25px;
        border: 1px solid #00000014;
        padding-right: 20px;
    }
    .outer_secondary_tables .secondary_table:hover {
        background-color: #f8f8f8;
    }
    .outer_secondary_tables .secondary_table:last-child {
        border-radius: 0 0 12px 12px;
    }
    .outer_secondary_tables .secondary_table h3 {
        margin: 0;
        font-size: 25px;
        font-weight: 500;
        color: #303030;
        font-style: oblique;
    }
    .outer_secondary_tables .secondary_table span {
        font-size: 23px;
        color: #606060b3;
        font-weight: 700;
        padding-right: 15px;
        font-style: italic;
    }

    .create_condition_container {
        padding-left: 25px;
        padding-top: 20px;
        padding-bottom: 25px;
    }
    .conditions_outer {
        padding-bottom: 50px;
    }

    #builder {
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        padding-top: 20px;
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
</style>
