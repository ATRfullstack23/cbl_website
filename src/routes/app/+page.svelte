
<script>
    import {onMount, tick} from "svelte";
    import {ERP} from '$lib/client_scripts/ERP.js'
    import {time_sleep} from '$lib/client_scripts/BrowserUtils.js'
    import {page} from "$app/stores";
    import Sidebar from "$lib/navigation_sidebar/Sidebar.svelte";
    import Module from "$lib/submodule/Module.svelte";
    import Dashboard from "$lib/dashboard_utils/Dashboard.svelte";
    import {env} from "$env/dynamic/public";

    export let data;
    let device_type = $page.data.device_type;
    const backend_root_url = env.PUBLIC_ERP_ROOT_URL;

    let erp_instance;
    let dashboard_configurations_for_reference = [];
    let dashboards_container_element;

    function initialize_erp () {

        window.ERP_API_AJAX_ROOT_URL = env.PUBLIC_ERP_ROOT_URL + '/ajax';
        if(localStorage.user_login_result){
            window.__default_user_config = JSON.parse(localStorage.user_login_result);
        }

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

        jQuery.ajax({
            url: backend_root_url + '/configuration.json',
            cache: false,
            type: 'GET'
        }).success(function(erp_config){
            window.ERP = ERP;
            console.log('new erp', erp_instance)
            erp_config.backend_root_url = backend_root_url;
            erp_config.socket_io_url = backend_root_url + '/socket.io/socket.io.js?_=1719394543097';
            erp_instance = new ERP(erp_config, {user: user_obj});
            console.log('new erp', erp_instance)

            window.erp = erp_instance;
            erp_instance.initialize().then(()=>{
                dashboard_configurations_for_reference = erp_instance.user.userDetails.dashboards;
                tick().then(()=>{
                    for(const d_svelte_item of erp_instance.dashboards_arr){
                        console.log('d_svelte_item', d_svelte_item)
                        erp_instance.dashboards[d_svelte_item.dashboard_id] = d_svelte_item;
                    }

                    erp_instance.elements.dashboardContainer = jQuery(dashboards_container_element);
                    erp_instance.container.append(erp_instance.elements.dashboardContainer);

                    erp_instance.get_navigation_configuration().then((n_c)=>{
                        navigation_config = n_c;
                        console.log('navigation_config', navigation_config );
                        erp_instance.container.appendTo(erp_content__container_element);
                    });
                })

            });


        });

    }

    let erp_content__container_element;
    let navigation_config;
    onMount(async()=>{
        window._add_module_instance_for_reference = add_module_instance_for_reference;
        initialize_erp();
    });

    function handle_navigation_item_selected(evt) {
        console.log('handle_navigation_item_selected', evt.detail)
        let item_info = evt.detail;
        if(item_info.action_type === 'go_to_module'){
            erp_instance.setSelectedModule(item_info.context_data.module_id);
        }
        else if(item_info.action_type === 'go_to_dashboard'){
            erp_instance.setSelectedDashboard(item_info.context_data.dashboard_id);
        }
    }

    let module_instances_for_reference = [];
    let module_svelte_elements_for_reference = [];
    async function add_module_instance_for_reference(module_info) {
        module_instances_for_reference.push(module_info);
        module_instances_for_reference = module_instances_for_reference;
        module_info.svelte_reference_index = module_instances_for_reference.length - 1;
        await tick();
        // await time_sleep(100);
        module_info.svelte_element_instance = module_svelte_elements_for_reference[module_info.svelte_reference_index];
        return module_info.svelte_element_instance;
    }

</script>



<section class="main"
         class:pc={device_type !== "mobile"}
         class:mobile={device_type === "mobile"}
         style="--main_navigation_width:250px;"
         data-sveltekit-preload-data="off">
    <div class="main_navigation_container">
        <div class="navigation_header">
            <a class="navigation_header_name" href="/">
                <!--      <img-->
                <!--        src="https://binarytechs.in/images/b2.png"-->
                <!--        class="mr-3 h-6 sm:h-9"-->
                <!--        alt=" Binary Technologies Logo"-->
                <!--      />-->
                <span class="navigation_header_name_text">{erp_instance?.display_name || 'Mbme Pay'}</span>
            </a>
        </div>


        {#if navigation_config}
            {#if navigation_config && navigation_config.items && navigation_config.items.length}
                <Sidebar navigation_config={navigation_config}
                         on:navigation_item_selected={handle_navigation_item_selected}/>
            {/if}
        {/if}
    </div>


    <div bind:this={erp_content__container_element} class="erp_content__container">



    </div>


    <div class="dashboards_container hidden" bind:this={dashboards_container_element}>

        {#each dashboard_configurations_for_reference as dashboard_config, index}
            <!--        <pre class="mineee">{dashboard_config.id}</pre>-->
            <Dashboard dashboard_configuration="{dashboard_config}"
                       bind:this={erp_instance.dashboards_arr[index]}/>
        {/each}
    </div>



    {#each module_instances_for_reference as module_info, index}
<!--        <pre class="mineee">{module_info.id}</pre>-->
        <Module module="{module_info}"
                   bind:this={module_svelte_elements_for_reference[index]}/>
    {/each}






</section>


<style>
    .main{
        display: block;
        height: calc(100vh - 100px);
    }


    .main_navigation_container{
        background-color: #262338;
        width: var(--main_navigation_width);
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
    }

    .navigation_header{
        color: white;
    }
    .navigation_header_name{
        justify-content: center;
        align-items: center;
        display: flex;
        padding: 5px;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 1.5rem;
    }

    .erp_content__container{
        width: calc(100% - var(--main_navigation_width));
        margin-left: var(--main_navigation_width);
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .dashboards_container{
        height: 100%;
        width: 100%;
        background: rgb(239 240 246);
        /*width: calc(100% - var(--main_navigation_width));*/
        /*margin-left: var(--main_navigation_width);*/
        overflow-y: auto;
    }
</style>


