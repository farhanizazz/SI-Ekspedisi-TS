<script lang="ts">
  import { IDRFormatter } from "./../../../helper/idrFormatter.js";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  // core components
  import { Router, Route } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../../environment";
  import CardInputRoles from "../../../notusComponents/Cards/CardInput/CardInputRoles.svelte";
  import CardEditRoles from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditRoles.svelte";
  import Modal from "../../../notusComponents/Modal/Modal.svelte";
  import Pagination from "../../../notusComponents/Pagination/Pagination.svelte";
  import { writable } from "svelte/store";
  import axios from "axios";
  import { onMount } from "svelte";
  import Select from "svelte-select";
  import { debounce } from '/src/helper/Debounce.js';
  import { search } from "./stores/LaporanOrderStore.js";

  let data = [];
  let color = "light";

  const headingTransaksiOrder = [
    "TGL",
    "No Transaksi",
    "Penyewa / Muatan",
    "Kendaraan / Sopir",
    "Asal / Tujuan",
    "Harga Order",
    "Biaya Tambah / Kurang",
    "PPH/PPN",
    "Setor",
    "Uang Jalan",
    "Biaya Tambahan / Kurang Uang Jalan",
    "Potongan Wajib",
    "Sisa Tagihan",
  ];

  const headingTransaksiOrderSubkon = [
    "TGL",
    "No Transaksi",
    "Penyewa / Muatan",
    "Pemilik / Nopol / Sopir",
    "Asal / Tujuan",
    "Harga Order",
    "Biaya Tambah / Kurang Harga Order",
    "PPH/PPN",
    "Sisa Piutang Tagihan",
    "Harga Jual",
    "Biaya Tambahan / Kurang Harga Jual",
    "Sisa Hutang ke Subkon",
    "Ket",
  ];

  const today = new Date();
  let tglAwal = today.toISOString().substring(0, 10);
  let tglAkhir = today.toISOString().substring(0, 10);
  let debounceTimeout;
  let page;
  const currentPage = writable(0);
  let selectedArmada = [];
  let catatanModal: boolean[] = [];
  let searchValue = "";

  let handleSearch = debounce(() => {
    currentPage.set(0);
    fetchData($currentPage, searchValue, openTab);
  }, 500);

  let openTab = "Sendiri";

  function toggleTabs(tabCategory) {
    currentPage.set(0);
    search.set(searchValue);
    fetchData($currentPage, searchValue, tabCategory);
    data = []
    openTab = tabCategory;
  }

  function fetchData(currentPage, search, tabCategory = "Sendiri") {
    fetch(
      // `${mainUrl}/api/laporan/pemasukan-cv?tanggal_awal=${tglAwal}&tanggal_akhir=${tglAkhir}&page=${currentPage + 1}&m_armada_id=[${armadaId == null ? "" : armadaId}]`,
      `${mainUrl}/api/transaksi/order?page=${currentPage + 1}&status_kendaraan=${openTab}&cari=${search}&status_kendaraan=${tabCategory}`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    ).then((res) => {
      res.json().then((res) => {
        page = res.data.meta.links.length;
        console.log(page);
        data = res.data.list;
        console.log(data);
        catatanModal = res.data.list.map(() => false);
      });
    });
  }

  function toggleCatatanModal(id) {
    catatanModal[id] = !catatanModal[id];
  }

  let armadaData = [];

  async function getArmada() {
    const response = await axios.get(`${mainUrl}/api/master/armada`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    return response.data.data;
  }

  onMount(() => {
    getArmada().then((res) => {
      armadaData = res;
    });
  });

  $: {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchData($currentPage, searchValue, openTab);
    }, 1000); // Adjust the delay as needed (500ms in this case)
  }
</script>

<div class="flex flex-wrap">
  <div class="w-full">
    <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
        <button
          class="text-sm font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full {openTab ===
          'Sendiri'
            ? 'text-white bg-red-600'
            : 'text-red-600 bg-white'}"
          on:click={() => toggleTabs("Sendiri")}
        >
          <i class="fas fa-cog text-base mr-1" /> Transaksi Order Sendiri
        </button>
      </li>
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
        <button
          class="text-sm font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full {openTab ===
          'Subkon'
            ? 'text-white bg-red-600'
            : 'text-red-600 bg-white'}"
          on:click={() => toggleTabs("Subkon")}
        >
          <i class="fas fa-briefcase text-base mr-1" /> Transaksi Order Subkon
        </button>
      </li>
    </ul>
  </div>
</div>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <div style="display: flex; justify-content: center; align-items: center;">
      <Pagination
        onLast={() => {
          fetchData($currentPage + 1, searchValue, openTab);
        }}
        onFirst={() => {
          fetchData($currentPage + 1, searchValue, openTab);
        }}
        {currentPage}
        pageCount={page}
        onNext={() => {
          currentPage.set($currentPage + 1);
        }}
        onPrev={() => {
          currentPage.set($currentPage - 1);
        }}
        onSeek={(page) => {
          currentPage.set(page);
        }}
      />
    </div>
    <Router route="roles">
      <Route path="">
        <!-- Start of table -->
        {#if openTab == "Sendiri"}
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
                  Data Transaksi Order Sendiri
                </h3>

                <div class="relative flex flex-wrap items-stretch">
                  <span
                    class="z-10 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1"
                  >
                    <i class="fas fa-search" />
                  </span>
                  <input
                    bind:value={searchValue}
                    on:input={handleSearch}
                    type="text"
                    placeholder="Cari"
                    class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="block w-full overflow-x-auto">
            <!-- Projects table -->
            <table
              class="items-center w-full bg-transparent border-collapse"
            >
              <thead>
                <tr>
                  {#each headingTransaksiOrder as data, index}
                    <th
                      class="{index == 0
                        ? 'pl-3'
                        : ''} align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 font-semibold text-left {color ===
                      'light'
                        ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                        : 'bg-red-700 text-red-200 border-red-600'}"
                    >
                      {data}
                    </th>
                  {/each}
                </tr>
              </thead>
              {#if data.length > 0}
                <tbody>
                  {#each data as tableData, index}
                    <tr>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2 whitespace-nowrap"
                      >
                        <div
                          class="flex justify-center items-center m-1 px-2 py-1 rounded-full bg-orange-200 text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                          style="
      background-color: 
        {tableData.status_kendaraan_sendiri == 'Berangkat' ? '#bbf7d0' : ''}
        {tableData.status_kendaraan_sendiri == 'Pulang' ? '#fecaca' : ''}
        {tableData.status_kendaraan_sendiri == 'Kontrak' ? '#fef08a' : ''}
        {tableData.status_kendaraan_sendiri == 'Kota-Kota' ? '#bfdbfe' : ''};
      color: 
        {tableData.status_kendaraan_sendiri == 'Berangkat' ? '#16a34a' : ''}
        {tableData.status_kendaraan_sendiri == 'Pulang' ? '#dc2626' : ''}
        {tableData.status_kendaraan_sendiri == 'Kontrak' ? '#d97706' : ''}
        {tableData.status_kendaraan_sendiri == 'Kota-Kota' ? '#2563eb' : ''};"
                        >
                          <div
                            class="flex-initial max-w-full leading-none text-sm font-semibold"
                          >
                            {tableData.status_kendaraan_sendiri}
                          </div>
                        </div>

                        <div class="text-center">
                          {tableData.tanggal_awal}
                          {#if tableData.status_kendaraan_sendiri == "Kontrak"}
                            <br />
                            -
                            <br />
                            {tableData.tanggal_akhir}
                          {/if}
                        </div>
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        <div class="container mx-autoflex flex-row mb-2">
                          <div class="container flex flex-row justify-between">
                            <div
                              class="flex justify-center items-center m-1 px-2 py-1 rounded-full text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              style="
            background-color: 
              {tableData.status_surat_jalan == 'Sopir' ? '#bbf7d0' : ''}
              {tableData.status_surat_jalan == 'Kantor' ? '#fef08a' : ''}
              {tableData.status_surat_jalan == 'Selesai' ? '#fecaca' : ''};
            color: 
              {tableData.status_surat_jalan == 'Sopir' ? '#16a34a' : ''}
              {tableData.status_surat_jalan == 'Kantor' ? '#d97706' : ''}
              {tableData.status_surat_jalan == 'Selesai' ? '#dc2626' : ''};"
                            >
                              <div
                                class="flex-initial max-w-full leading-none text-sm font-semibold"
                              >
                                {tableData.status_surat_jalan}
                              </div>
                            </div>
                            <button
                              type="submit"
                              on:click={() => toggleCatatanModal(index)}
                            >
                              <i class={"fa-note-sticky fa-regular"}></i>
                            </button>
                          </div>
                          <!-- bind:this={popoverDropdownRef} -->
                          <!-- {dropdownPopoverShow ? 'block' : 'hidden'} -->
                          <form
                            on:submit|preventDefault={() => {
                              tableData.statusLoadingCatatan = true;
                            }}
                          >
                            <Modal
                              onReject={() => {
                                catatanModal[index] = false;
                              }}
                              bind:showModal={catatanModal[index]}
                              bind:isLoading={tableData.statusLoadingCatatan}
                            >
                              <h1 slot="header" class="font-semibold text-lg">
                                Catatan Transaksi
                                <small>{tableData.no_transaksi}</small>
                              </h1>

                              <textarea
                                bind:value={tableData.catatan_surat_jalan}
                                readonly
                                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 h-52"
                              />
                            </Modal>
                          </form>
                        </div>
                        {tableData.no_transaksi} <br />
                        {tableData.nomor_sj == null
                          ? ""
                          : tableData.nomor_sj + " / "}
                        {tableData.nomor_po == null
                          ? ""
                          : tableData.nomor_po + " / "}
                        {tableData.nomor_do == null ? "" : tableData.nomor_do}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        {tableData.penyewa.nama_perusahaan} / {tableData.muatan}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        {tableData.armada.nopol} / {tableData.sopir.nama}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        {tableData.asal} / {tableData.tujuan}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2 whitespace-nowrap"
                      >
                        Rp. {IDRFormatter.format(tableData.harga_order)}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        {#if tableData.biaya_lain_harga_order_arr.length == 0}
                          <p class="pl-1">-</p>
                        {:else}
                          <!-- Biaya lain harga order sendiri -->
                          <div>
                            <div
                              class="whitespace-nowrap font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            >
                              Rp. {IDRFormatter.format(
                                tableData.biaya_lain_harga_order_arr.reduce(
                                  (acc, curr) => acc + curr.nominal,
                                  0
                                )
                              )}
                            </div>
                          </div>
                        {/if}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        Rp. {IDRFormatter.format(tableData.total_pajak)}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        Rp. {IDRFormatter.format(tableData.setor)}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2 whitespace-nowrap"
                      >
                        Rp. {IDRFormatter.format(tableData.uang_jalan)}
                        <div
                          class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                        >
                          Rp. {IDRFormatter.format(
                            tableData.total_mutasi_jalan
                          )}
                        </div>
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        {#if tableData.biaya_lain_uang_jalan_arr.length == 0}
                          <p class="pl-1">-</p>
                        {:else}
                          <div>
                            <div
                              class="whitespace-nowrap font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            >
                              Rp. {IDRFormatter.format(
                                tableData.biaya_lain_uang_jalan_arr.reduce(
                                  (acc, curr) => acc + curr.nominal,
                                  0
                                )
                              )}
                            </div>
                          </div>
                        {/if}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        Rp. {IDRFormatter.format(tableData.potongan_wajib)}
                      </td>
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        Rp. {IDRFormatter.format(
                          tableData.harga_order +
                            tableData.biaya_lain_harga_order_arr.reduce(
                              (acc, curr) => acc + curr.nominal,
                              0
                            ) -
                            tableData.total_mutasi_order -
                            tableData.total_pajak
                        )}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              {:else}
                <tbody>
                  <td colspan={headingTransaksiOrder.length + 1}>
                    <h1 class="text-center py-5 text-blueGray-300">
                      Data Kosong
                    </h1>
                  </td>
                </tbody>
              {/if}
            </table>
          </div>
        </div>
        {/if}

        {#if openTab == "Subkon"}
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
                    Data Transaksi Order Subkon
                  </h3>

                  <div class="relative flex flex-wrap items-stretch">
                    <span
                      class="z-10 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1"
                    >
                      <i class="fas fa-search" />
                    </span>
                    <input
                      bind:value={searchValue}
                      on:input={handleSearch}
                      type="text"
                      placeholder="Cari"
                      class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="block w-full overflow-x-auto">
              <!-- Projects table -->
              <table
                class="table-fixed items-center bg-transparent border-collapse"
              >
                <thead>
                  <tr>
                    {#each headingTransaksiOrderSubkon as data, index}
                      <th
                        class="{index == 0
                          ? 'pl-3'
                          : ''} align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 font-semibold text-left {color ===
                        'light'
                          ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                          : 'bg-red-700 text-red-200 border-red-600'}"
                      >
                        {data}
                      </th>
                    {/each}
                  </tr>
                </thead>
                {#if data.length > 0}
                  <tbody>
                    {#each data as tableData, index}
                      {#if tableData.status_kendaraan == "Subkon"}
                        <tr>
                          <td
                            class="pl-3 border-t-0 align-middle border-l-0 border-r-0 text-sm"
                          >
                            {tableData.tanggal_awal}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm"
                          >
                            <div
                              class="flex container mx-autoflex flex-row mb-2 justify-between"
                            >
                              <div
                                class="flex justify-center items-center m-1 px-2 py-1 rounded-full text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                                style="
                            background-color: 
                              {tableData.status_surat_jalan == 'Sopir'
                                  ? '#bbf7d0'
                                  : ''}
                              {tableData.status_surat_jalan == 'Kantor'
                                  ? '#fef08a'
                                  : ''}
                              {tableData.status_surat_jalan == 'Dikirim'
                                  ? '#fecaca'
                                  : ''};
                            color: 
                              {tableData.status_surat_jalan == 'Sopir'
                                  ? '#16a34a'
                                  : ''}
                              {tableData.status_surat_jalan == 'Kantor'
                                  ? '#d97706'
                                  : ''}
                              {tableData.status_surat_jalan == 'Dikirim'
                                  ? '#dc2626'
                                  : ''};"
                              >
                                <div
                                  class="flex-initial max-w-full leading-none text-sm font-semibold"
                                >
                                  {tableData.status_surat_jalan}
                                </div>
                              </div>
                              <button
                                type="submit"
                                on:click={() => toggleCatatanModal(index)}
                              >
                                <i class={"fa-note-sticky fa-regular"}></i>
                              </button>
                              <form on:submit|preventDefault={() => {}}>
                                <Modal
                                  onReject={() => {
                                    catatanModal[index] = false;
                                  }}
                                  bind:showModal={catatanModal[index]}
                                  bind:isLoading={tableData.statusLoadingCatatan}
                                >
                                  <h1
                                    slot="header"
                                    class="font-semibold text-lg {color ===
                                    'light'
                                      ? 'text-blueGray-700'
                                      : 'text-white'}"
                                  >
                                    Catatan Transaksi
                                    <small>{tableData.no_transaksi}</small>
                                  </h1>

                                  <textarea
                                    readonly
                                    bind:value={tableData.catatan_surat_jalan}
                                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 h-52"
                                  />
                                </Modal>
                              </form>
                              <!-- bind:this={popoverDropdownRef} -->
                              <!-- {dropdownPopoverShow ? 'block' : 'hidden'} -->
                            
                            </div>
                            {tableData.no_transaksi} <br />
                            {tableData.nomor_sj == null
                              ? ""
                              : tableData.nomor_sj + " / "}
                            {tableData.nomor_po == null
                              ? ""
                              : tableData.nomor_po + " / "}
                            {tableData.nomor_do == null
                              ? ""
                              : tableData.nomor_do}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm"
                          >
                            {tableData.penyewa.nama_perusahaan} / {tableData.muatan}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            {tableData.subkon.nama_perusahaan}/ {tableData.nopol_subkon}
                            / {tableData.sopir_subkon}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            {tableData.asal} / {tableData.tujuan}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(tableData.harga_order)}
                            <div
                              class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            >
                              Rp. {IDRFormatter.format(
                                tableData.total_mutasi_order
                              )}</div
                            >
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            {#if tableData.biaya_lain_harga_order_arr.length == 0}
                              <p class="pl-1">-</p>
                            {:else}
                              <div>
                                <div
                                  class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                                >
                                  Rp. {IDRFormatter.format(
                                    tableData.biaya_lain_harga_order_arr.reduce(
                                      (acc, curr) => acc + curr.nominal,
                                      0
                                    )
                                  )}</div
                                >
                              </div>
                            {/if}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(tableData.total_pajak)}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(
                              tableData.harga_order -
                                tableData.total_mutasi_order -
                                tableData.total_pajak +
                                tableData.biaya_lain_harga_order_arr.reduce(
                                  (acc, curr) => acc + curr.nominal,
                                  0
                                )
                            )}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(tableData.harga_jual)}
                            <!-- Mutasi Harga Jual -->
                            <div
                              href={`/transaksi/order/mutasi/${tableData.id}/jual`}
                              class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            >
                              <!-- Mutasi total -->
                              Rp. {IDRFormatter.format(
                                tableData.total_mutasi_jual
                              )}</div
                            >
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            {#if tableData.biaya_lain_harga_jual_arr.length == 0}
                              <p class="pl-1">-</p>
                            {:else}
                              <div>
                                <div
                                  class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                                >
                                  Rp. {IDRFormatter.format(
                                    tableData.biaya_lain_harga_jual_arr.reduce(
                                      (acc, curr) => acc + curr.nominal,
                                      0
                                    )
                                  )}</div
                                >
                              </div>
                            {/if}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(
                              tableData.harga_jual +
                                tableData.biaya_lain_harga_jual_arr.reduce(
                                  (acc, curr) => acc + curr.nominal,
                                  0
                                ) -
                                tableData.total_mutasi_jual
                            )}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Ket
                          </td>
                        </tr>
                      {/if}
                    {/each}
                  </tbody>
                {:else}
                  <tbody>
                    <td colspan={headingTransaksiOrderSubkon.length + 1}>
                      <h1 class="text-center py-5 text-blueGray-300">
                        Data Kosong
                      </h1>
                    </td>
                  </tbody>
                {/if}
              </table>
            </div>
          </div>
        {/if}

        <!-- End of table -->
      </Route>
      <Route path="add">
        <CardInputRoles />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditRoles id={params.edit} />
      </Route>
    </Router>
  </div>
</div>