

<script>

    import {createEventDispatcher, onMount} from "svelte";

    export let action_button_config;

    const dispatch_event = createEventDispatcher();
    onMount(()=>{
        // console.log('action_button_config', action_button_config)
    });

    async function generate_filter_config(filters){
        const filter_config = {};

        for (const filter_item of filters) {
            if(filter_item.target_value_type === 'static'){
                filter_config[filter_item.filter_id] = filter_item.filter_value;
                continue;
            }

            // handle dynamic values here
        }


        return filter_config;

    }

    async function handle_action_button_element_click(){
        console.log('handle_action_button_element_click', action_button_config);

        const erp_instance = ERP.get_instance();

        const generated_filter_config =  await generate_filter_config(action_button_config.filters);

        console.log('generated_filter_config', generated_filter_config);

        erp_instance.setSelectedModule(action_button_config.module_id, {
            submodule_id: action_button_config.sub_module_id,
            filter_config: generated_filter_config || undefined
        });

    }


</script>



<div class="action_button_container">

    <button class="action_button_element" on:click={handle_action_button_element_click}>
        <span>{action_button_config.display_name}</span>
    </button>

</div>


<style>

    .action_button_container{

    }

    .action_button_element{

    }


</style>


