<script>

    import HorizontalCard from "./horizontal_card.svelte";

    export const user_data_json = [
        {
            employee_name: "Sharon Jacob",
            employee_email_id: "sharon.jacob@company.com",
            employee_designation: "Senior Developer",
            employee_id: "EMP001",
            employee_department: "Engineering"
        },
        {
            employee_name: "Anil Thomas",
            employee_email_id: "anil.thomas@company.com",
            employee_designation: "UI Designer",
            employee_id: "EMP002",
            employee_department: "Design"
        },
        {
            employee_name: "Reena Mathew",
            employee_email_id: "reena.mathew@company.com",
            employee_designation: "HR Manager",
            employee_id: "EMP003",
            employee_department: "Human Resources"
        }
    ];

    export const card_configuration_json = [
        {
            label: "Name",
            column_id: "employee_name"
        },
        {
            label: "Designation",
            column_id: "employee_designation"
        },
        {
            label: "Email",
            column_id: "employee_email_id"
        },
        {
            label: "Department",
            column_id: "employee_department"
        }
    ];

    export let layout = 'horizontal';
</script>

<div class="card_list">
    {#each user_data_json as data_item}
        <HorizontalCard data={data_item} config={card_configuration_json} />
    {/each}
</div>

<style>
    .card_list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
</style>
