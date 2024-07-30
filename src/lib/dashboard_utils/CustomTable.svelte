<script>
     export let item;
    export let dashboard_item_config;

    // console.log("item report", item)
    let report_data = [];
    let module_name

    export async function on_new_data_received(new_data) {
        console.log('on_new_data_received', new_data)
        report_data = new_data[0];
        console.log(report_data)     
        console.log(item); 
    }
</script>

<div class="w_full_sales_data" style="min-width:{item.width}; height:{item.height};">
    <table>
        <thead>
            <tr>
                {#each item.table_column_data as table_column}
                    <th class="table_column_name"
                        >{table_column.display_name}</th
                    >
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each report_data as table_data}
                <tr class="full_row">
                    {#each item.table_column_data as table_column}
                        <td>{table_data[table_column.id_value_column]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    table {
        width: 100%;
        border_collapse: collapse;
        margin: 20px 0;
    }
    th,
    td {
        border_bottom: 1px solid #ddd;
        padding: 13px;
        text_align: left;
        border_top: 1px solid #ddd;
    }
    th {
        background_color: #f2f2f2;
        color: black;
    }

    tr:hover {
        background_color: #f1f1f1;
    }
    .full_row {
        color: rgb(0, 0, 0);
    }
    .full_row:last_child {
        color: black;
        font_size: 20px;
        font_weight: 500;
    }
    .content {
        text_align: left;
    }
    .table_column_name:first_child {
        text_align: left;
    }
    .table_column_name {
        text_align: right;
    }
    /* .w_full_sales_data {
        width: 90%;
        margin: 0 auto;
    } */
</style>
