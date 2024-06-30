<script>
    export let table = {};
</script>

<div class="inner_table" style="width:{table.table_width};">
    <div class="heading_container">
        <div class="header_contents">
            <p>{table.title}</p>
            <p>{table.description}</p>
        </div>
        <button>{table.button.title}</button>
    </div>
    <table>
        <thead>
            <tr>
                {#each table.table_data.columns as column}
                    <th>{column.title}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each table.table_data.data as row_data}
                <tr>
                    <td>{row_data.col_1}</td>
                    <td>{row_data.col_2}</td>
                    <td>{row_data.col_4}</td>
                    <td>{row_data.col_3}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .inner_table{
        background-color: #fff;
        border-radius: 15px;
        padding: 10px;
        padding-inline: 30px;
    }
    .inner_table .heading_container{
        padding-block: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .heading_container .header_contents p{
        font-size: 20px;
        font-weight: 700;
        font-family: 'Inter', sans-serif;
        color: #000;
        margin: 0;
        padding: 0;
    }
    .heading_container .header_contents p:last-child{
        font-size: 15px;
        color: #6e6e6e;
        font-weight: 400;
        padding-top: 10px;
    }
    .heading_container button{
        font-family: 'Inter', sans-serif;
        color: #1d4ed8;
        font-size: 14px;
        font-weight: 500;
        padding: 5px 10px;
        border-radius: 5px;
        transition: all 0.2s linear;
    }
    .heading_container button:hover{
        background-color: rgb(243 244 246);
    }
    .inner_table table{
        width: 100%;
        border-collapse: collapse;
    }
    .inner_table table thead{
        background-color: #f9fafb;
    }
    .inner_table table th, .inner_table table td{
        
        padding-block: 15px;
    }
    .inner_table table tbody tr:nth-child(2n){
        background-color: #f9fafb;
    }
</style>