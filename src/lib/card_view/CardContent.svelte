<script>

export let column, item;
import dayjs from 'dayjs';

</script>

<div> 
    <span class="display-name">{column.display_name}:</span>
    <span class="value">
        {#if column.type == "date"}
            {dayjs(item[column.id]?.text).format('DD-MM-YYYY') || dayjs(item[column.id]?.value).format('DD-MM-YYYY')} 
        {:else if column.type == "multiLine"}
            {item[column.id]?.text || item[column.id]?.value} 
        {:else if column.type == "singleLine"}
            {item[column.id]?.text || item[column.id]?.value} 
        {:else}
            {item[column.id]?.text || item[column.id]?.value} 
        {/if}
    </span> 
</div>

<style>

</style>