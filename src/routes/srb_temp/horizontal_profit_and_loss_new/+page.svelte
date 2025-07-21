<script>
    export let horizontal_profit_loss_data = {
        company_name: 'Xentra',
        report_title: 'Profit And Loss Account',
        period_from: '03-June-2025',
        period_to: '06-July-2025',

        expenses: [
            {
                title: 'Purchase Accounts',
                amount: 87500.0
            },
            {
                title: 'Cost of Goods Sold',
                children: [
                    { name: 'Purchase', amount: 89200 },
                    { name: 'Purchase Return', amount: 1700 }
                ],
                total: 87500.0
            },
            {
                title: 'Indirect Expenses',
                children: [
                    { name: 'Book', amount: 500 },
                    { name: 'Office Rent', amount: 1000 },
                    { name: 'Salary And Wages', amount: 1000 },
                    { name: 'Sales Discounts', amount: 0 },
                    { name: 'Test', amount: 0 },
                    { name: 'Rent', amount: 4000 }
                ],
                total: 2500.0
            },
            {
                title: 'Net Profit',
                amount: 91580.0
            }
        ],

        income: [
            {
                title: 'Sales Accounts',
                amount: 66580.0
            },
            {
                title: 'Cost of Goods Sold',
                children: [
                    { name: 'Sales', amount: 68580 },
                    { name: 'Sales Return', amount: 2000 }
                ],
                total: 66580.0
            },
            {
                title: 'Indirect Incomes',
                children: [
                    { name: 'Commission', amount: 25000 },
                    { name: 'Consultancy Fees', amount: 26000 },
                    { name: 'Discount Received', amount: 20000 },
                    { name: 'Internship Fees', amount: 35000 },
                    { name: 'Miscellaneous Income', amount: 5000 },
                    { name: 'Test Income', amount: 0 }
                ],
                total: 115000.0
            },
            {
                title: 'Net Loss',
                amount: 0
            }
        ]
    };
</script>

<div class="report_container">
    <h2 class="company_name">{horizontal_profit_loss_data.company_name}</h2>
    <h3 class="report_title">{horizontal_profit_loss_data.report_title}</h3>
    <p class="date_range">From {horizontal_profit_loss_data.period_from} To {horizontal_profit_loss_data.period_to}</p>

    <div class="report_grid">
        <!-- Expense Column -->
        <div class="report_column">
            <h4 class="section_title">Expense</h4>

            {#each horizontal_profit_loss_data.expenses as group}
                <div class="report_section">
                    <div class="section_header">{group.title}</div>
                    {#if group.children}
                        {#each group.children as item}
                            <div class="report_row">
                                <span>{item.name}</span>
                                <span class="amount">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        {/each}
                        <div class="report_row total">
                            <span>Total {group.title}</span>
                            <span class="amount">{group.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    {:else}
                        <div class="report_row">
                            <span></span>
                            <span class="amount">{group.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- Income Column -->
        <div class="report_column">
            <h4 class="section_title">Income</h4>

            {#each horizontal_profit_loss_data.income as group}
                <div class="report_section">
                    <div class="section_header">{group.title}</div>
                    {#if group.children}
                        {#each group.children as item}
                            <div class="report_row">
                                <span>{item.name}</span>
                                <span class="amount">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        {/each}
                        <div class="report_row total">
                            <span>Total {group.title}</span>
                            <span class="amount">{group.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    {:else}
                        <div class="report_row">
                            <span></span>
                            <span class="amount">{group.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .report_container {
        font-family: sans-serif;
        padding: 2rem;
        background-color: #fff;
        color: #333;
    }
    .company_name {
        font-size: 1.4rem;
        font-weight: bold;
        margin-bottom: 0.2rem;
    }
    .report_title {
        margin: 0;
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }
    .date_range {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1.2rem;
    }
    .report_grid {
        display: flex;
        gap: 3rem;
        margin-top: 1.5rem;
        align-items: flex-start;
    }
    .report_column {
        flex: 1;
    }
    .section_title {
        font-size: 1.1rem;
        font-weight: bold;
        font-style: italic;
        border-bottom: 1px solid #ccc;
        padding-bottom: 0.5rem;
        margin-bottom: 0.8rem;
    }
    .report_section {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e5e5;
    }
    .section_header {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.95rem;
        margin-bottom: 0.6rem;
        color: #333;
    }
    .report_row {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem 0;
        font-size: 0.94rem;
    }
    .report_row.total {
        font-weight: bold;
        border-top: 1px solid #ccc;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
    }
    .amount {
        color: #004aad;
        font-variant-numeric: tabular-nums;
        font-weight: 500;
    }
</style>
