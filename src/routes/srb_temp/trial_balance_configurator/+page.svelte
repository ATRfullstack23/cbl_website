<script>


    let data_from_erp = [[
                {
                    "trial_balance": "Trial Balance",
                    "start_date": "03-June-2025",
                    "end_date": "05-June-2024"
                }
            ],
            [
                {
                    "sub_category": "Current Assets",
                    "debit": 108182,
                    "credit": 0
                }
            ],
            [
                {
                    "ledger": "Sundry Debtors",
                    "debit": 3100,
                    "credit": 0
                },
                {
                    "ledger": "Cash",
                    "debit": 49525,
                    "credit": 0
                },
                {
                    "ledger": "ICICI",
                    "debit": 7297,
                    "credit": 0
                },
                {
                    "ledger": "AXIS",
                    "debit": 30890,
                    "credit": 0
                },
                {
                    "ledger": "Purchase Tax",
                    "debit": 17370,
                    "credit": 0
                }
            ],
            [
                {
                    "sub_category": "Sales Accounts",
                    "debit": 2200,
                    "credit": 68780
                }
            ],
            [
                {
                    "ledger": "Sales",
                    "debit": 0,
                    "credit": 68780
                },
                {
                    "ledger": "Sales Return",
                    "debit": 2200,
                    "credit": 0
                }
            ],
            [
                {
                    "sub_category": "Current Liability",
                    "debit": 0,
                    "credit": 5332
                }
            ],
            [
                {
                    "ledger": "Sales Tax",
                    "debit": 0,
                    "credit": 5332
                }
            ],
            [
                {
                    "sub_category": "Purchase Accounts",
                    "debit": 79100,
                    "credit": 1870
                }
            ],
            [
                {
                    "ledger": "Purchase",
                    "debit": 79100,
                    "credit": 0
                },
                {
                    "ledger": "Purchase Return",
                    "debit": 0,
                    "credit": 1870
                }
            ],
            [
                {
                    "sub_category": "Indirect Incomes",
                    "debit": 0,
                    "credit": 115000
                }
            ],
            [
                {
                    "ledger": "Rent",
                    "debit": 0,
                    "credit": 4000
                },
                {
                    "ledger": "Discount Received",
                    "debit": 0,
                    "credit": 20000
                },
                {
                    "ledger": "Commission",
                    "debit": 0,
                    "credit": 25000
                },
                {
                    "ledger": "Miscellaneous Income",
                    "debit": 0,
                    "credit": 5000
                },
                {
                    "ledger": "Consultancy Fees",
                    "debit": 0,
                    "credit": 26000
                },
                {
                    "ledger": "Internship Fees",
                    "debit": 0,
                    "credit": 35000
                }
            ],
            [
                {
                    "sub_category": "Indirect Expense",
                    "debit": 1500,
                    "credit": 0
                }
            ],
            [
                {
                    "ledger": "Office Rent",
                    "debit": 1000,
                    "credit": 0
                },
                {
                    "ledger": "Book",
                    "debit": 500,
                    "credit": 0
                }
            ],
            [
                {
                    "trial_balance": "Trial Balance",
                    "debit": 190982,
                    "credit": 190982
                }
            ]
        ]


    function transform_trial_balance_data(raw_data) {
        const [meta_row] = raw_data[0];

        const structured_data = {
            report_title: meta_row.trial_balance || '',
            period: {
                from: meta_row.start_date || '',
                to: meta_row.end_date || ''
            },
            columns: ['Particulars', 'Debit', 'Credit'],
            sections: [],
            grand_total: { debit: 0, credit: 0 }
        };

        let i = 1;
        while (i < raw_data.length) {
            const sub_category_row = raw_data[i];
            const ledger_row = raw_data[i + 1];

            if (sub_category_row?.[0]?.sub_category) {
                const section_title = sub_category_row[0].sub_category;

                const rows = [
                    {
                        particular: section_title,
                        debit: sub_category_row[0].debit || null,
                        credit: sub_category_row[0].credit || null
                    }
                ];

                if (Array.isArray(ledger_row)) {
                    ledger_row.forEach(entry => {
                        rows.push({
                            particular: entry.ledger || '',
                            debit: entry.debit || null,
                            credit: entry.credit || null
                        });
                    });
                }

                structured_data.sections.push({
                    title: section_title,
                    rows
                });

                i += 2;
            }
            else if (sub_category_row?.[0]?.trial_balance) {
                structured_data.grand_total = {
                    debit: sub_category_row[0].debit || 0,
                    credit: sub_category_row[0].credit || 0
                };
                i++;
            }
            else {
                i++;
            }
        }

        return structured_data;
    }

    let trial_balance_data;

    // onMount(()=>{
    trial_balance_data = transform_trial_balance_data(data_from_erp)
    console.log(trial_balance_data,"trial_balance_data")
    console.log(trial_balance_data.company_name,"company name")
    trial_balance_data = trial_balance_data
    // })


</script>


<div class="trial_balance_container">
    <div class="header">
        <h1>{trial_balance_data.report_title}</h1>
        <p>{trial_balance_data.period.from} - {trial_balance_data.period.to}</p>
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