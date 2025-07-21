<script>
    export let opening_closing_balance_data = {
        company_name: 'Xentra',
        report_title: 'Trial Balance Summary',
        period_from: '01-June-2025',
        period_to: '11-July-2025',

        grouped_entries: [
            {
                group: 'Asset',
                entries: [
                    { account: 'Accounts Receivable', debit: 0.0, credit: 0.0 },
                    { account: 'Bank', debit: 0.0, credit: 1000.0 },
                    { account: 'Cash', debit: 0.0, credit: 0.0 }
                ]
            },
            {
                group: 'Expense',
                entries: [
                    { account: 'Purchase Expense', debit: 1650.0, credit: 0.0 }
                ]
            },
            {
                group: 'Income',
                entries: []
            },
            {
                group: 'Liability',
                entries: [
                    { account: 'Accounts Payable', debit: 0.0, credit: 0.0 },
                    { account: 'Other Current Liability', debit: 0.0, credit: 1000.0 }
                ]
            }
        ]
    };
</script>

<div class="report_container">
    <h2 class="company_name">{opening_closing_balance_data.company_name}</h2>
    <h3 class="report_title">{opening_closing_balance_data.report_title}</h3>
    <p class="date_range">From {opening_closing_balance_data.period_from} To {opening_closing_balance_data.period_to}</p>

    <div class="report_table">
        <div class="table_header">
            <span>Account Type</span>
            <span>Account</span>
            <span>Debit</span>
            <span>Credit</span>
        </div>

        {#each opening_closing_balance_data.grouped_entries as group}
            <div class="group_block">
                <div class="group_header">{group.group}</div>
                {#each group.entries as row}
                    <div class="table_row">
                        <span>{group.group}</span>
                        <span>{row.account}</span>
                        <span class="amount debit">{row.debit}</span>
                        <span class="amount credit">{row.credit}</span>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .report_container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 2rem;
        background-color: #fff;
        color: #333;
    }
    .company_name {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.2rem;
        color: #004aad;
    }
    .report_title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    .date_range {
        font-size: 0.95rem;
        color: #666;
        margin-bottom: 1rem;
    }
    .report_table {
        border-collapse: collapse;
        width: 100%;
    }
    .table_header, .table_row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding: 0.5rem 0.6rem;
        border-bottom: 1px solid #e0e0e0;
        font-size: 0.9rem;
    }
    .table_header {
        font-weight: bold;
        background-color: #f9fafb;
        color: #374151;
    }
    .group_block {
        margin-top: 1.5rem;
        border-top: 2px solid #ddd;
        border-bottom: 1px solid #ddd;
        background-color: #fcfcfc;
    }
    .group_header {
        font-weight: 600;
        font-size: 0.95rem;
        padding: 0.6rem;
        background-color: #f1f5f9;
        color: #1e3a8a;
        border-bottom: 1px solid #e5e7eb;
    }
    .amount {
        text-align: right;
    }
    .debit {
        color: #059669;
        font-weight: 500;
    }
    .credit {
        color: #2563eb;
        font-weight: 500;
    }
</style>