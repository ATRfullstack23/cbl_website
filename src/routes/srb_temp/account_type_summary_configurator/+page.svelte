<script>
    import {onMount} from "svelte";

    let raw_data_from_erp = [
        [
            {
                "company_name": "Xentra",
                "report_title": "Account Type Summary",
                "period_from": "2023-12-31T18:30:00.000Z",
                "period_to": "2024-08-03T18:30:00.000Z"
            }
        ],
        [
            {
                "group": "Asset"
            }
        ],
        [
            {
                "account": "Accounts Receivable",
                "debit": 76312,
                "credit": 73212
            },
            {
                "account": "Bank",
                "debit": 135157,
                "credit": 96970
            },
            {
                "account": "Cash",
                "debit": 52725,
                "credit": 3200
            }
        ],
        [
            {
                "group": "Expense"
            }
        ],
        [
            {
                "account": "Purchase Expense",
                "debit": 96470,
                "credit": 1870
            },
            {
                "account": "Expense",
                "debit": 1500,
                "credit": 1500
            }
        ],
        [
            {
                "group": "Income"
            }
        ],
        [
            {
                "account": "Income",
                "debit": 2200,
                "credit": 74112
            }
        ],
        [
            {
                "group": "Liability"
            }
        ],
        [
            {
                "account": "Accounts Payable",
                "debit": 98340,
                "credit": 98340
            },
            {
                "account": "Other Current Liability",
                "debit": 0,
                "credit": 115000
            }
        ]
    ]



    function transform_trial_balance_summary(raw_data) {
        const [meta_row] = raw_data[0];
        const structured_data = {
            company_name: meta_row.company_name,
            report_title: meta_row.report_title,
            period_from: meta_row.period_from,
            period_to: meta_row.period_to,
            grouped_entries: []
        };

        let i = 1;
        while (i < raw_data.length) {
            const group_row = raw_data[i];
            const entry_row = raw_data[i + 1];

            if (group_row?.[0]?.group && Array.isArray(entry_row)) {
                const group_name = group_row[0].group;

                const parsed_entries = entry_row.map(entry => ({
                    account: entry.account || '',
                    debit: parseFloat(entry.debit) || 0,
                    credit: parseFloat(entry.credit) || 0
                }));

                structured_data.grouped_entries.push({
                    group: group_name,
                    entries: parsed_entries
                });

                i += 2;
            } else {
                i++;
            }
        }

        return structured_data;
    }



    let result;

    onMount(()=>{
        result = transform_trial_balance_summary(raw_data_from_erp);
        console.log(result, "result")
    })

</script>

<pre>{JSON.stringify(result)}</pre>
