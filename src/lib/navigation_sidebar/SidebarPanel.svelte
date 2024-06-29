<script>

    import Sidebar from "./Sidebar.svelte";

    export let navigation_config

</script>



<div class="sidebar_container">
    {#if navigation_config && navigation_config.items && navigation_config.items.length}
        <Sidebar navigation_config = {navigation_config}/>
    {/if}
</div>

<style>

    .sidebar_container{
        background-color: #262338;
        /*width: 12%;*/
        width: 250px;
    }

</style>