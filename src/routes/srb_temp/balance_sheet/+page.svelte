<script>
    export let horizontal_balance_sheet_data = {
        company_name: 'Xentra',
        report_title: 'Horizontal Balance Sheet',
        period_from: '01-July-2025',
        period_to: '31-July-2025',

        liabilities: [
            {
                title: 'Current Liabilities',
                children: [
                    { name: 'Accounts Payable', amount: 1650.0 },
                    { name: 'Sundry Creditors', amount: 1650.0 },
                    { name: 'Bajaj', amount: 0.0 },
                    { name: 'Philips', amount: 0.0 },
                    { name: 'Preethi', amount: 0.0 },
                    { name: 'Crompton', amount: 0.0 },
                    { name: 'Butterfly', amount: 0.0 },
                    { name: 'yathi', amount: 0.0 },
                    { name: 'Test Vendor', amount: 1650.0 }
                ],
                total: 1650.0
            },
            {
                title: 'Non-Current Liabilities',
                children: [],
                total: 0.0
            },
            {
                title: 'Owner’s Equity',
                children: [
                    { name: 'Total Equity', amount: 91580.0 }
                ],
                total: 91580.0
            }
        ],

        assets: [
            {
                title: 'Current Asset',
                children: [
                    { name: 'Cash and Cash Equivalents', amount: 86712.0 },
                    { name: 'Cash', amount: 49525.0 },
                    { name: 'ICICI', amount: 7297.0 },
                    { name: 'AXIS', amount: 29890.0 },
                    { name: 'Accounts Receivable', amount: 3100.0 },
                    { name: 'Sundry Debtors', amount: 3100.0 },
                    { name: 'John', amount: 3100.0 },
                    { name: 'Sarath', amount: 0.0 },
                    { name: 'Jordan', amount: 0.0 },
                    { name: 'Tyler', amount: 0.0 },
                    { name: 'Silpa', amount: 0.0 },
                    { name: 'Test Customer', amount: 0.0 }
                ],
                total: 89812.0
            },
            {
                title: 'Non-Current Assets',
                children: [],
                total: 0.0
            }
        ]
    };
</script>

<div class="report_container">
    <h2 class="company_name">{horizontal_balance_sheet_data.company_name}</h2>
    <h3 class="report_title">{horizontal_balance_sheet_data.report_title}</h3>
    <p class="date_range">From {horizontal_balance_sheet_data.period_from} To {horizontal_balance_sheet_data.period_to}</p>

    <div class="report_grid">
        <!-- Liabilities Column -->
        <div class="report_column">
            <h4 class="section_title">Liabilities & Equity</h4>
            {#each horizontal_balance_sheet_data.liabilities as group}
                <div class="report_section">
                    <div class="section_header">{group.title}</div>
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
                </div>
            {/each}
        </div>

        <!-- Assets Column -->
        <div class="report_column">
            <h4 class="section_title">Assets</h4>
            {#each horizontal_balance_sheet_data.assets as group}
                <div class="report_section">
                    <div class="section_header">{group.title}</div>
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
                </div>
            {/each}
        </div>
    </div>

    <div class="report_total_row">
        <div class="report_total">
            <span>Total Liabilities + Equity</span>
            <span class="amount">{(horizontal_balance_sheet_data.liabilities.reduce((a, g) => a + g.total, 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="report_total">
            <span>Total Assets</span>
            <span class="amount">{(horizontal_balance_sheet_data.assets.reduce((a, g) => a + g.total, 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
        align-items: stretch;
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
    .report_total_row {
        display: flex;
        justify-content: space-between;
        gap: 3rem;
        margin-top: 2rem;
        font-weight: bold;
        border-top: 2px solid #000;
        padding-top: 1rem;
    }
    .report_total {
        flex: 1;
        display: flex;
        justify-content: space-between;
    }
</style>