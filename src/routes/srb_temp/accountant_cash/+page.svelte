<script>
    export let opening_closing_balance_data = {
        company_name: 'Xentra',
        report_title: 'Opening and Closing Balances',
        period_from: '01-June-2025',
        period_to: '11-July-2025',

        grouped_entries: [
            {
                group: 'Bank',
                entries: [
                    { date: 'As on 01 June 2025', account: 'Opening Balance', credit: 0.0 },
                    { date: 'As on 11 July 2025', account: 'Closing Balance' }
                ]
            },
            {
                group: 'Cash',
                entries: [
                    { date: 'As on 01 June 2025', account: 'Opening Balance', credit: 0.0 },
                    { date: 'As on 11 July 2025', account: 'Closing Balance' }
                ]
            },
            {
                group: 'Purchase Expense',
                entries: [
                    { date: 'As on 01 June 2025', account: 'Opening Balance', credit: 0.0 },
                    { date: 'As on 11 July 2025', account: 'Closing Balance' }
                ]
            },
            {
                group: 'Additional Expense',
                entries: [
                    { date: 'As on 01 June 2025', account: 'Opening Balance', credit: 0.0 },
                    { date: 'As on 11 July 2025', account: 'Closing Balance' }
                ]
            },
            {
                group: 'Income',
                entries: [
                    { date: 'As on 01 June 2025', account: 'Opening Balance', credit: 0.0 },
                    { date: 'As on 11 July 2025', account: 'Closing Balance' }
                ]
            },
            {
                group: 'Additional Income',
                entries: [
                    { date: 'As on 01 June 2025', account: 'Opening Balance', credit: 0.0 },
                    { date: 'As on 11 July 2025', account: 'Closing Balance' }
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
            <span>Date</span>
            <span>Account</span>
            <span>Transaction Details</span>
            <span>Transaction Type</span>
            <span>Transaction No</span>
            <span>Debit</span>
            <span>Credit</span>
            <span>Amount</span>
        </div>

        {#each opening_closing_balance_data.grouped_entries as group}
            <div class="group_block">
                <div class="group_header">{group.group}</div>
                {#each group.entries as row}
                    <div class="table_row">
                        <span>{row.date}</span>
                        <span>{row.account}</span>
                        <span>{row.details || ''}</span>
                        <span>{row.transaction_type || ''}</span>
                        <span>{row.transaction_no || ''}</span>
                        <span>{row.debit || ''}</span>
                        <span class="amount">{row.credit != null ? row.credit.toFixed(2) : ''}</span>
                        <span>{row.amount || ''}</span>
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
        grid-template-columns: repeat(8, 1fr);
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
        color: #2563eb;
        font-weight: 500;
        text-align: right;
    }
</style>
