<script lang="ts">
  import { currentPage } from "./stores/hutangSopirStore";
  import { onDestroy, onMount } from "svelte";
  import { link } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import { createEventDispatcher } from "svelte";
  import axios from "axios";
  import Modal from "../../../notusComponents/Modal/Modal.svelte";
  import Pagination from "/src/notusComponents/Pagination/Pagination.svelte";
  import type { Writable } from "svelte/store";
  import type { LaporanServisRepository } from "src/data/repository/laporanServisRepository.js";
  import type { LaporanHutangSopirId, LaporanHutangSopirRepository } from "src/data/repository/laporanHutangSopirRepository.js";

  export let color = "light";
  export let heading = "Invoice Table";
  export let href;
  export let withEdit = true;
  export let addData = true;
  export let deleteApi;
  export let onLoad = () => {};
  export let repository: LaporanHutangSopirRepository;

  let search = "";
  let timeout: number;
  let deleteModal: any[] = [];

  export let dataStore: Writable<{}>;
  let data: any;
  let pageCount: number;

  const unsubscribe = dataStore.subscribe((value) => {
    data = value.list;
    pageCount = value.meta.links.length;
    console.log("data: ", data);
  });

  onDestroy(() => {
    unsubscribe();
    clearTimeout(timeout);
  });

  onLoad();

  function toggleDeleteModal(index) {
    deleteModal[index] = !deleteModal[index];
  }

  $: deleteModal = Array(data.length).fill(false);

  $: {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Your function here
      repository.updateSearch(search);
    }, 500);
  }

  const dispatch = createEventDispatcher();

  function handleDelete(index) {
    dispatch("delete", { index });
  }

  let IDRFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  console.log("repository: ", repository)
</script>

<div style="display: flex; justify-content: center; align-items: center;">
  <Pagination
    onLast={() => {
      repository.updatePage($currentPage + 1);
    }}
    onFirst={() => {
      repository.updatePage($currentPage + 1);
    }}
    {currentPage}
    {pageCount}
    onNext={() => {
      currentPage.set($currentPage + 1);
      repository.updatePage($currentPage + 1);
    }}
    onPrev={() => {
      currentPage.set($currentPage - 1);
      repository.updatePage($currentPage + 1);
    }}
    onSeek={(page) => {
      currentPage.set(page);
      console.log("Page: ", $currentPage);
      repository.updatePage($currentPage + 1);
    }}
  />
</div>
<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color ===
  'light'
    ? 'bg-white'
    : 'bg-red-800 text-white'}"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div
        class="relative w-full px-4 max-w-full flex-grow flex flex-1 justify-between items-center"
      >
        <h3
          class="font-semibold text-lg {color === 'light'
            ? 'text-blueGray-700'
            : 'text-white'}"
        >
          {heading}
        </h3>
        <div class="relative flex flex-wrap items-stretch">
          <span
            class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1"
          >
            <i class="fas fa-search" />
          </span>
          <input
            bind:value={search}
            type="text"
            placeholder="Cari"
            class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"
          />
        </div>
        {#if addData === true}
          <a use:link href={`${href}/add`}>
            <p
              class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              Tambah Data
            </p>
          </a>
        {/if}
      </div>
    </div>
  </div>

  <div class="block w-full overflow-x-auto">
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Nama Sopir
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Nominal Hutang
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Action
          </th>
        </tr>
      </thead>
      {#if data.length > 0}
        <tbody>
          {#each data as tableData, index}
            <Modal
              onReject={() => {
                toggleDeleteModal(index);
              }}
              showModal={deleteModal[index]}
              isLoading={false}
              onAccept={() => {
                if (deleteApi !== undefined) {
                  fetch(deleteApi + `${tableData.master_sopir_id}`, {
                    method: "delete",
                    headers: {
                      Authorization: `bearer ${getCookie("token")}`,
                    },
                  }).then(() => {
                    repository.fetchServis();
                  });
                } else {
                  handleDelete(tableData.id);
                }
                toggleDeleteModal(index);
              }}
              saveText="Hapus"
            >
              <h1
                slot="header"
                class="font-semibold text-2xl {color === 'light'
                  ? 'text-blueGray-700'
                  : 'text-white'}"
              >
                Hapus Data
              </h1>
              <h3
                class="text-lg mt-5 {color === 'light'
                  ? 'text-blueGray-700'
                  : 'text-white'}"
              >
                Apakah anda yakin ingin menghapus data ini?
              </h3>
            </Modal>
            <tr>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-2 border"
              >
                {tableData.master_sopir.nama}
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-2 border"
              >
                {IDRFormatter.format(tableData.total_hutang)}
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 border font-semibold"
                >
                <div class="flex flex-col">
                  {#if withEdit === true}
                    <a use:link href={`${href}/edit/${tableData.id}`}>
                      <p
                        class="mr-1 text-center bg-emerald-500 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                      >
                        Edit
                      </p>
                    </a>
                  {/if}
                  <a use:link href={`${href}/${tableData.master_sopir_id}`}>
                    <p
                      class="mr-1 text-center bg-emerald-500 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                    >
                      Hutang
                    </p>
                  </a>
                  <button
                    on:click={() => {
                      toggleDeleteModal(index);
                    }}
                    class="w-full"
                  >
                    <p
                      class="text-center bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                    >
                      Delete
                    </p>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      {/if}
    </table>
  </div>
</div>
