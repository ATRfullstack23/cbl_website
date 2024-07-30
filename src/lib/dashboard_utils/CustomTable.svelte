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

<div class="w_full_sales_data" style="min-width:{item.width}px;">
    <div class="contents_container">
        {#if item.title}
            <h5>{item.title}</h5>
        {/if}
        {#if item.description}
            <p>{item.description}</p>
        {/if}
    </div>
    <div class="outer_table_container" style="width: 100%; max-height: {item.height}px; overflow: auto;">
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
                            <td data-column_id = '{table_data[table_column.id_value_column]}'>{table_data[table_column.id_value_column]}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e3e3e3;
        background-color: #f9fafb;
        /* margin: 20px 0; */
    }
    th,td {
        border-bottom: 1px solid #ddd;
        padding: 13px;
        text-align: left;
        border-top: 1px solid #ddd;
    }
    th {
        background-color: #f2f2f2;
        color: black;
    }

    tr:hover {
        background-color: #f1f1f1;
    }
    .full_row {
        color: rgb(0, 0, 0);
    }
    /* .full_row:last-child {
        color: black;
        font-size: 20px;
        font-weight: 500;
    } */
    .content {
        text-align: left;
    }
    .table_column_name:first-child {
        text-align: left;
    }
    .table_column_name {
        /* text-align: right; */
    }
    .w_full_sales_data {
        background-color:#fff;
        padding: 10px;
    }
    .contents_container h5{
        font-size: 22px;
        font-weight: 500;
        padding-top: 10px;
    }
    .contents_container p{
        font-size: 16px;
        color: #6a6868;
    }
</style>
