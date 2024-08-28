<script lang="ts">
  import { Link } from "svelte-routing";
  import { debounce } from "../../helper/Debounce.js";
  import Pagination from "../../notusComponents/Pagination/Pagination.svelte";

  import { mainUrl } from "/src/environment";
  import { onDestroy, onMount } from "svelte";
  import { getCookie } from "svelte-cookie";
  import {
    currentPage,
    isDataValid,
    invoices,
  } from "./stores/InvoiceStores.js";
  import { search } from "./stores/InvoiceStores.js";
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
  let modalOpen: boolean[] = [];
  let singkatan = "";
  let selectedRekeningId = "0";
  let openTab = "Sendiri";

  $: modalOpen = data.map(() => false);

  $: if (searchPPNValue === null) {
    searchPPNValue = "";
  }

  const unsubscribe = invoices.subscribe((value) => {
    data = value;
  });

  const headingTransaksiOrder = [
    "Nomor Tagihan",
    "Penyewa",
    "Nama Bank",
    "Nomor Rekening",
  ];

  let handleSearch = debounce(() => {
    isDataValid.set(false);
    currentPage.set(0);
    search.set(searchValue);
    getdata(
      `${mainUrl}/api/transaksi/laporan/invoice?sort=created_at%20DESC&page=${$currentPage + 1}`
    );
  }, 500);

  async function fetchData(url = `${mainUrl}/api/transaksi/laporan/invoice`) {
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
    url = `${mainUrl}/api/transaksi/laporan/invoice?sort=created_at%20DESC&page=${$currentPage + 1}`
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
      invoices.set(res.list);
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
      <div class="flex flex-row items-center justify-end gap-3 my-2">
        <Link
          to="/admin/invoice/buat"
          class="text-sm font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal bg-red-500 text-white"
        >
          Buat Invoice
        </Link>
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
                      ? 'pl-10'
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
                  Action
                </th>
              </tr>
            </thead>
            {#if data.length > 0}
              <tbody>
                {#each data as tableData, index}
                  <Modal
                    showModal={modalOpen[index]}
                    saveText="Hapus"
                    isLoading={false}
                    onAccept={() => {
                      fetch(
                        `${mainUrl}/api/transaksi/laporan/invoice/${tableData.id}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `bearer ${getCookie("token")}`,
                          },
                        }
                      ).then((res) => {
                        if (res.status == 200) {
                          getdata();
                        }
                      });
                    }}
                    onReject={() => {
                      modalOpen[index] = false;
                    }}
                  >
                    <div slot="header" class="text-xl font-medium">Hapus Invoice?</div>
                  </Modal>
                  <tr>
                    <td
                      class="pl-10 border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2 whitespace-nowrap"
                    >
                      {tableData.no_tagihan}
                    </td>
                    <td
                      class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                    >
                      {tableData.m_penyewa.nama_perusahaan}
                    </td>
                    <td
                      class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                    >
                      {tableData.master_rekening.nama_bank}
                    </td>
                    <td
                      class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2 whitespace-nowrap"
                    >
                      {tableData.master_rekening.nomor_rekening}
                    </td>
                    <td
                      class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2 flex-col flex"
                    >
                      <button
                        class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1"
                        type="button"
                        style="transition: all .15s ease"
                        on:click={() => {
                          window.open(
                            `${mainUrl}/transaksi/laporan/invoice/${tableData.id}/export`
                          );
                        }}
                      >
                        Cetak Invoice
                      </button>
                      <button
                        class="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1"
                        type="button"
                        style="transition: all .15s ease"
                        on:click={() => {
                          modalOpen[index] = true;
                        }}
                      >
                        Hapus Invoice
                      </button>
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
              `${mainUrl}/api/transaksi/laporan/invoice?cari=${$search}&page=${$currentPage + 1}`
            );
          }}
          onLast={() => {
            isDataValid.set(false);
            getdata(
              `${mainUrl}/api/transaksi/laporan/invoice?cari=${$search}&page=${$currentPage + 1}`
            );
          }}
          {currentPage}
          onSeek={(page) => {
            currentPage.set(page);
            isDataValid.set(false);

            getdata(
              `${mainUrl}/api/transaksi/laporan/invoice?cari=${$search}&page=${$currentPage + 1}`
            );
          }}
          pageCount={metaData.links.length}
          onNext={() => {
            if ($currentPage + 1 <= metaData.links.length - 1) {
              currentPage.set($currentPage + 1);
              isDataValid.set(false);

              getdata(
                `${mainUrl}/api/transaksi/laporan/invoice?cari=${$search}&page=${$currentPage + 1}`
              );
            }
          }}
          onPrev={() => {
            if ($currentPage - 1 >= 0) {
              currentPage.set($currentPage - 1);
              isDataValid.set(false);

              getdata(
                `${mainUrl}/api/transaksi/laporan/invoice?cari=${$search}&page=${$currentPage + 1}`
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
