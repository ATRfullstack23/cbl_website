


export async function get_all_dashboards_of_user() {
    // console.log('get_dashboard_report_item_data_from_server', dashboard_item_config, filter_config);
    let api_url = window.erp.backend_root_url + `/ajax/dashboard_v2/get_all_dashboards_of_user`;

    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            type: 'POST',
            url: api_url,
            data: {
                _source: JSON.stringify({
                    config: {
                        "all" : 1
                    }
                })
            }
        }).always((responseObj, status)=>{
            if(responseObj.error || responseObj.errorMessage){
                reject(responseObj);
                return;
            }
            let dashboards_info = responseObj.result.dashboards_info;
            let temp_user_login_result = JSON.parse(localStorage.user_login_result);
            temp_user_login_result.dashboards = dashboards_info;
            localStorage.user_login_result = JSON.stringify(temp_user_login_result);

            resolve(dashboards_info);
            // console.log('get_dashboard_filter_data_from_server done', status, responseObj)
        });
    });
}

export async function update_dashboard_item_in_server(dashboard_row_id, dashboard_item_row_id, dashboard_item_config) {
    // console.log('get_dashboard_report_item_data_from_server', dashboard_item_config, filter_config);
    let api_url = window.erp.backend_root_url + `/ajax/dashboard_v2/${dashboard_row_id}/${dashboard_item_row_id}/update_dashboard_item`;

    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            type: 'POST',
            url: api_url,
            data: {
                _source: JSON.stringify({config: {dashboard_item_config}})
            }
        }).always((responseObj, status)=>{
            if(responseObj.error || responseObj.errorMessage){
                reject(responseObj);
                return;
            }
            resolve(responseObj.result);
            // console.log('get_dashboard_filter_data_from_server done', status, responseObj)
        });
    });
}


export async function add_new_dashboard_item_in_server(dashboard_row_id, dashboard_item_config) {
    // console.log('get_dashboard_report_item_data_from_server', dashboard_item_config, filter_config);
    let api_url = window.erp.backend_root_url + `/ajax/dashboard_v2/${dashboard_row_id}/add_new_dashboard_item`;

    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            type: 'POST',
            url: api_url,
            data: {
                _source: JSON.stringify({config: {dashboard_item_config}})
            }
        }).always((responseObj, status)=>{
            if(responseObj.error || responseObj.errorMessage){
                reject(responseObj);
                return;
            }
            resolve(responseObj.result);
            // console.log('get_dashboard_filter_data_from_server done', status, responseObj)
        });
    });
}

export async function get_dashboard_filter_data_from_server(dashboard_item_config) {
    // console.log('get_dashboard_filter_data_from_server', dashboard_item_config);
    let api_url = erp.backend_root_url + `/ajax/dashboard_v2/${dashboard_item_config.dashboard_id}/${dashboard_item_config.id}/get_filter_data`;

    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            type: 'POST',
            url: api_url
        }).always((responseObj, status)=>{
            if(responseObj.error || responseObj.errorMessage){
                reject(responseObj);
                return;
            }
            resolve(responseObj.result);
            // console.log('get_dashboard_filter_data_from_server done', status, responseObj)
        });
    });


}



export async function get_dashboard_report_item_data_from_server(dashboard_item_config, filter_config) {
    // console.log('get_dashboard_report_item_data_from_server', dashboard_item_config, filter_config);
    let api_url = erp.backend_root_url + `/ajax/dashboard_v2/${dashboard_item_config.dashboard_id}/${dashboard_item_config.id}/get_report_item_data`;

    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            type: 'POST',
            url: api_url,
            data: {
                _source: JSON.stringify({config: {filter: filter_config}})
            }
        }).always((responseObj, status)=>{
            if(responseObj.error || responseObj.errorMessage){
                reject(responseObj);
                return;
            }
            console.log('get_dashboard_filter_data_from_server done', status, responseObj)
            resolve(responseObj.result);
        });
    });


}




