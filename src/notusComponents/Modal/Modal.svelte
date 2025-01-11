<script lang="ts">
  export let showModal: boolean;
  export let isLoading: boolean = false;
  export let saveText: string = "Save Changes";
  export let onAccept: () => void = () => {};
  export let onReject: () => void = () => {};

  let dialog: HTMLDialogElement;

  // Reactive statement to control dialog visibility
  $: {
    if (dialog) {
      showModal ? dialog.showModal() : dialog.close();
    }
  }

  // Close handler for dialog events
  const handleClose = () => {
    if (showModal) {
      onReject();
    }
  };

  // Prevent dialog closure on clicks inside the modal content
  const stopPropagation = (e: MouseEvent) => e.stopPropagation();
</script>

<dialog
  bind:this={dialog}
  on:close={handleClose}
  on:click|self={() => (showModal = false)}
>
  <div class="modal-content" on:click={stopPropagation}>
    <slot name="header" />

    <slot />

    <div class="actions">
      <button
        class="btn btn-close"
        type="button"
        on:click={() => {
          showModal = false;
          onReject();
        }}
      >
        Tutup
      </button>
      {#if saveText == ""}
        <button
          class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          on:click={onAccept}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : saveText}
        </button>
      {/if}
    </div>
  </div>
</dialog>

<style>
  dialog {
    max-width: 32em;
    border-radius: 0.2em;
    border: none;
    padding: 0;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  .modal-content {
    padding: 1em;
    background: white;
    border-radius: 0.2em;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1em;
    padding-top: 1em;
  }

  .btn {
    padding: 0.5em 1em;
    border: none;
    border-radius: 0.2em;
    cursor: pointer;
  }

  .btn-close {
    background-color: transparent;
    color: red;
    font-weight: bold;
  }

  .btn-save {
    background-color: red;
    color: white;
    font-weight: bold;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
