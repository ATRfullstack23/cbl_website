<svelte:options accessors/>

<script>
    import Submodule from "$lib/submodule/Submodule.svelte";
    import {tick} from "svelte";

    export let container_element;
    export let module;
    export let display_config;

    export const module_id = module.id;

    let submodule_instances = [];
    let submodule_svelte_elements_for_reference = [];


    async function add_submodule_instance_for_reference(submodule) {
        submodule_instances.push(submodule);
        submodule.svelte_reference_index = submodule_instances.length - 1;
        submodule_instances = submodule_instances;
        await tick();
        // await time_sleep(100);
        submodule.svelte_element_instance = submodule_svelte_elements_for_reference[submodule.svelte_reference_index];
    }

    module.add_submodule_instance_for_reference = add_submodule_instance_for_reference;



</script>


<div bind:this={container_element} id="{module_id}" class="module-panel hidden">
    <div class="submodule_navigation_container">
    </div>
    <div class="submodules_container">
        {#each submodule_instances as submodule_info, index}
            <Submodule submodule="{submodule_info}"
                       bind:this={submodule_svelte_elements_for_reference[index]}/>
        {/each}

    </div>
</div>


<style>


</style>

