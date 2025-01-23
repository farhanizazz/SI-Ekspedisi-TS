<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let onPrev: () => void;
  export let onNext: () => void;
  export let onLast: () => void;
  export let onFirst: () => void;
  export let pageCount;
  export let onSeek: (page: number) => void;
  export let currentPage: Writable<number>;
  const unsubscribe = currentPage.subscribe((value) => {
    console.log(value);
  });

  onDestroy(() => {
    unsubscribe();
  });

</script>

<div class="py-2">
  <nav class="block">
    <ul class="flex pl-0 rounded list-none flex-wrap">
      {#if $currentPage > 0}
      <li>
        <button
          on:click={() => {
            currentPage.set(0);
            onFirst();
          }}
          class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"
        >
        <i class="fas fa-chevron-left -mr-px"></i>
        <i class="fas fa-chevron-left -mr-px"></i>
      </button>
      </li>
      <li>
        <button
          on:click={() => {
            onPrev();
            if($currentPage > 0) currentPage.set($currentPage);
          }}
          class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"
        >
          <i class="fas fa-chevron-left -ml-px"></i>
        </button>
      </li>
      {/if}
      {#each [2, 1] as i}
        {#if $currentPage - i >= 0}
        <li>
          <button
            on:click={() => {
              onSeek($currentPage - i);
              currentPage.set($currentPage);
            }}
            class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"
          >
            <span>{$currentPage - i + 1}</span>
          </button>
        </li>
        {/if}
      {/each}
      <li>
        <button
          class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-orange-500 text-white"
        >
          <span>{$currentPage + 1}</span>
        </button>
      </li>
      {#each [1, 2] as i}
        {#if $currentPage + i < pageCount}
          <li>
            <button
              on:click={() => {
                onSeek($currentPage + i);
                currentPage.set($currentPage);
              }}
              class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"
            >
              <span>{$currentPage + i + 1}</span>
            </button>
          </li>
        {/if}
      {/each}
      {#if $currentPage < pageCount - 1}
      <li>
        <button
          on:click={() => {
            onNext();
            if($currentPage < pageCount - 1) currentPage.set($currentPage);
          }}
          class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"
        >
        <i class="fas fa-chevron-right -mr-px"></i>
      </button>
      </li>
        <li>
          <button
            on:click={() => {
              currentPage.set(pageCount - 1);
              onLast();
            }}
            class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"
          >
            <i class="fas fa-chevron-right -mr-px"></i>
            <i class="fas fa-chevron-right -mr-px"></i>
          </button>
        </li>
      {/if}
      
    </ul>
  </nav>
</div>
