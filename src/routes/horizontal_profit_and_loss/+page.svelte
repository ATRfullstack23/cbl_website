<script>

    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher()


    export let profit_loss_data = {
        expenses: {
            cost_of_goods_sold: [
                { name: 'Opening Stock', amount: 50000 },
                { name: 'Purchases', amount: 120000 },
                { name: 'Vendor Credits', amount: -10000 },
                { name: 'Inventory Adjustment', amount: 3000 }
            ],
            operating: [
                { name: 'Salaries and Wages', amount: 45000 },
                { name: 'Office Rent', amount: 15000 },
                { name: 'Utilities', amount: 4000 },
                { name: 'Maintenance', amount: 2500 }
            ],
            non_operating: [
                { name: 'Loss on Asset Sale', amount: 2000 }
            ]
        },
        incomes: {
            operating: [
                { name: 'Sales Revenue', amount: 210000 },
                { name: 'Service Income', amount: 18000 }
            ],
            non_operating: [
                { name: 'Interest Received', amount: 1200 },
                { name: 'Closing Stock', amount: 45000 }
            ]
        },
        net_profit_or_loss: 0
    };


    const calc_total = (items) => items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
</script>

<div class="pl_container">
    <div class="section">
        <h2 class="section_title">Expense</h2>

        <div class="category">
            <h3 class="category_title">Cost of Goods Sold</h3>
            {#each profit_loss_data.expenses.cost_of_goods_sold as item}
                <div class="row">
                    <div class="label">{item.name}</div>
                    <div class="amount">{item.amount.toFixed(2)}</div>
                </div>
            {/each}
            <div class="row total">
                <div class="label">Total Cost of Goods Sold</div>
                <div class="amount">{calc_total(profit_loss_data.expenses.cost_of_goods_sold).toFixed(2)}</div>
            </div>
        </div>

        <div class="category">
            <h3 class="category_title">Operating Expense</h3>
            {#each profit_loss_data.expenses.operating as item}
                <div class="row">
                    <div class="label">{item.name}</div>
                    <div class="amount">{item.amount.toFixed(2)}</div>
                </div>
            {/each}
            <div class="row total">
                <div class="label">Total Operating Expense</div>
                <div class="amount">{calc_total(profit_loss_data.expenses.operating).toFixed(2)}</div>
            </div>
        </div>

        <div class="category">
            <h3 class="category_title">Non Operating Expense</h3>
            {#each profit_loss_data.expenses.non_operating as item}
                <div class="row">
                    <div class="label">{item.name}</div>
                    <div class="amount">{item.amount.toFixed(2)}</div>
                </div>
            {/each}
            <div class="row total">
                <div class="label">Total Non Operating Expense</div>
                <div class="amount">{calc_total(profit_loss_data.expenses.non_operating).toFixed(2)}</div>
            </div>
        </div>

        <div class="row profit_loss">
            <div class="label">Net Profit/Loss</div>
            <div class="amount">
                {
                    (
                        calc_total(profit_loss_data.incomes.operating) +
                        calc_total(profit_loss_data.incomes.non_operating) -
                        calc_total(profit_loss_data.expenses.cost_of_goods_sold) -
                        calc_total(profit_loss_data.expenses.operating) -
                        calc_total(profit_loss_data.expenses.non_operating)
                    ).toFixed(2)
                }
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section_title">Income</h2>

        <div class="category">
            <h3 class="category_title">Operating Income</h3>
            {#each profit_loss_data.incomes.operating as item}
                <div class="row">
                    <div class="label">{item.name}</div>
                    <div class="amount">{item.amount.toFixed(2)}</div>
                </div>
            {/each}
            <div class="row total">
                <div class="label">Total Operating Income</div>
                <div class="amount">{calc_total(profit_loss_data.incomes.operating).toFixed(2)}</div>
            </div>
        </div>

        <div class="category">
            <h3 class="category_title">Non Operating Income</h3>
            {#each profit_loss_data.incomes.non_operating as item}
                <div class="row">
                    <div class="label">{item.name}</div>
                    <div class="amount">{item.amount.toFixed(2)}</div>
                </div>
            {/each}
            <div class="row total">
                <div class="label">Total Non Operating Income</div>
                <div class="amount">{calc_total(profit_loss_data.incomes.non_operating).toFixed(2)}</div>
            </div>
        </div>
    </div>
</div>

<style>
    .pl_container {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        font-family: sans-serif;
        border: 1px solid #ddd;
        border-radius: 10px;
        width: 80%;
        margin: 70px auto;
    }
    .section {
        flex: 1;
        background: #fff;
        /*border: 1px solid #ddd;*/
        border-radius: 8px;
        padding: 1rem;
    }
    .section_title {
        font-weight: bold;
        margin-bottom: 1rem;
        font-size: 18px;
    }
    .category {
        margin-bottom: 1rem;
    }
    .category_title {
        font-weight: 600;
        color: #333;
        border-bottom: 1px solid #eee;
        margin-bottom: 0.5rem;
        font-size: 14px;
    }
    .row {
        display: flex;
        justify-content: space-between;
        padding: 0.25rem 0;
        font-size: 0.95rem;
    }
    .row.total {
        font-weight: bold;
        border-top: 1px solid #ccc;
        margin-top: 0.5rem;
    }
    .row.profit_loss {
        background: #f7f7f7;
        font-weight: bold;
        border: 1px dashed #ccc;
        padding: 0.5rem;
        margin-top: 1rem;
    }
    .label {
        color: #333;
    }
    .amount {
        color: #0073e6;
        font-size: 14px;

    }
</style>
