<script>
    export let item;
    export let selected_navigation_item;
</script>

<li class="sidebar_dropdown_item"
    class:selected_navigation_item={selected_navigation_item?.id === item.id } on:click>
    {item.display_name}
</li>

<style>
    li{
        position: relative;
        border-radius: 3px;
        background-color: transparent;
        transition: background-color 300ms ease;
        padding-top: .26rem;
        padding-left: 32px;
        padding-bottom: .26rem;
    }

    li.selected_navigation_item{
        background-color: white;
        color: #000000;
    }

</style>
