<script>
    // import SimpleButton from "$lib/ui_elements/SimpleButton.svelte";
    import LoadingOverlay from "$lib/ui_elements/LoadingOverlay.svelte";
    import {onMount, getContext, tick} from "svelte";
    // import {page} from "$app/stores";


    let shall_show_loading_overlay = false;
    let dialog_element;
    let container_element;

    let header_display_name;
    let context_data;
    let pdf_url;
    let website_preview_iframe;
    let shall_show_dialog;

    let device_type = getContext('device_type');

    onMount(()=>{
        // window.addEventListener('message', async (event) => {
        //     console.log('message from iframe : ', event.data);
        //     // if (event.data.type === 'show_add_new_partial_component_ui') {
        //     //
        //     // }
        //     if (event.data.type === 'update_user_data_done') {
        //         await handle_update_user_data_done(event.data);
        //     }
        //     if (event.data.type === 'update_user_data_cancelled') {
        //         await handle_update_user_data_cancelled(event.data);
        //     }
        // });

        // singleton instance
        window.show_print_popup_editor_dialog = show_print_popup_editor_dialog;
    })

    async function handle_update_user_data_cancelled(data) {
        await handle_cancel_button_click();
    }
    async function handle_print_button_click(data) {

    }

    export async function show_print_popup_editor_dialog(context_data_new) {
        context_data = context_data_new;
        // component_instance_to_filter = filter_config.component_instance;
        pdf_url = null;
        await tick();

        pdf_url = context_data.url;
        header_display_name = context_data.header_display_name || 'Preview';
        shall_show_dialog = true;

        console.log('pdf_url', pdf_url)

        shall_show_loading_overlay = true;
        dialog_element.showModal();
        await tick();

        shall_show_loading_overlay = false;

        await tick();

        // await do_filter_based_on_form_data();

    }


    function handle_cancel_button_click() {
        dialog_element.close();
        shall_show_dialog = false;
    }


</script>

<dialog bind:this={dialog_element} class="crop_dialog"
        class:mobile={device_type === 'mobile'}
        class:pc={device_type === 'pc'}
        class:is_visible={shall_show_dialog}
        class:open={shall_show_dialog}>

    <div class="modal-outer">

        <div class="modal-header">
            <div>
                <h3>{header_display_name}</h3>
            </div>
            <div class="btn-toolbar float-end">
<!--                <button class="btn btn-primary" on:click={handle_print_button_click}>Print</button>-->
<!--                <button class="btn btn-secondary" on:click={handle_cancel_button_click}>Close</button>-->
                <span id="closeBtn" on:click={handle_cancel_button_click}>
                <i class="fa fa-close" aria-hidden="true" />
            </span>

            </div>

        </div>


        <section class="modal-body">

            {#if pdf_url}
                <div class="iframe_container">
                    <iframe
                            bind:this={website_preview_iframe}
                            src={pdf_url}></iframe>
                </div>
            {/if}


        </section>

        <!--        <div class="modal-footer buttons">-->
        <!--            {#if shall_show_confirm_button}-->
        <!--                <SimpleButton on:click={handle_confirm_button_click} isPlayButton="true" playButtonClass="green" text="Confirm" />-->
        <!--            {/if}-->
        <!--            <SimpleButton on:click={handle_cancel_button_click} isPlayButton="true" text="Cancel" />-->
        <!--        </div>-->

    </div>

    <LoadingOverlay shallShowLoadingOverlay="{shall_show_loading_overlay}" />


</dialog>



<style>


    dialog{
        display: none;
        position: fixed;
        border: none;
        /*inset: 0;*/
        /*width: 100vw;*/
        /*height: 100vh;*/
        background: transparent;
        outline: none;
        margin: 0 auto;
        margin-top: 50px;
        font-family: Inter, sans-serif;
    }

    dialog.mobile{
        padding: 0;
        margin:0;
        z-index: 99;
        bottom: 0;
        right: 0;
        background: white;
        width: 100vw;
        left: 0;
        border: 1px solid #c9c9c9;
        max-height: 20vh;
        overflow-y: auto;
        overflow-x: hidden;
    }

    dialog.pc{
        padding: 0;
        margin: 0;
        z-index: 99;
        /* top: 60px; */
        /* bottom: 20px; */
        /* min-width: calc(100vw - 60vh); */
        inset: 0;
        width: 100vw;
        height: 100vh;
    }

    dialog.is_visible{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-header{
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        padding: var(--zf-modal-header-padding);
        border-bottom: var(--zf-modal-header-border-width) solid var(--zf-modal-header-border-color);
        border-top-left-radius: var(--zf-modal-inner-border-radius);
        border-top-right-radius: var(--zf-modal-inner-border-radius);
    }

    .btn-toolbar {
        float: right;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }



    .iframe_container{
        width: 80vw;
        height: 80vh;
        overflow: hidden;
    }
    .iframe_container iframe{
        width: 100%;
        height: 100%;
        overflow: hidden;
        border: none;
    }

    .search_area .form_item_display_name{
        margin: 0;
    }





    .modal-outer{
        position: relative;
        background-color: white;
        border: 1px solid #666;
    }

    .modal-footer{
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
    }

    .modal-header{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        font-size: 1.5rem;
        /*background-color: #689f38;*/
        /*color: white;*/
        border-radius: 0;
    }

    span#closeBtn {
        position: absolute;
        right: 20px;
        top: 10px;
        font-size: 24px;
        color: #333;
        cursor: pointer;
        z-index: 2;
    }

    .modal-header h3{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 70vw;
        font-size: 1.5rem;
        margin-top: 10px;
        margin-left: 20px;
    }

    .modal-body{
        overflow: auto;
        /*height: calc(100% - 70px);*/
        margin-top: 50px;
    }


</style>