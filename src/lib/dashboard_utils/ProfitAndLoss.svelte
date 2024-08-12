<script>
</script>

<div class="container">
    <h2>Binary Technologies</h2>
    <h3>Horizontal Profit and Loss</h3>
    <p>From 01/08/2024 To 31/08/2024</p>
    <p>Basis: Accrual</p>
    <div class="table">
        <div class="column">
            <h4> <i>Expense</i> </h4>
            <table>
                <div class="inner-items">
                    <tr>
                        <td>OPENING STOCK</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr>
                        <td>PURCHASES</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr>
                        <td>VENDOR CREDITS</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr>
                        <td>INVENTORY ADJUSTMENT</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr class="section-header">
                        <td colspan="2">COST OF GOODS SOLD</td>
                    </tr>
                    <tr>
                        <td>TOTAL COST OF GOODS SOLD</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr class="section-header">
                        <td colspan="2">OPERATING EXPENSE</td>
                    </tr>
                    <tr>
                        <td>TOTAL OPERATING EXPENSE</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr class="section-header">
                        <td colspan="2">NON OPERATING EXPENSE</td>
                    </tr>
                    <tr>
                        <td>TOTAL NON OPERATING EXPENSE</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr>
                        <td>NET PROFIT/LOSS</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <!-- <div class="net-profit">
                        <td>NET PROFIT/LOSS</td>
                        <td class="amount">0.00</td>
                    </div> -->
                </div>
                <div class="total">
                    <td valign="bottom">Total</td>
                    <td class="amount">0.00</td>
                </div>
            </table>
        </div>
        <div class="column">
            <h4> <i>Income</i> </h4>
            <table>
                <div class="inner-items">
                    <tr>
                        <td>OPERATING INCOME</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr>
                        <td>CLOSING STOCK</td>
                        <td class="amount">0.00</td>
                    </tr>
                    <tr class="section-header">
                        <td colspan="2">NON OPERATING INCOME</td>
                    </tr>
                    <tr>
                        <td>TOTAL NON OPERATING INCOME</td>
                        <td class="amount">0.00</td>
                    </tr>
                </div>

                <div class="total">
                    <td valign="bottom">Total</td>
                    <td class="amount">0.00</td>
                </div>
            </table>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Fira+Code:wght@300..700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Fira+Code:wght@300..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans+Mono:wght@100..900&family=Sono:wght@200..800&display=swap');
    .container {
        margin: 0 auto;
        text-align: center;
    }

    h2,
    h3 {
        margin: 5px 0;
    }

    p {
        margin: 2px 0;
    }

    .table {
        border-collapse: collapse;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        padding: 20px;
        width: 1000px;
        margin: 0 auto;
    }
    .inner-items {
        padding-inline: 20px;
    }
    .inner-items tr {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        padding: 4px;
    }
    .column {
        width: 70%;
        border: 1px solid #9b9b9b;
        border-radius: 8px 0 0 8px;
    }
    .column:last-child{
        border-radius: 0 8px 8px 0;
    }
    .column:last-child .total{
        border-bottom: 1px solid #9b9b9b;
        border-radius: 0;
    }
    .column h4 {
        text-align: left;
        border-bottom: 1px solid #9b9b9b;
        padding-block: 20px;
        margin: 0;
        padding-left: 30px;
        font-size: 21px;
        font-family: "Sono", monospace;
    }
    table {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }
    .section-header td {
        padding-top: 45px;
        padding-bottom: 20px;
        font-weight: 600;
    }
    .section-header {
        border-bottom: 1px solid #9b9b9b;
        padding-left: 20px;
        /* margin-right: 20px; */
    }
    .net-profit {
        border: 1px solid #9b9b9b;
        width: 80%;
        margin: 0 auto;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        background-color: #fafafa;
        margin-top: 30px;
    }
    .total {
        border-top: 1px solid #9b9b9b;
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        background-color: #fafafa;
        height: 49px;
        align-items: center;
        border-radius: 0 0 0 8px;
    }
    th,
    td {
        padding: 8px;
        text-align: left;
        font-size: 14px;
        text-transform: uppercase;
        font-family: "Sono", monospace;
        font-weight: 500;
    }

    th {
        background-color: #f2f2f2;
    }
</style>
