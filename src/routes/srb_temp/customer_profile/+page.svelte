<script>
    const customer_data = {
        id: 1000003,
        customer_profile_id: {
            value: 1000003,
            text: "Amal Nair"
        },
        email: "amal004nair@gmail.com",
        phone: "8129211065",
        invite_link: "https://example.com/invite",
        email_link: "mailto:amal004nair@gmail.com",
        default_billing_address: {
            value: "COMMERCIAL STREET\nP.B.NO. 71292\nSHARJAH"
        },
        default_shipping_address: {
            value: "SAME AS BILLING"
        },
        customer_type: { value: "Business" },
        default_currency: { value: "INR" },
        portal_status: { value: "Disabled" },
        portal_language: { value: "English" },
        receivables: [
            {
                currency: "INR - Indian Rupee",
                outstanding: 0.00,
                unused_credits: 0.00
            }
        ],
        income_summary: {
            total_last_6_months: 0.00
        },
        contact_persons: [
            {
                timestamp: "2025-07-14T06:17:00.000Z",
                event: "Contact person added",
                description: "Contact person Amal has been created",
                by: "Roshni M A"
            },
            {
                timestamp: "2025-07-14T06:17:00.000Z",
                event: "Contact added",
                description: "Contact created",
                by: "Roshni M A"
            }
        ]
    };

    const get_field_value = (field) => field?.value ?? 'Not available';

    const format_date = (iso_str) => {
        const date = new Date(iso_str);
        return date.toLocaleDateString('en-GB');
    };

    const format_time = (iso_str) => {
        const date = new Date(iso_str);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };
</script>


<div class="customer_details_wrapper">
    <div class="left_panel">
        <div class="section profile_section">
            <div class="profile_left">
                <div class="profile_picture"></div>
                <div class="profile_info">
                    <p class="customer_name">{customer_data.customer_profile_id?.text || 'Unknown Name'}</p>
                    <p class="customer_email">📧 {customer_data.email}</p>
                    <p class="customer_phone">📞 {customer_data.phone}</p>
                    <div class="profile_links">
                        <a href={customer_data.invite_link} class="blue_link">Invite to Portal</a>
                        <span class="divider">|</span>
                        <a href={customer_data.email_link} class="blue_link">Send Email</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="section collapsible_section">
            <h4 class="section_heading collapsible_title">ADDRESS</h4>
            <div class="info_row">
                <p class="field_label">Billing Address</p>
                <p class="field_value">
                    {customer_data.default_billing_address?.value || 'No Billing Address'}
                    <a href="#" class="blue_link"> - New Address</a>
                </p>
            </div>
            <div class="info_row">
                <p class="field_label">Shipping Address</p>
                <p class="field_value">
                    {customer_data.default_shipping_address?.value || 'No Shipping Address'}
                    <a href="#" class="blue_link"> - New Address</a>
                </p>
            </div>
        </div>

        <div class="section collapsible_section">
            <h4 class="section_heading collapsible_title">OTHER DETAILS</h4>
            <div class="info_row">
                <p class="field_label">Customer Type</p>
                <p class="field_value">{get_field_value(customer_data.customer_type)}</p>
            </div>
            <div class="info_row">
                <p class="field_label">Default Currency</p>
                <p class="field_value">{get_field_value(customer_data.default_currency)}</p>
            </div>
            <div class="info_row">
                <p class="field_label">Portal Status</p>
                <p class="field_value">
                    <span class="status_dot disabled"></span>
                    <span class="disabled_text">{get_field_value(customer_data.portal_status)}</span>
                </p>
            </div>
            <div class="info_row">
                <p class="field_label">Portal Language</p>
                <p class="field_value">{get_field_value(customer_data.portal_language)}</p>
            </div>
        </div>
    </div>

    <div class="right_panel">
        <div class="section receivables_section">
            <h4 class="section_heading blue_highlight">Receivables</h4>
            <table class="receivables_table">
                <thead>
                <tr>
                    <th>Currency</th>
                    <th>Outstanding Receivables</th>
                    <th>Unused Credits</th>
                </tr>
                </thead>
                <tbody>
                {#each customer_data.receivables as r}
                    <tr>
                        <td>{r.currency}</td>
                        <td>₹{r.outstanding.toFixed(2)}</td>
                        <td>₹{r.unused_credits.toFixed(2)}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>


        <div class="section income_section">
            <h4 class="section_heading blue_highlight">Income</h4>
            <p class="info_note">This chart is displayed in the organization’s base currency.</p>
            <div class="income_chart_placeholder">
                <p>Total Income (Last 6 Months): <strong>₹{customer_data.income_summary.total_last_6_months.toFixed(2)}</strong></p>
            </div>
        </div>

        <div class="section timeline_section">
            <h4 class="section_heading blue_highlight">Timeline</h4>
            <div class="timeline_container">
                {#each customer_data.contact_persons as item}
                    <div class="timeline_item">
                        <div class="timeline_left">
                            <p class="timeline_date">{format_date(item.timestamp)}</p>
                            <p class="timeline_time">{format_time(item.timestamp)}</p>
                        </div>
                        <div class="timeline_card">
                            <p class="timeline_title">{item.event}</p>
                            <p class="timeline_desc">{item.description}</p>
                            <p class="timeline_by">by <strong>{item.by}</strong></p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    p{
        margin: 0;
    }

    .customer_details_wrapper {
        display: flex;
        gap: 2rem;
        padding: 1.5rem;
        font-family: sans-serif;
        font-size: 0.82rem;
        background-color: #f8f9fb;
    }

    .left_panel, .right_panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .section {
        background-color: #ffffff;
        padding: 1rem 1.25rem;
        border-radius: 8px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .profile_section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        position: relative;
    }

    .profile_left {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    .profile_picture {
        width: 40px;
        height: 40px;
        background-color: #ccc;
        border-radius: 50%;
    }

    .profile_info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .profile_info p{
        margin: 0;
    }

    .customer_name {
        font-weight: bold;
        font-size: 0.95rem;
    }

    .customer_email,
    .customer_phone {
        font-size: 0.82rem;
        color: #444;
    }

    .profile_links {
        margin-top: 0.3rem;
    }

    .blue_link {
        font-size: 0.78rem;
        color: #2a73d9;
        text-decoration: none;
    }

    .blue_link:hover {
        text-decoration: underline;
    }

    .divider {
        margin: 0 6px;
        color: #999;
    }

    .collapsible_section {
        padding: 0.8rem 1.2rem;
    }

    .collapsible_title {
        text-transform: uppercase;
        font-size: 0.78rem;
        color: #333;
        font-weight: 600;
        margin-bottom: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .info_row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.8rem;
    }

    .field_label {
        flex: 1;
        font-weight: 500;
        color: #555;
        font-size: 0.82rem;
    }

    .field_value {
        flex: 2;
        color: #222;
        font-size: 0.82rem;
    }

    .blue_link {
        color: #2a73d9;
        text-decoration: none;
        font-size: 0.78rem;
    }

    .blue_link:hover {
        text-decoration: underline;
    }

    .status_dot.disabled {
        display: inline-block;
        width: 7px;
        height: 7px;
        background-color: red;
        border-radius: 50%;
        margin-right: 4px;
        position: relative;
        top: -1px;
    }

    .disabled_text {
        color: red;
        font-weight: 500;
        font-size: 0.82rem;
    }

    .section_heading {
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        color: #333;
    }

    .blue_highlight {
        color: #2a73d9;
    }

    .status_dot.disabled {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: red;
        border-radius: 50%;
        margin-right: 4px;
    }

    .receivables_table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.82rem;
        margin-top: 0.5rem;
    }

    .receivables_table th,
    .receivables_table td {
        border: 1px solid #ddd;
        padding: 0.5rem 0.6rem;
        text-align: left;
    }

    .income_chart_placeholder {
        background-color: #f0f4ff;
        border: 1px dashed #a3c3f2;
        border-radius: 6px;
        padding: 0.6rem;
        font-size: 0.82rem;
        margin-top: 0.5rem;
    }

    .info_note {
        font-size: 0.75rem;
        color: #777;
    }

    .timeline_section {
        padding-bottom: 1rem;
    }

    .timeline_container {
        position: relative;
        margin-top: 1rem;
        padding-left: 5.5rem;
        border-left: 2px solid #2a73d9;
    }

    .timeline_item {
        display: flex;
        margin-bottom: 2rem;
        position: relative;
    }

    .timeline_left {
        position: absolute;
        left: -4.5rem;
        top: 35px;
        text-align: right;
        width: 3rem;
        font-size: 0.72rem;
        color: #666;
    }

    .timeline_date,
    .timeline_time {
        line-height: 1.2;
    }

    .timeline_card {
        background-color: #ffffff;
        border: 1px solid #eee;
        border-radius: 6px;
        padding: 0.75rem 1rem;
        width: 100%;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .timeline_title {
        font-weight: 600;
        color: #222;
        margin-bottom: 0.25rem;
    }

    .timeline_desc {
        font-size: 0.82rem;
        color: #444;
    }

    .timeline_by {
        font-size: 0.78rem;
        color: #555;
        margin-top: 0.3rem;
    }

</style>
