<script>

   let trial_balance_data = {
        "report_title": "Trial Balance",
        "period": {
        "from": "03-June-2025",
            "to": "06-July-2025"
    },
        "organization": "Xentra",
        "columns": ["Particulars", "Debit", "Credit"],
        "sections": [
        {
            "title": "Current Assets",
            "rows": [
                { "particular": "Current Assets", "debit": 107502.00, "credit": null },
                { "particular": "Sundry Debtors", "debit": 3100.00, "credit": null },
                { "particular": "Cash", "debit": 49525.00, "credit": null },
                { "particular": "ICICI", "debit": 7297.00, "credit": null },
                { "particular": "AXIS", "debit": 29890.00, "credit": null },
                { "particular": "Purchase Tax", "debit": 17690.00, "credit": null }
            ]
        },
        {
            "title": "Sales",
            "rows": [
                { "particular": "Sales Accounts", "debit": 2200.00, "credit": 66580.00 },
                { "particular": "Sales", "debit": null, "credit": 68780.00 },
                { "particular": "Sales Return", "debit": null, "credit": -2200.00 }
            ]
        },
        {
            "title": "Current Liability",
            "rows": [
                { "particular": "Current Liability", "debit": null, "credit": 6982.00 },
                { "particular": "Sundry Creditors", "debit": null, "credit": 1650.00 },
                { "particular": "Purchase Accounts", "debit": 78560.00, "credit": 1870.00 },
                { "particular": "Purchase", "debit": 80430.00, "credit": null },
                { "particular": "Purchase Return", "debit": -1870.00, "credit": null },
                { "particular": "Sales Tax", "debit": null, "credit": 5332.00 }
            ]
        },
        {
            "title": "Indirect Incomes",
            "rows": [
                { "particular": "Indirect Incomes", "debit": null, "credit": 115000.00 },
                { "particular": "Rent", "debit": null, "credit": 4000.00 },
                { "particular": "Discount Received", "debit": null, "credit": 20000.00 },
                { "particular": "Commission", "debit": null, "credit": 25000.00 },
                { "particular": "Miscellaneous Income", "debit": null, "credit": 5000.00 },
                { "particular": "Consultancy Fees", "debit": null, "credit": 26000.00 },
                { "particular": "Internship Fees", "debit": null, "credit": 35000.00 },
                { "particular": "Test Income", "debit": null, "credit": null }
            ]
        },
        {
            "title": "Indirect Expenses",
            "rows": [
                { "particular": "Indirect Expenses", "debit": 2500.00, "credit": null },
                { "particular": "Office Rent", "debit": 1000.00, "credit": null },
                { "particular": "Book", "debit": 500.00, "credit": null },
                { "particular": "Sales Discounts", "debit": null, "credit": null },
                { "particular": "Test", "debit": null, "credit": null },
                { "particular": "Salary And Wages", "debit": 1000.00, "credit": null }
            ]
        }
    ],
        "grand_total": { "debit": 188562.00, "credit": 188562.00 }
    }


</script>

<div class="trial_balance_container">
    <div class="header">
        <h1>{trial_balance_data.report_title}</h1>
        <p>{trial_balance_data.period.from} - {trial_balance_data.period.to}</p>
        <p class="org_name">{trial_balance_data.organization}</p>
    </div>

    <table class="trial_balance_table">
        <thead>
        <tr>
            {#each trial_balance_data.columns as col}
                <th>{col}</th>
            {/each}
        </tr>
        </thead>

        <tbody>
        {#each trial_balance_data.sections as section}
            <tr class="section_row">
                <td colspan="3">{section.title}</td>
            </tr>

            {#each section.rows as row}
                <tr>
                    <td>{row.particular}</td>
                    <td class="value_cell">{row.debit !== null ? row.debit.toLocaleString() : ''}</td>
                    <td class="value_cell">{row.credit !== null ? row.credit.toLocaleString() : ''}</td>
                </tr>
            {/each}
        {/each}
        </tbody>

        <tfoot>
        <tr class="total_row">
            <td>Grand Total</td>
            <td class="value_cell">{trial_balance_data.grand_total.debit.toLocaleString()}</td>
            <td class="value_cell">{trial_balance_data.grand_total.credit.toLocaleString()}</td>
        </tr>
        </tfoot>
    </table>
</div>


<style>

    .trial_balance_container {
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        min-width: 800px;
        margin: auto;
        font-family: Arial, sans-serif;
    }

    .header {
        text-align: center;
        margin-bottom: 20px;
    }

    .org_name {
        font-weight: bold;
        color: #555;
    }

    .trial_balance_table {
        width: 100%;
        border-collapse: collapse;
    }

    .trial_balance_table th {
        background-color: #f5f7fa;
        padding: 10px;
        text-align: left;
        font-weight: bold;
        border-bottom: 2px solid #ddd;
    }

    .trial_balance_table td {
        padding: 8px;
        border-bottom: 1px solid #eee;
    }

    .section_row td {
        background-color: #f0f3f8;
        font-weight: bold;
        padding: 10px;
    }

    .value_cell {
        text-align: right;
        color: #0073e6; /* Blue highlight for values */
        font-weight: 500;
    }

    .total_row {
        font-weight: bold;
        background-color: #f9fafc;
    }


</style>
