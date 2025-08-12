<script>

    import {onMount} from "svelte";

    let raw_data_from_erp = [
        [
            {
                "company_name": "Xentra",
                "report_title": "Account Type Transactions - Cash",
                "period_from": "2023-12-31T18:30:00.000Z",
                "period_to": "2024-08-03T18:30:00.000Z"
            }
        ],
        [
            {
                "group": "Bank"
            }
        ],
        [
            {
                "Date": "As on 01 January 2024",
                "account": "Opening Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "0.00",
                "amount": ""
            },
            {
                "Date": "06 April 2024",
                "account": "ICICI",
                "transaction_details": "John",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR2",
                "debit": "25000.00",
                "credit": "0.00",
                "amount": "25000.00 Dr"
            },
            {
                "Date": "08 April 2024",
                "account": "ICICI",
                "transaction_details": "Sarath",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR3",
                "debit": "26000.00",
                "credit": "0.00",
                "amount": "26000.00 Dr"
            },
            {
                "Date": "12 April 2024",
                "account": "AXIS",
                "transaction_details": "John",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR5",
                "debit": "35000.00",
                "credit": "0.00",
                "amount": "35000.00 Dr"
            },
            {
                "Date": "15 April 2024",
                "account": "AXIS",
                "transaction_details": "Sarath",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR6",
                "debit": "20000.00",
                "credit": "0.00",
                "amount": "20000.00 Dr"
            },
            {
                "Date": "22 May 2024",
                "account": "AXIS",
                "transaction_details": "John",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN1",
                "debit": "20000.00",
                "credit": "0.00",
                "amount": "20000.00 Dr"
            },
            {
                "Date": "27 May 2024",
                "account": "ICICI",
                "transaction_details": "Sarath",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN2",
                "debit": "3327.00",
                "credit": "0.00",
                "amount": "3327.00 Dr"
            },
            {
                "Date": "29 May 2024",
                "account": "AXIS",
                "transaction_details": "Silpa",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN5",
                "debit": "3960.00",
                "credit": "0.00",
                "amount": "3960.00 Dr"
            },
            {
                "Date": "02 May 2024",
                "account": "ICICI",
                "transaction_details": "Philips",
                "transaction_type": "Vendor Payment",
                "transaction_no": "PH1",
                "debit": "0.00",
                "credit": "39050.00",
                "amount": "39050.00 Cr"
            },
            {
                "Date": "06 May 2024",
                "account": "AXIS",
                "transaction_details": "Philips",
                "transaction_type": "Vendor Payment",
                "transaction_no": "PH6",
                "debit": "0.00",
                "credit": "18150.00",
                "amount": "18150.00 Cr"
            },
            {
                "Date": "07 May 2024",
                "account": "AXIS",
                "transaction_details": "Preethi",
                "transaction_type": "Vendor Payment",
                "transaction_no": "PRE10",
                "debit": "0.00",
                "credit": "31790.00",
                "amount": "31790.00 Cr"
            },
            {
                "Date": "10 May 2024",
                "account": "ICICI",
                "transaction_details": "Preethi",
                "transaction_type": "Vendor Payment",
                "transaction_no": "PRE20",
                "debit": "0.00",
                "credit": "7480.00",
                "amount": "7480.00 Cr"
            },
            {
                "Date": "05 June 2024",
                "account": "AXIS",
                "transaction_details": "Preethi",
                "transaction_type": "Vendor Credit Refund",
                "transaction_no": "PR12",
                "debit": "1870.00",
                "credit": "0.00",
                "amount": "1870.00 Dr"
            },
            {
                "Date": "As on 04 August 2024",
                "account": "Closing Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "38687.00",
                "credit": "",
                "amount": ""
            }
        ],
        [
            {
                "group": "Cash"
            }
        ],
        [
            {
                "Date": "As on 01 January 2024",
                "account": "Opening Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "0.00",
                "amount": ""
            },
            {
                "Date": "02 April 2024",
                "account": "Cash",
                "transaction_details": "John",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR1",
                "debit": "5000.00",
                "credit": "0.00",
                "amount": "5000.00 Dr"
            },
            {
                "Date": "10 April 2024",
                "account": "Cash",
                "transaction_details": "Silpa",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR4",
                "debit": "4000.00",
                "credit": "0.00",
                "amount": "4000.00 Dr"
            },
            {
                "Date": "02 June 2024",
                "account": "Cash",
                "transaction_details": "Sarath",
                "transaction_type": "Credit Note Refund",
                "transaction_no": "E7",
                "debit": "0.00",
                "credit": "2200.00",
                "amount": "2200.00 Cr"
            },
            {
                "Date": "26 May 2024",
                "account": "Cash",
                "transaction_details": "Silpa",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN3",
                "debit": "37950.00",
                "credit": "0.00",
                "amount": "37950.00 Dr"
            },
            {
                "Date": "28 May 2024",
                "account": "Cash",
                "transaction_details": "Sarath",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN4",
                "debit": "5775.00",
                "credit": "0.00",
                "amount": "5775.00 Dr"
            },
            {
                "Date": "As on 04 August 2024",
                "account": "Closing Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "50525.00",
                "credit": "",
                "amount": ""
            }
        ],
        [
            {
                "group": "Purchase Expense"
            }
        ],
        [
            {
                "Date": "As on 01 January 2024",
                "account": "Opening Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "0.00",
                "amount": ""
            },
            {
                "Date": "02 May 2024",
                "account": "Purchase Expense",
                "transaction_details": "Philips",
                "transaction_type": "Vendor Payment",
                "transaction_no": "PH1",
                "debit": "39050.00",
                "credit": "0.00",
                "amount": "39050.00 Dr"
            },
            {
                "Date": "06 May 2024",
                "account": "Purchase Expense",
                "transaction_details": "Philips",
                "transaction_type": "Vendor Payment",
                "transaction_no": "PH6",
                "debit": "18150.00",
                "credit": "0.00",
                "amount": "18150.00 Dr"
            },
            {
                "Date": "07 May 2024",
                "account": "Purchase Expense",
                "transaction_details": "Preethi",
                "transaction_type": "Vendor Payment",
                "transaction_no": "PRE10",
                "debit": "31790.00",
                "credit": "0.00",
                "amount": "31790.00 Dr"
            },
            {
                "Date": "10 May 2024",
                "account": "Purchase Expense",
                "transaction_details": "Preethi",
                "transaction_type": "Vendor Payment",
                "transaction_no": "PRE20",
                "debit": "7480.00",
                "credit": "0.00",
                "amount": "7480.00 Dr"
            },
            {
                "Date": "04 June 2024",
                "account": "Purchase Expense",
                "transaction_details": "Preethi",
                "transaction_type": "Vendor Credits Refund",
                "transaction_no": "DN1",
                "debit": "0.00",
                "credit": "1870.00",
                "amount": "1870.00 Cr"
            },
            {
                "Date": "As on 04 August 2024",
                "account": "Closing Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "94600.00",
                "credit": "",
                "amount": ""
            }
        ],
        [
            {
                "group": "Additional Expense"
            }
        ],
        [
            {
                "Date": "As on 01 January 2024",
                "account": "Opening Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "0.00",
                "amount": ""
            },
            {
                "Date": "As on 04 August 2024",
                "account": "Closing Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "",
                "amount": ""
            }
        ],
        [
            {
                "group": "Income"
            }
        ],
        [
            {
                "Date": "As on 01 January 2024",
                "account": "Opening Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "0.00",
                "amount": ""
            },
            {
                "Date": "22 May 2024",
                "account": "Sales",
                "transaction_details": "John",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN1",
                "debit": "0.00",
                "credit": "20000.00",
                "amount": "20000.00 Cr"
            },
            {
                "Date": "26 May 2024",
                "account": "Sales",
                "transaction_details": "Silpa",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN3",
                "debit": "0.00",
                "credit": "37950.00",
                "amount": "37950.00 Cr"
            },
            {
                "Date": "27 May 2024",
                "account": "Sales",
                "transaction_details": "Sarath",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN2",
                "debit": "0.00",
                "credit": "3327.00",
                "amount": "3327.00 Cr"
            },
            {
                "Date": "28 May 2024",
                "account": "Sales",
                "transaction_details": "Sarath",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN4",
                "debit": "0.00",
                "credit": "5775.00",
                "amount": "5775.00 Cr"
            },
            {
                "Date": "29 May 2024",
                "account": "Sales",
                "transaction_details": "Silpa",
                "transaction_type": "Customer Payment",
                "transaction_no": "IN5",
                "debit": "0.00",
                "credit": "3960.00",
                "amount": "3960.00 Cr"
            },
            {
                "Date": "02 June 2024",
                "account": "Sales",
                "transaction_details": "Sarath",
                "transaction_type": "Credit Note Refund",
                "transaction_no": "E7",
                "debit": "2200.00",
                "credit": "0.00",
                "amount": "2200.00 Dr"
            },
            {
                "Date": "As on 04 August 2024",
                "account": "Closing Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "68812.00",
                "amount": ""
            }
        ],
        [
            {
                "group": "Additional Income"
            }
        ],
        [
            {
                "Date": "As on 01 January 2024",
                "account": "Opening Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "0.00",
                "amount": ""
            },
            {
                "Date": "02 April 2024",
                "account": "Additional Income",
                "transaction_details": "John",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR1",
                "debit": "0.00",
                "credit": "5000.00",
                "amount": "5000.00 Cr"
            },
            {
                "Date": "06 April 2024",
                "account": "Additional Income",
                "transaction_details": "John",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR2",
                "debit": "0.00",
                "credit": "25000.00",
                "amount": "25000.00 Cr"
            },
            {
                "Date": "08 April 2024",
                "account": "Additional Income",
                "transaction_details": "Sarath",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR3",
                "debit": "0.00",
                "credit": "26000.00",
                "amount": "26000.00 Cr"
            },
            {
                "Date": "10 April 2024",
                "account": "Additional Income",
                "transaction_details": "Silpa",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR4",
                "debit": "0.00",
                "credit": "4000.00",
                "amount": "4000.00 Cr"
            },
            {
                "Date": "12 April 2024",
                "account": "Additional Income",
                "transaction_details": "John",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR5",
                "debit": "0.00",
                "credit": "35000.00",
                "amount": "35000.00 Cr"
            },
            {
                "Date": "15 April 2024",
                "account": "Additional Income",
                "transaction_details": "Sarath",
                "transaction_type": "Customer Payment",
                "transaction_no": "PR6",
                "debit": "0.00",
                "credit": "20000.00",
                "amount": "20000.00 Cr"
            },
            {
                "Date": "As on 04 August 2024",
                "account": "Closing Balance",
                "transaction_details": "",
                "transaction_type": "",
                "transaction_no": "",
                "debit": "",
                "credit": "115000.00",
                "amount": ""
            }
        ]
    ]

    function transform_opening_closing_data(raw_data) {
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
                    date: entry.Date || '',
                    account: entry.account || '',
                    transaction_details: entry.transaction_details || '',
                    transaction_type: entry.transaction_type || '',
                    transaction_no: entry.transaction_no || '',
                    debit: parseFloat(entry.debit) || 0,
                    credit: parseFloat(entry.credit) || 0,
                    amount: entry.amount || ''
                }));

                structured_data.grouped_entries.push({
                    group: group_name,
                    entries: parsed_entries
                });

                i += 2; // Skip to next group
            } else {
                i++;
            }
        }

        return structured_data;
    }


    let result;
    onMount(()=>{
        result = transform_opening_closing_data(raw_data_from_erp)
        console.log(result,"result")
    })


</script>


<pre>{JSON.stringify(result)}</pre>