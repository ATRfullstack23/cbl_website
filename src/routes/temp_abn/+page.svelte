<script>

    import PaginationUI from "$lib/ui_elements/PaginationUI.svelte";

    let api_grid_data = {
        "data": [
            {
                "id": 1000068,
                "invoice_number": {
                    "value": "IN5"
                },
                "customer_profile_id": {
                    "value": 1000005,
                    "text": "Silpa"
                },
                "customer_profile_id__text": "Silpa",
                "invoice_date": {
                    "value": "2024-05-27T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 1
                },
                "total_amount": {
                    "value": 3960
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 0
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-31T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 5
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 4
                },
                "amount_excluding_tax": {
                    "value": 3600
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:57:13.130Z",
                "_created_at_timestamp_in_utc": "1749106633121",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            },
            {
                "id": 1000067,
                "invoice_number": {
                    "value": "IN4"
                },
                "customer_profile_id": {
                    "value": 1000002,
                    "text": "Sarath"
                },
                "customer_profile_id__text": "Sarath",
                "invoice_date": {
                    "value": "2024-05-26T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 1
                },
                "total_amount": {
                    "value": 5775
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 0
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-30T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 4
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 4
                },
                "amount_excluding_tax": {
                    "value": 5500
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:56:09.950Z",
                "_created_at_timestamp_in_utc": "1749106569941",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            },
            {
                "id": 1000066,
                "invoice_number": {
                    "value": "IN3"
                },
                "customer_profile_id": {
                    "value": 1000005,
                    "text": "Silpa"
                },
                "customer_profile_id__text": "Silpa",
                "invoice_date": {
                    "value": "2024-05-24T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 2
                },
                "total_amount": {
                    "value": 37950
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 0
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-30T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 3
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 6
                },
                "amount_excluding_tax": {
                    "value": 34500
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:54:34.133Z",
                "_created_at_timestamp_in_utc": "1749106474123",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            },
            {
                "id": 1000065,
                "invoice_number": {
                    "value": "IN2"
                },
                "customer_profile_id": {
                    "value": 1000002,
                    "text": "Sarath"
                },
                "customer_profile_id__text": "Sarath",
                "invoice_date": {
                    "value": "2024-05-22T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 2
                },
                "total_amount": {
                    "value": 3327
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 0
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-30T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 2
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 8
                },
                "amount_excluding_tax": {
                    "value": 2980
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:52:16.350Z",
                "_created_at_timestamp_in_utc": "1749106336337",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            },
            {
                "id": 1000064,
                "invoice_number": {
                    "value": "IN1"
                },
                "customer_profile_id": {
                    "value": 1000001,
                    "text": "John"
                },
                "customer_profile_id__text": "John",
                "invoice_date": {
                    "value": "2024-05-20T18:30:00.000Z"
                },
                "invoice_items": {
                    "value": 2
                },
                "total_amount": {
                    "value": 23100
                },
                "invoice_status": {
                    "value": "approved"
                },
                "billing_address": {
                    "value": null
                },
                "customer_billing_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_billing_address_id__text": null,
                "customer_shipping_address_id": {
                    "value": null,
                    "text": null
                },
                "customer_shipping_address_id__text": null,
                "shipping_address": {
                    "value": null
                },
                "balance_due": {
                    "value": 3100
                },
                "payments": {
                    "value": 1
                },
                "due_date": {
                    "value": "2024-05-25T18:30:00.000Z"
                },
                "payment_status": {
                    "value": "partially_paid"
                },
                "employee_profile_id": {
                    "value": null,
                    "text": null
                },
                "employee_profile_id__text": null,
                "transaction_number_series_id": {
                    "value": 1000009,
                    "text": 1000009
                },
                "transaction_number_series_id__text": 1000009,
                "transaction_number_prefix": {
                    "value": "IN"
                },
                "transaction_record_number": {
                    "value": 1
                },
                "transaction_number_suffix": {
                    "value": ""
                },
                "project_profile_id": {
                    "value": null,
                    "text": null
                },
                "project_profile_id__text": null,
                "due_days": {
                    "value": 5
                },
                "amount_excluding_tax": {
                    "value": 22000
                },
                "_creation_date": "2025-06-04T18:30:00.000Z",
                "_creation_time": "1970-01-01T06:45:02.320Z",
                "_created_at_timestamp_in_utc": "1749105902310",
                "_creator": 1000001,
                "_last_edited_date": null,
                "_last_edited_time": null,
                "_last_edited_at_timestamp_in_utc": null,
                "_last_edited_by": null
            }
        ],
        "pager": {
            "totalRows": 5,
            "selectedPageIndex": 1,
            "pageSize": 10,
            "orderByType": "DESC",
            "orderByColumn": "id"
        }
    }

    let invoice_data_array = api_grid_data.data
    let pagination_data = api_grid_data.pager

    let selected_item = invoice_data_array[0]

    function handle_selected_preview_item(event,invoice){
            selected_item = invoice
        let selected_element = event.target.parentElement
        selected_element.scrollIntoView({behavior: "smooth", block: "center"})
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
                description: 'Web Development Services',
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


    function handleEdit() {
        alert('Edit functionality would be implemented here');
    }

    function handleSend() {
        alert('Send functionality would be implemented here');
    }

    function handleShare() {
        alert('Share functionality would be implemented here');
    }

    function handlePrint() {
        window.print();
    }

    function handleRecordPayment() {
        alert('Record Payment functionality would be implemented here');
    }

    function handleMarkAsSent() {
        alert('Invoice marked as sent!');
    }

    function handleSendInvoice() {
        alert('Invoice sent successfully!');
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-GB');
    }

    function convertToWords(amount) {
        // Simple implementation - in real app, use a proper number-to-words library
        return `Indian Rupees ${Math.floor(amount).toLocaleString()} Only`;
    }
    function handle_page_change(event) {
        pagination_data.selectedPageIndex = event.detail.page;
        pagination_data = pagination_data
        // You can call your API here to fetch data for new page
    }

</script>

{#if invoice}
    <div class="invoice_detail_container">
        <!-- Left Sidebar -->
        <div class="sidebar">
            <button class="back_btn">← All Invoices</button>
            <PaginationUI
                    totalRows={pagination_data.totalRows}
                    selectedPageIndex={pagination_data.selectedPageIndex}
                    pageSize={pagination_data.pageSize}
                    on:pageChange={handle_page_change}
            />
            <div class="invoice_cards_container_outer">
                {#each invoice_data_array as invoice}
                    <div class="invoice_summary" class:selected={selected_item.id==invoice.id} on:click={(e)=>handle_selected_preview_item(e,invoice)}>
                        <div class="customer_info">
                            <h3>{invoice.customer_profile_id__text}</h3>
                            <p class="invoice_meta">{invoice.invoice_number.value}-{invoice.id} • {formatDate(invoice.invoice_date.value)}</p>
                            <span class="status_badge status_{invoice.payment_status.value.toLowerCase()}">
                                {invoice.payment_status.value}
                            </span>
                        </div>

                        <div class="amount_display">
                            <div class="amount_large">{formatCurrency(invoice.total_amount.value)}</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Main Content -->
        <div class="main_content">
            <!-- Action Bar -->
            <div class="action_bar">
                <div class="action_buttons">
                    <button class="action_btn" on:click={handleEdit}>
                        ✏️ Edit
                    </button>
                    <button class="action_btn dropdown_btn" on:click={handleSend}>
                        📧 Send ▼
                    </button>
                    <button class="action_btn" on:click={handleShare}>
                        📤 Share
                    </button>
                    <button class="action_btn dropdown_btn" on:click={handlePrint}>
                        📄 PDF/Print ▼
                    </button>
                    <button class="action_btn" on:click={handleRecordPayment}>
                        💳 Record Payment
                    </button>
                    <button class="more_btn">⋯</button>
                </div>
            </div>

            <!-- Next Step Banner -->
            <div class="next_step_banner">
                <div class="banner_content">
                    <span class="star_icon">⭐</span>
                    <span class="banner_text">
            <strong>WHAT'S NEXT?</strong> Send this invoice to your customer or mark it as Sent.
          </span>
                    <button class="banner_btn primary" on:click={handleSendInvoice}>Send Invoice</button>
                    <button class="banner_btn secondary" on:click={handleMarkAsSent}>Mark As Sent</button>
                </div>
            </div>

            <!-- Invoice Document -->
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
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each invoice.items as item, index}
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.description}</td>
                                <td>{item.quantity} pcs</td>
                                <td>{formatCurrency(item.rate)}</td>
                                <td>{formatCurrency(item.amount)}</td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>

                <div class="totals_section">
                    <div class="total_in_words">
                        <div class="words_label">Total In Words</div>
                        <div class="words_value">{convertToWords(invoice.total)}</div>
                    </div>

                    <div class="totals_table">
                        <div class="total_row">
                            <span class="total_label">Sub Total</span>
                            <span class="total_value">{formatCurrency(invoice.subtotal)}</span>
                        </div>
                        <div class="total_row">
                            <span class="total_label">Total</span>
                            <span class="total_value">{formatCurrency(invoice.total)}</span>
                        </div>
                        <div class="total_row balance_row">
                            <span class="total_label">Balance Due</span>
                            <span class="total_value">{formatCurrency(invoice.balanceDue)}</span>
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
        </div>
    </div>
{:else}
    <div class="error_container">
        <h2>Invoice not found</h2>
        <button>← Back to invoices</button>
    </div>
{/if}

<style>
    .invoice_detail_container {
        display: flex;
        min-height: 100vh;
        background-color: #f5f5f5;
    }

    .sidebar {
        width: 360px;
        background-color: #fff;
        border-right: 1px solid #e0e0e0;
        padding: 20px;
        /*overflow-y: auto;*/
    }

    .back_btn {
        background: none;
        border: none;
        color: #4285f4;
        cursor: pointer;
        font-size: 14px;
        padding: 8px 0;
        margin-bottom: 20px;
    }

    .back_btn:hover {
        text-decoration: underline;
    }

    .invoice_summary, .other_invoices {
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        margin-bottom: 16px;
        margin-right: 8px;
        cursor: pointer;
    }
    .invoice_summary.selected {
        border: 2px solid #4285f4;

    }

    .customer_info h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
    }

    .invoice_meta {
        margin: 0 0 12px 0;
        color: #666;
        font-size: 14px;
    }

    .status_badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .status_paid {
        background-color: #e8f5e8;
        color: #2e7d32;
    }

    .status_draft {
        background-color: #f5f5f5;
        color: #666;
    }

    .amount_display {
        margin-top: 16px;
    }

    .amount_large {
        font-size: 24px;
        font-weight: 600;
        color: #333;
    }

    .main_content {
        flex: 1;
        padding: 0;
    }

    .action_bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        background-color: #fff;
        border-bottom: 1px solid #e0e0e0;
    }

    .action_buttons {
        display: flex;
        gap: 8px;
    }

    .action_btn {
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        background-color: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease;
    }

    .action_btn:hover {
        background-color: #f8f9fa;
    }

    .dropdown_btn::after {
        content: '';
    }

    .more_btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 8px;
    }

    .close_btn {
        cursor: pointer;
        font-size: 18px;
        padding: 8px;
    }

    .next_step_banner {
        background-color: #e3f2fd;
        border: 1px solid #2196f3;
        border-radius: 8px;
        margin: 24px;
        padding: 16px;
    }

    .banner_content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .star_icon {
        font-size: 16px;
    }

    .banner_text {
        flex: 1;
        font-size: 14px;
    }

    .banner_btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
    }

    .banner_btn.primary {
        background-color: #2196f3;
        color: white;
    }

    .banner_btn.secondary {
        background-color: #fff;
        color: #2196f3;
        border: 1px solid #2196f3;
    }

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

    .error_container {
        padding: 40px;
        text-align: center;
    }

    .error_container button {
        background-color: #4285f4;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 20px;
    }

    @media print {
        .sidebar, .action_bar, .next_step_banner {
            display: none;
        }

        .main_content {
            padding: 0;
        }

        .invoice_document {
            margin: 0;
            box-shadow: none;
            border: none;
        }
    }

    .invoice_cards_container_outer{
        max-height: 60vh;
        overflow-y: auto;
        padding: 10px 0;
    }

</style>