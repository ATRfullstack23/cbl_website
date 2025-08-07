<script>
    import dayjs from "dayjs";

    export let data_row;
    export let config;

    export let data_mapping = {
        main_header_text : "fullName",
        main_header_caption : "designation_profile_row_id",
        main_detail_items : [
            {item_value : "nationality", item_text : ""},
            {item_value : "phone_number", item_text : ""},
            {item_value : "registered_email_id", item_text : ""}
        ]
    };

    function get_column_display_value(column_id){
        // const column_instance = get_column_instance(column_id);
        // let display_value = column_instance.parseDisplayValue(data_row);

        // if(column_id === 'due_date'){
        //     display_value = dayjs(display_value).format('DD MMM YYYY')
        // }
        // return display_value;

        return data_row[column_id]?.text || data_row[column_id]?.value;
    }

    function get_column_display_name(column_id){
        return column_id?.toUpperCase() || '-';
    }

</script>

<div class="card_modern">
    <div class="card_background"></div>
    <div class="card_content">
        <div class="avatar_container">
            <img src="/card_renderer/user.png" alt="John Doe" class="avatar" />
            <div class="avatar_ring"></div>
        </div>

        <div class="card_info">
            <h3 class="card_title">{get_column_display_value(data_mapping.main_header_text)}</h3>
            <span class="card_subtitle">{get_column_display_value(data_mapping.main_header_caption)}</span>
            <span class="status_indicator status_active"></span>
        </div>

        <div class="data_grid">
            {#each data_mapping.main_detail_items as item}
            <div class="data_item">
                <span class="data_icon">🏢</span>
                <div class="data_content">
                    <span class="data_label">{get_column_display_name(item.item_text)}:</span>
                    <span class="data_value">{get_column_display_value(item.item_value)}</span>
                </div>
            </div>
            {/each}

        </div>
    </div>
</div>


<style>
    .card_modern {
        position: relative;
        background: #ffffff;
        border-radius: 20px;
        padding: 24px;
        margin-bottom: 20px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid #f0f0f0;
    }

    .card_background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 80px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        opacity: 0.1;
        transition: opacity 0.3s ease;
    }

    .card_modern:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
    }

    .card_modern:hover .card_background {
        opacity: 0.2;
    }

    .card_content {
        position: relative;
        z-index: 1;
    }

    .avatar_container {
        position: relative;
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
    }

    .avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #ffffff;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    .avatar_ring {
        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 78px;
        height: 78px;
        border: 2px solid #667eea;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .card_modern:hover .avatar {
        transform: scale(1.1);
    }

    .card_modern:hover .avatar_ring {
        opacity: 1;
    }

    .card_info {
        text-align: center;
        margin-bottom: 20px;
        position: relative;
    }

    .card_title {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: 700;
        color: #2d3748;
    }

    .card_subtitle {
        font-size: 14px;
        color: #718096;
        font-weight: 500;
    }

    .status_indicator {
        position: absolute;
        top: 0;
        right: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #ffffff;
    }

    .status_active {
        background: #48bb78;
    }

    .status_inactive {
        background: #f56565;
    }

    .status_on_leave {
        background: #ed8936;
    }

    .data_grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .data_item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid #f7fafc;
    }

    .data_item:last-child {
        border-bottom: none;
    }

    .data_icon {
        font-size: 16px;
        width: 24px;
        text-align: center;
    }

    .data_content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;

    }

    .data_label {
        font-size: 13px;
        color: #a0aec0;
        font-weight: 500;
    }

    .data_value {
        font-size: 13px;
        color: #2d3748;
        font-weight: 600;
    }

    .email {
        color: #667eea;
    }

    .salary {
        color: #48bb78;
        background: #f0fff4;
        padding: 2px 8px;
        border-radius: 12px;
    }

</style>