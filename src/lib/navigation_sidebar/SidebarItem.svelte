<script>

    export let icon;
    export let item;
    export let selected_navigation_item;
    // function dispatch_event(params) {
        
    // }

</script>

<div class="label-container"
     class:selected_navigation_item={selected_navigation_item?.id === item.id }
     on:click>
    <span class="icon">
        <svg width=18 height=18
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path
                stroke="{icon.color}"
                stroke-width="2px"
                 d="{icon.url}"
            />
        </svg>
    </span>
    <span class="label">{item.display_name}</span>
</div>

<style>

    .icon{
        display: flex;
        margin: 0 4px;
    }
    .label-container {
        gap: .5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding-bottom: 10px;
        position: relative;
        border-radius: 3px;
        background-color: transparent;
        transition: background-color 300ms ease;
    }

    .label{
        font-weight: 700;
    }


    li.selected_navigation_item {
        background-color: white;
        color: #000000;
    }

</style>
