<svelte:options accessors/>

<script>
    import CardViewHelper from "$lib/card_view/CardViewHelper.svelte";
    import {onMount} from "svelte";

    export let container_element;
    export let submodule;
    export let display_config;

    export const submodule_id = submodule.id;


</script>


<div bind:this={container_element} class="subModule-container hidden">
    <div class="subModule-container" id="{submodule_id}">
        <div class="childSubReportsContainer">
            <div class="childSubReportsContainerCloseButton"></div>
        </div>
        <table class="hundred-percent subModule-container-table">
            <tbody>
            <tr class="buttonsRow" style="height: 90px;">
                <td>

                </td>
            </tr>
            <tr class="submodule-filter-container"></tr>
            <tr>
                <td id="viewsContainer">

                    {#if submodule.hasThumbnailViewMode}
                            <CardViewHelper submodule="{submodule}"
                                            bind:this={submodule.cardViewHelper}
                                            card_config="{submodule.cardViewConfig}" />
                    {/if}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>


<style>


</style>

