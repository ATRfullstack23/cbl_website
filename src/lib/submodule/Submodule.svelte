<svelte:options accessors/>

<script>
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
                    <div class="button-panel" id="{submodule_id}_button_manager_grid_view">
                        <table class="hundred-percent-x">
                            <tbody>
                            <tr>
                                <td class="searchButtonsContainerParent">
                                    <div class="searchButtonsContainer" style="display: none;">
                                        <div class="showSearchContainer icon"></div>
                                        <div class="clearSearch icon" style="display: none;"></div>
                                    </div>
                                </td>
                                <td>
                                    <div class="gridViewButtonsContainer"></div>
                                </td>
                                <td>
                                    <div class="defaultButtonsContainer">
                                        <div class="setDisplayModeButtonsContainer">
                                            <div class="setDisplayModeToGridView icon selected" title="Grid View"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="filter-tabPanel" id="{submodule_id}_filter_manager"></div>
                </td>
            </tr>
            <tr class="submodule-filter-container"></tr>
            <tr>
                <td id="viewsContainer"></td>
            </tr>
            </tbody>
        </table>
    </div>
</div>


<style>


</style>

