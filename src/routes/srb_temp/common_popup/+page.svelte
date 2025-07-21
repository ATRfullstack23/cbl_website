<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    const popup_config = {
        title: 'Address',
        min_width: '400px',
        min_height: '300px',
        mode: 'dark'
    };

    let main_outer_dialog;

    onMount(() => {
        main_outer_dialog.style.setProperty('--popup_min_width', popup_config.min_width);
        main_outer_dialog.style.setProperty('--popup_min_height', popup_config.min_height);
    });

    function open_popup() {
        main_outer_dialog.showModal();
    }

    function close_popup() {
        main_outer_dialog.close();
    }
</script>

<button on:click={open_popup}>
    Open Popup
</button>

<dialog
        bind:this={main_outer_dialog}
        class="rounded-xl shadow-xl backdrop:bg-black/50"
        transition:fade={{ duration: 200 }}>
    <div class="p-6 flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">{popup_config.title}</h2>
            <button
                    on:click={close_popup}
                    class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Close popup">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <div>
            <p class="text-gray-600">card body</p>
        </div>
    </div>
</dialog>

<style>
    dialog {
        min-width: var(--popup_min_width);
        min-height: var(--popup_min_height);
        border: none;
        background-color: white;
        color: #1f2937;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        margin: auto;
    }

    dialog[open] {
        animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    dialog:where(.dark, .dark *) {
        background-color: #1f2937;
        color: #e5e7eb;
    }

    dialog:where(.dark, .dark *) p {
        color: #d1d5db;
    }
</style>