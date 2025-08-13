


export const CARD_VIEW_STATUS_BADGE_STYLES = {
    default_positive: 'default_positive',
    default_neutral: 'default_neutral',
    default_negative: 'default_negative',
}



export function check_single_condition(submodule, data_row, condition) {

    const column_value = get_column_actual_value(submodule, condition.column_id, data_row);

    switch (condition.condition) {
        case 'equals':
            if(column_value === condition.condition_value){
                return true;
            }
            break;
        case 'not_equals':
            if(column_value !== condition.condition_value){
                return true;
            }
            break;
    }

    return false;
}

export function get_card_status_conditions_value(submodule, data_row, conditions_obj) {

    const positive_conditions = conditions_obj.positive_conditions || [];
    const negative_conditions = conditions_obj.negative_conditions || [];
    const neutral_conditions = conditions_obj.neutral_conditions || [];


    for (const condition of positive_conditions) {
        const is_matched = check_single_condition(submodule, data_row, condition);
        const column_value = get_column_actual_value(submodule, data_row, condition.column_id);
        console.log('ccc ----- > ', column_value, condition)
        if(is_matched){
            console.log('condition passed : ', condition);
            return CARD_VIEW_STATUS_BADGE_STYLES.default_positive;
        }
    }
    for (const condition of negative_conditions) {
        const is_matched = check_single_condition(submodule, data_row, condition);
        if(is_matched){
            console.log('condition passed : ', condition);
            return CARD_VIEW_STATUS_BADGE_STYLES.default_negative;
        }
    }

    for (const condition of neutral_conditions) {
        const is_matched = check_single_condition(submodule, data_row, condition);
        if(is_matched){
            console.log('condition passed : ', condition);
            return CARD_VIEW_STATUS_BADGE_STYLES.default_neutral;
        }
    }


    return '';
}



export function get_column_display_value({submodule, column_id, data_row}) {
    // console.log('get_column_display_value', arguments.length, arguments);
    let value_to_return = data_row[column_id]?.text || data_row[column_id]?.value || data_row[column_id]?.name;

    const column_info = submodule.get_column_from_id(column_id);
    if(column_info.type === 'image' && data_row[column_id]?.value){
        value_to_return = data_row[column_id].value;
        value_to_return.url = submodule.get_backend_erp_root_url() + data_row[column_id].url;
    }

    return value_to_return;
}

export function get_column_actual_value(submodule, column_id, data_row) {
    return data_row[column_id]?.value || data_row[column_id]?.text;
}

export function get_column_type({submodule, column_id}) {
    return submodule.columnManager.columns[column_id]?.type;
}
