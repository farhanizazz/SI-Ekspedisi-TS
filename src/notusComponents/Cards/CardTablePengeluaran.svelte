<script lang="ts">
  import { currentPage } from "../../views/laporan/Invoice/stores/InvoiceStore.js";
  import { onDestroy } from "svelte";
  import { onMount } from "svelte/internal";
  import { link } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import { createEventDispatcher } from "svelte";
  import axios from "axios";
  import Modal from "../Modal/Modal.svelte";
  import Pagination from "/src/notusComponents/Pagination/Pagination.svelte";
  import type { Writable } from "svelte/store";
  import type { LaporanPengeluaranRepository } from "src/data/repository/laporanPengeluaranRepository.js";
  import Select from "svelte-select";
  import { mainUrl } from "../../environment.js";

  export let color = "light";
  export let heading = "Invoice Table";
  export let href;
  export let withEdit = true;
  export let addData = true;
  export let deleteApi;
  export let onLoad = () => {};
  export let repository: LaporanPengeluaranRepository;
  const today = new Date();
  let tglAwal = today.toISOString().substring(0, 10);
  let tglAkhir = today.toISOString().substring(0, 10);
  export let armadaData;
  let selectedArmada: Array<string> = [];

  let search = "";
  let timeout: number;
  let deleteModal: any[] = [];

  export let jenis;

  export let dataStore: Writable<{}>;
  let data: any;
  let pageCount: number;

  const unsubscribe = dataStore.subscribe((value) => {
    data = value.list;
    pageCount = value.meta.links.length;
    console.log(value);
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
      repository.updateTglAkhir(tglAkhir);
      repository.updateTglAwal(tglAwal);
      repository.updateSelectedArmadas(selectedArmada);
      repository.fetchServis();
    }, 1000);
  }

  const dispatch = createEventDispatcher();

  function handleDelete(index) {
    dispatch("delete", { index });
  }

  let IDRFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  console.log("repository: ", repository);
</script>

<div style="display: flex; justify-content: center; align-items: center;">
  <Pagination
    onLast={() => {
      repository.updatePage($currentPage);
      repository.fetchServis();
    }}
    onFirst={() => {
      repository.updatePage($currentPage);
      repository.fetchServis();
    }}
    {currentPage}
    {pageCount}
    onNext={() => {
      currentPage.set($currentPage + 1);
      repository.updatePage($currentPage);
      repository.fetchServis();
    }}
    onPrev={() => {
      currentPage.set($currentPage - 1);
      repository.updatePage($currentPage);
      repository.fetchServis();
    }}
    onSeek={(page) => {
      currentPage.set(page);
      repository.updatePage($currentPage);
      repository.fetchServis();
    }}
  />
</div>
<div class="flex justify-between items-center">
  <div class="flex flex-row items-center gap-3 my-2 w-1/2">
    <h1>Tanggal Awal:</h1>
    <input
      bind:value={tglAwal}
      type="date"
      class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
      placeholder="Tanggal Awal"
    />
    <h1>Tanggal Akhir:</h1>
    <input
      bind:value={tglAkhir}
      type="date"
      class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
      placeholder="Tanggal Akhir"
    />
    <h1>Armada:</h1>
    <Select
      showChevron={true}
      placeholder=""
      id="grid-penyewa"
      class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
      items={armadaData.map((armada) => ({
        value: armada.id,
        label: `${armada.nopol} | ${armada.jenis} | ${armada.merk}`,
      }))}
      bind:justValue={selectedArmada}
      label="label"
      searchable={true}
    />
  </div>
  <div>
    <button
      on:click={() => {
        if (data.length == 0) {
          alert("Data kosong, gagal mencetak laporan");
          return;
        }
        window.open(
          `${mainUrl}/export-pdf/transaksi/laporan/pengeluaran-${jenis}?tanggal_awal=${tglAwal}&tanggal_akhir=${tglAkhir}&m_armada_id=[${selectedArmada == null ? "" : selectedArmada}]`
        );
      }}
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    >
      <i class="fa-solid fa-print pr-2"></i>Cetak PDF
    </button>

    <button
      on:click={() => {
        if (data.length == 0) {
          alert("Data kosong, gagal mencetak laporan");
          return;
        }
        window.open(
          `${mainUrl}/export-word/transaksi/laporan/pengeluaran-${jenis}?tanggal_awal=${tglAwal}&tanggal_akhir=${tglAkhir}&m_armada_id=[${selectedArmada == null ? "" : selectedArmada}]`
        );
      }}
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    >
      <i class="fa-solid fa-print pr-2"></i>Cetak Word
    </button>
  </div>
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
        <div class="relative flex flex-wrap">
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
            Tgl
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Nopol
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Nama Barang
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Nama Toko
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Nomor Nota
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Harga
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Jumlah/satuan
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Sub total
          </th>
          <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
            'light'
              ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
              : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Keterangan
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
              bind:showModal={deleteModal[index]}
              isLoading={false}
              onAccept={() => {
                if (deleteApi !== undefined) {
                  fetch(deleteApi + `${tableData.id}`, {
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
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{tableData.tanggal}</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{tableData.nopol}</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{tableData.nama_barang}</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{tableData.nama_toko}</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{tableData.nomor_nota}</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{IDRFormatter.format(tableData.harga)}</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{tableData.jumlah}</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{IDRFormatter.format(tableData.subtotal)}</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >{tableData.keterangan == null
                  ? "Tidak ada keterangan"
                  : tableData.keterangan}</td
              >
            </tr>
          {/each}
        </tbody>
      {/if}
    </table>
  </div>
</div>
