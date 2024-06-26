
<script>
    import {onMount} from "svelte";
    import {ERP} from '$lib/client_scripts/ERP.js'
    import erp_config from '$lib/app_data/configuration.json'

    function initialize_erp () {
        const user_obj = {
            config: {
                user: window.__default_user_config
            },
            userDetails: window.__default_user_config,
            users: {
                1000001: window.__default_user_config
            },
            configureSocket: ()=>{

            }
        }

        window.ERP = ERP;
        erp_config.socket_io_url = 'https://events-platform-sandbox.bigdate.events:17584/socket.io/socket.io.js?_=1719394543097';
        window.erp = new ERP(erp_config, {user: user_obj});

        // jQuery.ajax({
        //     url: '/configuration.json',
        //     cache: false,
        //     type: 'GET'
        // }).success(function(data){
        //     // window.erp.elements.content.prepend(erp.container);
        // });
    }

    onMount(()=>{
        initialize_erp();
    });
</script>




<div>

</div>


<style>

</style>