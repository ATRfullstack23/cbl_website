<script>
    export let selected_item;
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-GB');
    }
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
    function convertToWords(amount) {
        // Simple implementation - in real app, use a proper number-to-words library
        return `Indian Rupees ${Math.floor(amount).toLocaleString()} Only`;
    }
    let invoice = {
        id: 'INV-000001',
        date: '2025-01-09',
        orderNumber: '1',
        customerName: 'Mr. John',
        customerEmail: 'john@example.com',
        status: 'PAID',
        dueDate: '2025-01-09',
        amount: 2500.00,
        balanceDue: 0.00,
        items: [
            {
                id: 1,
                description: 'Web Development Services Web Development Services',
                quantity: 1,
                rate: 2500.00,
                amount: 2500.00
            }
        ],
        subtotal: 2500.00,
        total: 2500.00,
        notes: 'Thanks for your business.',
        terms: 'Net 30',
        companyName: 'Your Company',
        companyAddress: 'Your Address',
        companyCity: 'Your City',
        companyEmail: 'your-email@company.com'
    }

    export let table_data_config = {
        "data": [
            {
                "id": 1000090,
                "invoice_id": {
                    "value": 1000068,
                    "text": 1000068
                },
                "invoice_id__text": 1000068,
                "quantity": {
                    "value": 3
                },
                "mrp": {
                    "value": 1500
                },
                "product_profile_id": {
                    "value": 1000015,
                    "text": " Ivora 10-Watt LED Bulkhead Ceiling Light (Cool Day Light)"
                },
                "product_profile_id__text": " Ivora 10-Watt LED Bulkhead Ceiling Light (Cool Day Light)",
                "amount": {
                    "value": 3960
                },
                "hsn_code": {
                    "value": "6958"
                },
                "sale_price": {
                    "value": 1200
                },
                "sale_tax_value": {
                    "value": 10
                },
                "amount_excluding_tax": {
                    "value": 3600
                },
                "tax_amount": {
                    "value": 360
                },
                "tax_profile_id": {
                    "value": 1000003
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:57:13.140Z",
                "_created_at_timestamp_in_utc": "1749106633138",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            }
        ],
        "grandTotal": {
            "amount": 3960,
            "amount_excluding_tax": 3600,
            "tax_amount": 360
        },
        "subTotal": {
            "amount": 3960,
            "amount_excluding_tax": 3600,
            "tax_amount": 360
        },
        "parentDataRowId": "1000068"
    }


</script>

<div class="invoice_document">
    <div class="invoice_header">
        <div class="invoice_title">
            <h1>TAX INVOICE</h1>
        </div>
    </div>
    <div class="bill_to_section">
        <h3 class="section_title">Bill To</h3>
        <p class="customer_name">{selected_item.customer_profile_id__text}</p>
    </div>


    <div class="invoice_meta_section">
        <div class="invoice_details">
            <div class="detail_row_outer">
                <div class="detail_row">
                    <span class="label">#</span>
                    <span class="value">{selected_item.invoice_number.value}-{selected_item.id}</span>
                </div>
                <div class="detail_row">
                    <span class="label">Invoice Date</span>
                    <span class="value">{formatDate(selected_item.invoice_date.value)}</span>
                </div>
            </div>
            <div class="detail_row_outer">
                <!--                            <div class="detail_row">-->
                <!--                                <span class="label">Terms</span>-->
                <!--                                <span class="value">{invoice.terms}</span>-->
                <!--                            </div>-->
                <div class="detail_row">
                    <span class="label">Due Date</span>
                    <span class="value">{formatDate(selected_item.due_date.value)}</span>
                </div>
            </div>
        </div>
    </div>

    <!--                <div class="bill-to-section">-->
    <!--                    <h3 class="section-title">Bill To</h3>-->
    <!--                    <p class="customer-name">{invoice.customerName}</p>-->
    <!--                </div>-->

    <div class="items_section">
        <table class="items_table">
            <thead>
            <tr>
                <th>#</th>
                <th>Item & Description</th>
                <th>MRP</th>
                <th>Sale Price</th>
                <th>Qty</th>
                <th>Taxable Amount</th>
                <th>Tax</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            {#each table_data_config.data as item, index}
                <tr>
                    <td>{index + 1}</td>
                    <td style="max-width: 250px">{item.product_profile_id__text}</td>
                    <td>{formatCurrency(item.mrp.value)}</td>
                    <td>{formatCurrency(item.sale_price.value)}</td>
                    <td>{item.quantity.value}</td>
                    <td>{formatCurrency(item.amount_excluding_tax.value)}</td>
                    <td>{formatCurrency(item.tax_amount.value)}</td>
                    <td>{formatCurrency(item.amount.value)}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>

    <div class="totals_section">
        <div class="total_in_words">
            <div class="words_label">Total In Words</div>
            <div class="words_value">{convertToWords(table_data_config.grandTotal.amount)}</div>
        </div>

        <div class="totals_table">
            <div class="total_row">
                <span class="total_label">Sub Total</span>
                <span class="total_value">{formatCurrency(table_data_config.grandTotal.amount_excluding_tax)}</span>
            </div>
            <div class="total_row">
                <span class="total_label">Tax Amount</span>
                <span class="total_value">{formatCurrency(table_data_config.grandTotal.tax_amount)}</span>
            </div>
            <div class="total_row balance_row">
                <span class="total_label">Total Amount</span>
                <span class="total_value">{formatCurrency(table_data_config.grandTotal.amount)}</span>
            </div>
        </div>
    </div>

    <div class="notes_section">
        <div class="notes_label">Notes</div>
        <div class="notes_content">{invoice.notes}</div>
    </div>

    <div class="signature_section">
        <div class="signature_label">Authorized Signature</div>
    </div>
</div>


<style>
    .invoice_document {
        background-color: #fff;
        margin: 24px;
        padding: 40px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .invoice_header {
        display: flex;
        /*justify-content: space-between;*/
        justify-content: flex-end;
        align-items: flex-start;
        margin-bottom: 40px;
    }

    .company_info h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
    }

    .company_info p {
        margin: 4px 0;
        color: #666;
    }

    .invoice_title h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        color: #333;
    }

    .invoice_meta_section {
        margin-bottom: 30px;
    }

    .detail_row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .label {
        font-weight: 500;
        color: #666;
    }

    .value {
        font-weight: 600;
        color: #333;
    }

    .bill_to_section {
        margin-bottom: 30px;
    }

    .section_title {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .customer_name {
        margin: 0;
        font-size: 16px;
        color: #2196f3;
        font-weight: 500;
    }

    .items_section {
        margin-bottom: 30px;
    }

    .items_table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
    }

    .items_table th {
        background-color: #f8f9fa;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        border: 1px solid #e0e0e0;
    }

    .items_table td {
        padding: 12px;
        border: 1px solid #e0e0e0;
    }

    .totals_section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }

    .total_in_words {
        flex: 1;
        padding-right: 40px;
    }

    .words_label {
        font-weight: 600;
        margin-bottom: 8px;
    }

    .words_value {
        font-style: italic;
        color: #666;
    }

    .totals_table {
        min-width: 300px;
    }

    .total_row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .balance_row {
        font-weight: 600;
        font-size: 16px;
        border-bottom: 2px solid #333;
        padding: 12px 0;
    }

    .total_label {
        color: #666;
    }

    .total_value {
        font-weight: 600;
        color: #333;
    }

    .notes_section {
        margin-bottom: 30px;
    }

    .notes_label {
        font-weight: 600;
        margin-bottom: 8px;
    }

    .notes_content {
        color: #666;
    }

    .signature_section {
        text-align: right;
        margin-top: 60px;
    }

    .signature_label {
        font-weight: 600;
        color: #666;
    }
</style>



