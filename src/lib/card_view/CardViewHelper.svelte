<svelte:options accessors/>

<script>
    import CardContent from './CardContent.svelte'
    import {onMount, tick} from "svelte";
    import BasicCard from "$lib/card_view/templates/BasicCard.svelte";
    import BasicDetailedCard from "$lib/card_view/templates/BasicDetailedCard.svelte";
    import ClassicCard from "$lib/card_view/templates/ClassicCard.svelte";
    import ModernCard from "$lib/card_view/templates/ModernCard.svelte";
    import CustomerCompactCard from "$lib/card_view/templates/CustomerCompactCard.svelte";
    import CustomerDetailedCard from "$lib/card_view/templates/CustomerDetailedCard.svelte";
    import CustomerMinimalCard from "$lib/card_view/templates/CustomerMinimalCard.svelte";
    import FinancialYearCardCompact from "$lib/card_view/templates/FinancialYearCardCompact.svelte";
    import FinancialYearCardMinimal from "$lib/card_view/templates/FinancialYearCardMinimal.svelte";
    import InvoiceCompactCard from "$lib/card_view/templates/InvoiceCompactCard.svelte";
    import InvoiceDetailedCard from "$lib/card_view/templates/InvoiceDetailedCard.svelte";
    import LeaveCompactCard from "$lib/card_view/templates/LeaveCompactCard.svelte";
    import LeaveDetailedCard from "$lib/card_view/templates/LeaveDetailedCard.svelte";
    import LeaveMinimalCard from "$lib/card_view/templates/LeaveMinimalCard.svelte";
    import ProductProfileCardCompact from "$lib/card_view/templates/ProductProfileCardCompact.svelte";
    import ProductProfileCardDetailed from "$lib/card_view/templates/ProductProfileCardDetailed.svelte";
    import ReceiptCompactCard from "$lib/card_view/templates/ReceiptCompactCard.svelte";
    import ReceiptDetailedCard from "$lib/card_view/templates/ReceiptDetailedCard.svelte";


    export let container;
    export let container_element;
    export let elements = {};
    export let submodule;
    export let display_config;

    export const submodule_id = submodule.id;

    export let card_config;
    export let card_data = [];
    export let card_data_map = {};

    let card_view_data_mapping_processed = {};


    onMount(()=>{
        container = jQuery(container_element);
    });

    let header_title_column;
    let header_subtitle_column;

    let cardview_settings = {
        data_mapping: {}
    };
    let selected_cardview_template = 'classic_card';

    function parse_card_view_data_mapping() {
        card_view_data_mapping_processed = {};


        const items = CardView.TEMPLATES[selected_cardview_template].data_mapping_config.items;

        for(const item of items){
            const value = cardview_settings.data_mapping[item.unique_id];
            let processed_value;
            if(item.input_type === 'column_id' && item.data_type === 'array_of_objects'){
                processed_value = [];

                // iterate through value here
            }
            else if(item.input_type === 'column_id'){
                processed_value = value;
            }

            card_view_data_mapping_processed[item.unique_id] = processed_value;
        }


        // for(const key in cardview_settings.data_mapping){
        //     const value = cardview_settings.data_mapping[key];
        //     let processed_value;
        //     if(typeof value === 'string'){
        //         processed_value = {
        //             column_id: value
        //         }
        //     }
        //     else if(value instanceof Array){
        //         // handle multiple values here
        //         processed_value = [];
        //     }
        //
        //     card_view_data_mapping_processed[key] = processed_value;
        // }
        console.log('card_view_data_mapping_processed', card_view_data_mapping_processed)

    }


    let is_hidden = true;
    let cards_container_width = null;
    export function show(){
        cardview_settings = submodule.get_latest_card_view_settings();
        selected_cardview_template = cardview_settings.type;
        parse_card_view_data_mapping()
        is_hidden = false;
        tick().then(()=>{
            cards_container_width = elements.cards_container.clientWidth;
        });
    }
    export function hide(){
        is_hidden = true;
    }

    let lastRequestTime;
    export function get_data(options){
        const self = this;
        //var filter = grid.filterManager.getFilter();
        var data = {};
        var pagerFilter = submodule.common_pager.getPagerFilter();
        data.pageIndex = pagerFilter.pageIndex;
        data.pageSize = pagerFilter.pageSize;
        var sort = submodule.grid.getSortCondition();
        data.orderByColumn = sort.sortColumn.id;
        data.orderByType = sort.sortType;
        data.filter = {};
//            console.log(data)
        lastRequestTime = new Date();

        if(options){
            var requestId = crypto.getRandomValues(new Uint16Array(1))[0];
            data.requestId = requestId;
            submodule.erp.getSocket().gridView.events[requestId] = options;
        }

        // socket.emit(grid.socketEvents.getGridData, {config:data});

        // console.log(grid.socketEvents.getGridData, {config:data});

        var url = submodule.getAjaxUrl('getGridData');

        jQuery.ajax({
            type: 'POST',
            data: {config:data},
            url: url,
        }).always(function (responseObj, status) {
            // console.log(grid.socketEvents.getGridData + '_Done', responseObj, status);
            get_data_done(responseObj);
        });

        // grid.showDataHidingAnimation();
    }



    function get_data_done(data){
        if(data.success){
            //console.log(new Date() - grid.lastRequestTime);

            if(submodule.parentDataRow && submodule.parentDataRow.id){
                var currentParentDataRowId = submodule.parentDataRow.id;
                if(data.result && data.result.parentDataRowId){
                    if(data.result.parentDataRowId != currentParentDataRowId){
                        return;
                    }
                }
            }

            // grid.data = {};
            card_data = [];
            card_data_map = {};
            if(data.result && data.result.data && data.result.data.length){
                data.result.data.forEach(function(dataRow){
                    card_data_map[dataRow.id] = dataRow;
                });
                card_data = data.result.data;
            }
            submodule.set_latest_display_data(card_data, card_data_map);
//                console.log(data.result)
//             var toRestoreChildWindows = [];
//             if(grid.elements.tbody){
//                 grid.elements.tbody.children('tr.inlineViewMode').each(function () {
//                     toRestoreChildWindows.push({
//                         rowId : $(this).prev().attr('id'),
//                         childWindows : $(this).prev().data('childWindows')
//                     });
//                 }).detach();
//                 grid.elements.tbody.remove();
//             }
//             var tbody = $(grid._creation.createTableBody(grid));
//             grid.elements.tbody = tbody;
//
//             if(grid.erp.deviceType == ERP.DEVICE_TYPES.PC){
//                 grid.boxUpAnimation.initializeElement(tbody);
//             }
//
//             grid.elements.table.append(tbody);
//
//             toRestoreChildWindows.forEach(function (obj) {
//                 for(var key in obj.childWindows){
//                     // console.log('---', '#' + obj.rowId, '.grid-data-item[data-id="'+ key +'"]');
//                     setTimeout(function () {
//                         tbody.children('#' + obj.rowId).find('.grid-data-item[data-id="'+ key +'"]')
//                             .trigger('click');
//                     }, 300);
//
//                 }
//             });

            // if(grid.subModule.columnManager.hasFooterColumns){
            //     grid.footerData = {
            //         subTotal: data.result.subTotal,
            //         grandTotal: data.result.grandTotal
            //     };
            //     grid.setFooterToNormalMode();
            //     grid.setFooterData();
            // }
            // if(grid.erp.deviceType == ERP.DEVICE_TYPES.PC){
            //     setTimeout(function(){
            //         grid.boxUpAnimation.show(tbody)
            //     }, 0);
            // }

            submodule.common_pager.updateUi(data.result.pager);
            if(data.requestId){
                var options = submodule.getSocket().gridView.events[data.requestId];
                if(options){
                    options.callback(submodule.grid, options.options); //by right should pass this
                }
            }
        }
        else{
            submodule.notifier.showReportableErrorNotification(data.errorMessage);
        }

        submodule.buttonManager.rowSelectorChanged();
    }


    export function show_edit_card_view_data_mapping_popup() {
        window.show_card_view_data_mapping_config_popup(submodule, selected_cardview_template, cardview_settings.data_mapping);
    }

    // card_data = data?.card_data;

</script>



<div bind:this={container_element} class="card_view_helper" class:hidden={is_hidden}>

    <!--    <pre> Cards {card_data?.length}</pre>-->

    <div bind:this={elements.cards_container} class="main_container cards_container"
         style="{cards_container_width? '--cards_container_width:' + cards_container_width + 'px;' : ';'}"
         class:card_container__classic_card={selected_cardview_template === CardView.TEMPLATES.classic_card.id}
         class:card_container__basic_card={selected_cardview_template === CardView.TEMPLATES.basic_card.id}>

        {#if card_data.length>0}
            {#each card_data as item}

<!--                <div class="single_card_view_data_row single_data_row_of_submodule">-->
<!--                    {#if selected_cardview_template === CardView.TEMPLATES.classic_card.id}-->
<!--                        <ClassicCard submodule="{submodule}" data_row="{item}"/>-->
<!--                    {/if}-->
<!--                </div>-->

                <div class="single_card_view_data_row single_data_row_of_submodule">
                    <input type="checkbox" class="card-row-selector" data-id="{item.id}">
                    {#if selected_cardview_template === CardView.TEMPLATES.classic_card.id}
                        <ClassicCard submodule="{submodule}" data_row="{item}" config="{cardview_settings}" data_mapping="{card_view_data_mapping_processed}"/>
                    {/if}

                    <!--{#if selected_cardview_template === CardView.TEMPLATES.classic_card.id}-->
                    <!--    <ClassicCard submodule="{submodule}" data_row="{item}"/>-->
                    <!--{/if}-->

                </div>

<!--                <BasicCard/>-->
<!--                <BasicDetailedCard/>-->
<!--                <ModernCard/>-->
<!--                <CustomerCompactCard/>-->
<!--                <CustomerDetailedCard/>-->
<!--                <CustomerMinimalCard/>-->
<!--                <FinancialYearCardCompact/>-->
<!--                <FinancialYearCardMinimal/>-->
<!--                <InvoiceCompactCard/>-->
<!--                <InvoiceDetailedCard/>-->
<!--                <LeaveCompactCard/>-->
<!--                <LeaveDetailedCard/>-->
<!--                <LeaveMinimalCard/>-->
<!--                <ProductProfileCardCompact/>-->
<!--                <ProductProfileCardDetailed/>-->
<!--                <ReceiptCompactCard/>-->
<!--                <ReceiptDetailedCard/>-->


                <!--                <div class="card single_card_view_data_row single_data_row_of_submodule">-->
                <!--                    <input type="checkbox" class="card-row-selector" data-id="{item.id}">-->
                <!--                    <div class="card-header">-->
                <!--                        {item.fullName.value} - {item.leave_type_id?.text}-->
                <!--                    </div>-->
                <!--                    <div class="card-content">-->
                <!--                        {#if card_config.columns.length>0}-->
                <!--                            {#each card_config.columns as column}-->
                <!--                                <CardContent column={column} item={item}/>-->
                <!--                            {/each}-->
                <!--                        {/if}-->
                <!--                    </div>-->
                <!--                    &lt;!&ndash;                <div class="card-footer">&ndash;&gt;-->
                <!--                    &lt;!&ndash;                    <div>Created On: {dayjs(item._creation_date).format('DD-MM-YYYY')}</div>&ndash;&gt;-->
                <!--                    &lt;!&ndash;                    <div>Created By: {item._creator}</div>&ndash;&gt;-->
                <!--                    &lt;!&ndash;                </div>&ndash;&gt;-->
                <!--                </div>-->


            {/each}
        {/if}
    </div>
</div>



<style>

    .card-row-selector{
        display: none;
    }


    .main_container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .cards_container{


        &.card_container__classic_card{
            display: flex;
            gap: 10px;
        }
        &.card_container__basic_card{

        }
    }

    .card {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 16px;
        margin: 16px;
        max-width: 300px;
        min-width: 300px;
        height: 100%;
    }
    .card-header {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 8px;
    }
    .card-content {
        font-size: 1rem;
        margin-bottom: 8px;
    }
    .card-footer {
        font-size: 0.875rem;
        color: #555;
    }

    .single_card_view_data_row{
        display: contents;
    }
    .single_card_view_data_row:global(.selected){
        border: 1px solid crimson;
    }

</style>



