



export async function get_dashboard_filter_data_from_server(dashboard_item_config) {
    // console.log('get_dashboard_filter_data_from_server', dashboard_item_config);
    let api_url = erp.backend_root_url + `/ajax/dashboard/${dashboard_item_config.dashboard_id}/${dashboard_item_config.id}/get_filter_data`;

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
    let api_url = erp.backend_root_url + `/ajax/dashboard/${dashboard_item_config.dashboard_id}/${dashboard_item_config.id}/get_report_item_data`;

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
            resolve(responseObj.result);
            // console.log('get_dashboard_filter_data_from_server done', status, responseObj)
        });
    });


}




