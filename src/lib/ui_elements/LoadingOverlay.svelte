
<script>
    import {onMount, afterUpdate, tick} from 'svelte';

    export let shallShowLoadingOverlay = false;
    export let isFixed = false;
    let containerElement;


    // $ : shallStartFadingOut = !shallShowLoadingOverlay;

    // let shallStartFadingOut = false;

    onMount(()=>{
        if(isFixed){
            document.body.appendChild(containerElement);
        }
    });

</script>

<div id="loader" bind:this={containerElement} class:fadeOut={!shallShowLoadingOverlay} class:fixed={isFixed}>
    <div class="spinner"></div>
</div>


<style>
    #loader {
        transition: all 0.3s ease-in-out;
        opacity: 1;
        visibility: visible;
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        background: rgba(3,3,3,.2);
        z-index: 90000;
    }
    #loader.fixed{
        position: fixed;
    }

    #loader.fadeOut {
        opacity: 0;
        visibility: hidden;
    }


    #loader .spinner {
        width: 40px;
        height: 40px;
        position: absolute;
        top: calc(50% - 20px);
        left: calc(50% - 20px);
        background-color: #333;
        border-radius: 100%;
        -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
        animation: sk-scaleout 1.0s infinite ease-in-out;
    }

    @-webkit-keyframes sk-scaleout {
        0% { -webkit-transform: scale(0) }
        100% {
            -webkit-transform: scale(1.0);
            opacity: 0;
        }
    }

    @keyframes sk-scaleout {
        0% {
            -webkit-transform: scale(0);
            transform: scale(0);
        } 100% {
              -webkit-transform: scale(1.0);
              transform: scale(1.0);
              opacity: 0;
          }
    }

</style>