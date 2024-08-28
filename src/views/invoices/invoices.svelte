<script lang="ts">
  import { Link } from "svelte-routing";
  import { debounce } from "../../helper/Debounce.js";
  import Pagination from "./../../notusComponents/Pagination/Pagination.svelte";

  import { mainUrl } from "/src/environment";
  import { onDestroy, onMount } from "svelte";
  import { getCookie } from "svelte-cookie";
  import { currentPage, isDataValid, transaksi } from "./stores/InvoiceStores";
  import { search } from "./stores/InvoiceStores";
  import Modal from "/src/notusComponents/Modal/Modal.svelte";
  import Select from "svelte-select";
  import axios from "axios";

  let selectedItems: any[] = [];
  let metaData = { links: [] };
  let data = [];
  let searchValue = "";
  let searchPerusahaanValue = "";
  let searchPPNValue = "";
  let searchStatusValue = "";
  let color = "light";
  let IDRFormatter = new Intl.NumberFormat("id-ID");
  let selectedPerusahaan = { id: "", nama_perusahaan: "" };
  let modalOpen = false;
  let singkatan = "";
  let selectedRekeningId = "0";
  let openTab = "Sendiri";

  $: if (searchPPNValue === null) {
    searchPPNValue = "";
  }

  const unsubscribe = transaksi.subscribe((value) => {
    data = value;
  });

  const headingTransaksiOrder = [
    "TGL",
    "No Transaksi",
    "Penyewa / Muatan",
    "Kendaraan / Sopir",
    "Asal / Tujuan",
    "Harga Order",
    "Biaya Tambah / Kurang",
    "PPH/PPN",
    "Sisa Tagihan",
    "Status Tagihan",
  ];

  let handleSearch = debounce(() => {
    isDataValid.set(false);
    currentPage.set(0);
    search.set(searchValue);
    getdata(
      `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
    );
  }, 500);

  function toggleTabs(tabCategory) {
    currentPage.set(0);
    getdata(
      `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${tabCategory}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
    );
    selectedItems = [];
    openTab = tabCategory;
  }

  async function fetchData(url = `${mainUrl}/api/transaksi/order`) {
    const res = await fetch(url, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });

    const json = (await res.json()).data;
    json.list.forEach((e) => {
      if (e.biaya_lain_harga_jual == null) e.biaya_lain_harga_jual = [];
      if (e.biaya_lain_uang_jalan == null) e.biaya_lain_uang_jalan = [];
      if (e.biaya_lain_harga_order == null) e.biaya_lain_harga_order = [];
    });
    json.list.sort(
      (a, b) =>
        new Date(b.tanggal_awal).getTime() / 1000 -
        new Date(a.tanggal_awal).getTime() / 1000
    );
    return json;
  }
  let rekeningData = [];
  async function fetchRekeningData() {
    let res = await axios(`${mainUrl}/api/master/rekening`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    rekeningData = res.data.data;
  }

  async function fetchCreateInvoice({
    id = [],
    master_rekening_id = "",
    penyewa_id = "",
    singkatan = "",
  }: {
    id: any[];
    master_rekening_id: string;
    penyewa_id: string;
    singkatan: string;
  }) {
    const res = await fetch(`${mainUrl}/api/transaksi/laporan/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({
        singkatan: singkatan,
        order_detail: id,
        m_penyewa_id: penyewa_id,
        master_rekening_id: master_rekening_id,
      }),
    });

    const json = await res.json();
    return json;
  }

  const getdata = async (
    url = `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
  ) => {
    // set cache lifetime in seconds
    // var cachelife = 5000;
    // let expired = true;
    //get cached data from local storage
    // var localStorageData = localStorage.getItem("order");
    // var cacheddata = await JSON.parse(localStorageData);
    // if (cacheddata) {
    //   expired = Date.now() / 1000 - cacheddata.cachetime > cachelife;
    // }
    //If cached data available and not expired return them.
    // if (cacheddata && !expired) {
    //     transaksi.set(cacheddata.data);
    //   } else {
    //     //otherwise fetch data from api then save the data in localstorage
    //   }
    fetchData(url).then((res) => {
      var json = { data: res.list, cachetime: Date.now() / 1000 };
      transaksi.set(res.list);
      metaData = res.meta;
    });
  };

  const currentPageUnsubscribe = currentPage.subscribe((value) => {
    if (value == 0) {
      currentPage.set(0);
    }
  });

  let searchUnsubscribe = search.subscribe((value) => {
    if (value == "") {
      isDataValid.set(false);
      getdata();
    }
  });

  onMount(() => {
    getdata();
    fetchRekeningData();
  });

  onDestroy(() => {
    unsubscribe();
    searchUnsubscribe();
    currentPageUnsubscribe();
  });
</script>

<main>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="flex flex-row items-center justify-between gap-3 my-2">
        <div class="flex flex-row items-center gap-3">
          <h1>Filter:</h1>
          <input
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
            placeholder="Cari Perusahaan"
            bind:value={searchPerusahaanValue}
            on:input={handleSearch}
          />
          <select
            class="border-0 px-3 py-3 w-44 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
            bind:value={searchPPNValue}
            on:change={handleSearch}
          >
            <option value="">Status PPH / PPN</option>
            <option value="ada">PPH / PPN</option>
            <option value="tidak_ada">Non PPH / PPN</option>
          </select>
          <select
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
            bind:value={searchStatusValue}
            on:change={handleSearch}
          >
            <option value="">Status</option>
            <option value="lunas">Lunas</option>
            <option value="belum_lunas">Belum Lunas</option>
          </select>
        </div>
        <Link to="/admin/invoice/lihat" class="text-sm font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal bg-red-500 text-white">
          Lihat Invoice
        </Link>
      </div>
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
              Transaksi Order Sendiri
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
                Transaksi Order Subkon
              </button>
            </li>
          </ul>
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

              <button
                on:click={() => {
                  if (selectedItems.length == 0) {
                    alert("Silahkan pilih transaksi terlebih dahulu");
                    return;
                  }
                  modalOpen = true;
                }}
              >
                <p
                  class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Cetak Invoice
                </p>
              </button>
              <Modal
                showModal={modalOpen}
                isLoading={false}
                onAccept={() => {
                  fetchCreateInvoice({
                    id: selectedItems,
                    penyewa_id: selectedPerusahaan.id,
                    singkatan: singkatan,
                    master_rekening_id: selectedRekeningId,
                  }).then((res) => {
                    if (res.data.status == true) {
                      modalOpen = false;
                      window.open(
                        `${mainUrl}/transaksi/laporan/invoice/${res.data.data.id}/export`
                      );
                      getdata();
                    } else {
                      alert("Gagal membuat invoice");
                    }
                  });
                }}
                onReject={() => {
                  modalOpen = false;
                }}
              >
                <h1
                  slot="header"
                  class="
                text-lg font-semibold text-blueGray-700 text-start
              "
                >
                  Cetak Invoice
                </h1>
                <label
                  class="block text-sm font-medium text-gray-700 mb-2 mt-2"
                >
                  Singkatan Perusahaan
                </label>
                <input
                  bind:value={singkatan}
                  type="text"
                  class="mb-3 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Masukkan singkatan perusahaan"
                />
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rekening
                </label>
                <Select
                  showChevron={true}
                  placeholder=""
                  id="grid-penyewa"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  items={rekeningData.map((rekening) => ({
                    value: rekening.id,
                    label: rekening.nama_bank + " - " + rekening.nomor_rekening,
                  }))}
                  bind:justValue={selectedRekeningId}
                  label="label"
                  searchable={true}
                />
              </Modal>
            </div>
          </div>
        </div>

        <div class="block w-full overflow-x-auto">
          <!-- Projects table -->
          <table class="items-center w-full bg-transparent border-collapse">
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
                <th
                  class="align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 font-semibold text-left {color ===
                  'light'
                    ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                    : 'bg-red-700 text-red-200 border-red-600'}"
                >
                  Cetak Invoice
                </th>
              </tr>
            </thead>
            {#if data.length > 0}
              <tbody>
                {#each data as tableData, index}
                  <tr>
                    <td
                      class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2 whitespace-nowrap"
                    >
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
                    <td>
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
                    {#if tableData.status_kendaraan == "Sendiri"}
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        {tableData.armada.nopol} / {tableData.sopir.nama}
                      </td>
                    {:else}
                      <td
                        class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        {tableData.nopol_subkon} / {tableData.sopir_subkon}
                      </td>
                    {/if}
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
                        Rp. {IDRFormatter.format(
                          tableData.biaya_lain_harga_order_arr.reduce(
                            (acc, curr) => acc + curr.nominal,
                            0
                          )
                        )}
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
                        tableData.harga_order +
                          tableData.biaya_lain_harga_order_arr.reduce(
                            (acc, curr) => acc + curr.nominal,
                            0
                          ) -
                          tableData.total_mutasi_order -
                          tableData.total_pajak
                      )}
                    </td>
                    <td
                      class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                    >
                      {tableData.harga_order +
                        tableData.biaya_lain_harga_order_arr.reduce(
                          (acc, curr) => acc + curr.nominal,
                          0
                        ) -
                        tableData.total_mutasi_order -
                        tableData.total_pajak ==
                      0
                        ? "Lunas"
                        : "Belum Lunas"}
                    </td>
                    <td
                      class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                    >
                      <input
                        type="checkbox"
                        class="shadow form-checkbox border-2 border-gray-300 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        checked={selectedItems.includes(tableData.id)}
                        on:change={() => {
                          if (selectedItems.includes(tableData.id)) {
                            selectedItems = selectedItems.filter(
                              (item) => item !== tableData.id
                            );
                            if (selectedItems.length == 0) {
                              getdata(
                                `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
                              );
                              selectedPerusahaan = {
                                id: "",
                                nama_perusahaan: "",
                              };
                            }
                          } else {
                            selectedItems = [...selectedItems, tableData.id];

                            if (
                              selectedPerusahaan.nama_perusahaan !=
                              tableData.penyewa.nama_perusahaan
                            ) {
                              selectedPerusahaan = tableData.penyewa;
                              transaksi.set([]);
                            }
                            getdata(
                              `${mainUrl}/api/transaksi/order?cari=${selectedPerusahaan.nama_perusahaan}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
                            );
                          }
                          console.log(selectedItems);
                        }}
                      />
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
      <div class="w-full px-4 max-w-full flex justify-center items-center">
        <Pagination
          onFirst={() => {
            isDataValid.set(false);
            getdata(
              `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
            );
          }}
          onLast={() => {
            isDataValid.set(false);
            getdata(
              `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
            );
          }}
          {currentPage}
          onSeek={(page) => {
            currentPage.set(page);
            isDataValid.set(false);

            getdata(
              `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
            );
          }}
          pageCount={metaData.links.length}
          onNext={() => {
            if ($currentPage + 1 <= metaData.links.length - 1) {
              currentPage.set($currentPage + 1);
              isDataValid.set(false);

              getdata(
                `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
              );
            }
          }}
          onPrev={() => {
            if ($currentPage - 1 >= 0) {
              currentPage.set($currentPage - 1);
              isDataValid.set(false);

              getdata(
                `${mainUrl}/api/transaksi/order?cari=${$search}&page=${$currentPage + 1}&status_kendaraan=${openTab}&nama_penyewa=${searchPerusahaanValue}&ppn=${searchPPNValue}&status_lunas=${searchStatusValue}`
              );
            }
          }}
        />
      </div>
    </div>
  </div>
</main>

<style>
  /* Add your styles here */
</style>
