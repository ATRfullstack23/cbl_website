<script>

    export let label,icon;
   
    // function dispatch_event(params) {
        
    // }

</script>

<div class="label-container" on:click>
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
    <span class="label">{label}</span>
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
    }

    .label{
        font-weight: 700;
    }

</style>
