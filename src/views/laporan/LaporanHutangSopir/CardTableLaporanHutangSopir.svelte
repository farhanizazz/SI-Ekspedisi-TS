<script lang="ts">
  import { currentPage } from "./stores/laporanHutangSopirStore";
  import { onDestroy, onMount } from "svelte";
  import { link } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import { createEventDispatcher } from "svelte";
  import axios from "axios";
  import Modal from "../../../notusComponents/Modal/Modal.svelte";
  import Pagination from "/src/notusComponents/Pagination/Pagination.svelte";
  import type { Writable } from "svelte/store";
  import type { LaporanServisRepository } from "src/data/repository/laporanServisRepository.js";
  import type {
    LaporanHutangSopir2Repository,
  } from "src/data/repository/laporanHutangSopir2Repository.js";
  import { formatToIndonesianDate } from "../../../helper/dateFormatterIndo.js";
  import Select from "svelte-select";

  export let color = "light";
  export let heading = "Invoice Table";
  export let href;
  export let withEdit = true;
  export let addData = true;
  export let deleteApi;
  export let onLoad = () => {};
  export let repository: LaporanHutangSopir2Repository;

  let search = "";
  let timeout: number;
  let deleteModal: any[] = [];

  export let dataStore: Writable<{}>;
  let data: any;
  let pageCount: number;
  const today = new Date();
  let tglAwal = '';
  let tglAkhir = today.toISOString().substring(0, 10);
  let selectedSopir = [];
  export let sopirData = [];

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
      repository.updatePage($currentPage + 1)
      repository.updateSopirId(selectedSopir == null ? '1' : selectedSopir)
      repository.updateTanggalAwal(tglAwal == '' ? '2000-02-01' : tglAwal)
      repository.updateTanggalAkhir(tglAkhir)
      repository.fetchServis()
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
  console.log("repository: ", repository);
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
<div class="relative flex flex-col min-w-0 break-words w-full mb-6 rounded">
  <div
    class="rounded mb-0 px-4 py-3 border-0 mb-3 shadow-lg {color === 'light'
      ? 'bg-white'
      : 'bg-red-800 text-white'}"
  >
    <div class="flex flex-wrap items-center">
      <div
        class="relative w-full px-4 max-w-full flex-grow flex flex-1 justify-between items-center"
      >
        <h3
          class="font-semibold text-lg {color === 'light'
            ? 'text-blueGray-700'
            : 'text-white'}"
        >
          Laporan Hutang Sopir
        </h3>
      </div>
    </div>
  </div>

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
        multiple
        showChevron={true}
        placeholder=""
        id="grid-penyewa"
        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
        items={sopirData.map((sopir) => ({
          value: sopir.id,
          label: `${sopir.nama} | ${sopir.ktp} | ${sopir.status}`,
        }))}
        bind:justValue={selectedSopir}
        label="label"
        searchable={true}
      />
    </div>

  <div class="grid grid-cols-2 gap-4">
    {#each data as tableData}
      <div
        class=" {color === 'light'
          ? 'bg-white'
          : 'bg-red-800 text-white'} pt-3 pb-3 shadow-lg rounded"
      >
        <table class="items-center w-full bg-transparent border-collapse">
          <tbody>
            <tr
              ><td
                colspan="2"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                >Tanggal: {formatToIndonesianDate(tableData.tanggal)}</td
              >
              <td
                colspan="2"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                >Uang Jalan: {IDRFormatter.format(tableData.uang_jalan)}</td
              >
            </tr>
            <tr
              ><td
                colspan="2"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                >No Transaksi: {tableData.no_transaksi}</td
              >
              <td
                colspan="2"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                >Biaya Tambah / Kurang: {IDRFormatter.format(
                  tableData.biaya_tambahan
                )} / {IDRFormatter.format(tableData.biaya_kurang)}</td
              >
            </tr>
            <tr
              ><td
                colspan="2"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                >Penyewa/muat : {tableData.penyewa} / {tableData.muatan}</td
              ><td
                colspan="2"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                >Potongan THR: {IDRFormatter.format(tableData.pot_thr)}</td
              >
            </tr>
            <tr
              ><td
                colspan="4"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap border"
                >Asal / Tujuan: {tableData.asal} / {tableData.tujuan}</td
              >
            </tr>
            <tr
              ><td
                colspan="2"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap border"
                >Total Uang Jalan</td
              ><td
                colspan="2"
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap border"
                >{IDRFormatter.format(tableData.total_uang_jalan)}</td
              >
            </tr><tr
              ><td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap border"
                colspan="4">Rincian</td
              >
            </tr>
            <tr
              ><td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap border"
                >Tgl Bayar</td
              ><td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap border"
                >Keterangan</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap border"
                >Nominal</td
              >
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap border"
                >Sisa Uang Jalan</td
              >
            </tr>
            {#each tableData.rincian as rincian, index}
              <tr
                ><td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                  >{formatToIndonesianDate(rincian.tanggal)}</td
                ><td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                  >{rincian.keterangan}</td
                >
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                  >{rincian.nominal}</td
                >
                {#if index == 0}
                <td
                  rowspan={tableData.rincian.length}
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"
                >
                  {tableData.sisa_uang_jalan}
                </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/each}
  </div>
</div>
