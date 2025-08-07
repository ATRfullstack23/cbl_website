<script>
    import {onMount} from "svelte";

    let raw_data_from_erp = [
        [
            {
                "company_name": "Xentra",
                "report_title": "Profit and Loss Account",
                "period_from": "03-June-2025",
                "period_to": "05-June-2024"
            }
        ],
        [
            {
                "title": "Purchase Accounts",
                "amount": 86000
            }
        ],
        [
            {
                "title": "Cost of Goods Sold",
                "total": 86000
            }
        ],
        [
            {
                "name": "Purchase",
                "amount": 87700
            },
            {
                "name": "Purchase Return",
                "amount": 1700
            }
        ],
        [
            {
                "title": "Gross Profit/Loss",
                "amount": ""
            }
        ],
        [
            {
                "title": "Indirect Expenses",
                "total": 1500
            }
        ],
        [
            {
                "name": "Book",
                "amount": 500
            },
            {
                "name": "Office Rent",
                "amount": 1000
            }
        ],
        [
            {
                "title": "Net Profit",
                "amount": 94080
            }
        ],
        [
            {
                "title": "Total",
                "total": 181580
            }
        ],
        [
            {
                "title": "Sales Accounts",
                "amount": 66580
            }
        ],
        [
            {
                "title": "Cost of Goods Sold",
                "total": 66580
            }
        ],
        [
            {
                "name": "Sales",
                "amount": 68580
            },
            {
                "name": "Sales Return",
                "amount": 2000
            }
        ],
        [
            {
                "title": "",
                "amount": "(19420.00)"
            }
        ],
        [
            {
                "title": "Indirect Incomes",
                "amount": 115000
            }
        ],
        [
            {
                "title": "Commission",
                "amount": 25000
            },
            {
                "title": "Consultancy Fees",
                "amount": 26000
            },
            {
                "title": "Discount Received",
                "amount": 20000
            },
            {
                "title": "Internship Fees",
                "amount": 35000
            },
            {
                "title": "Miscellaneous Income",
                "amount": 5000
            },
            {
                "title": "Rent",
                "amount": 4000
            }
        ],
        [
            {
                "title": "Net Loss",
                "amount": 0
            }
        ],
        [
            {
                "title": "Total",
                "total": 181580
            }
        ]
    ]


    function transform_api_profit_loss_data(raw_data_from_erp) {
        const [metadata_row] = raw_data_from_erp[0];
        const structured_data = {
            company_name: metadata_row.company_name,
            report_title: metadata_row.report_title,
            period_from: metadata_row.period_from,
            period_to: metadata_row.period_to,
            expenses: [],
            income: []
        };

        let current_section = 'expenses';
        let current_group = null;

        for (let i = 1; i < raw_data_from_erp.length; i++) {
            const row = raw_data_from_erp[i];

            if (row.length === 1 && row[0].title) {
                const item = row[0];

                if (item.title === 'Sales Accounts') {
                    current_section = 'income';
                }

                if (item.total !== undefined) {
                    current_group = {
                        title: item.title,
                        children: [],
                        total: item.total
                    };
                    structured_data[current_section].push(current_group);
                } else {
                    structured_data[current_section].push({
                        title: item.title,
                        amount: item.amount ?? 0
                    });
                    current_group = null;
                }

            } else if (row.length > 1 && row[0].name || row[0].title) {
                if (current_group && current_group.children) {
                    for (const child of row) {
                        current_group.children.push({
                            name: child.name || child.title,
                            amount: child.amount
                        });
                    }
                }
            } else {
            }
        }

        return structured_data;
    }

    let result;

    onMount(()=>{
        result = transform_api_profit_loss_data(raw_data_from_erp);
        console.log(result, "result")
    })

</script>

<pre>{JSON.stringify(result)}</pre>
