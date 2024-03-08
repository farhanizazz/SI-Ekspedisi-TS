<script>
	import { debounce } from './../../../helper/Debounce.js';
  import Pagination from "./../../../notusComponents/Pagination/Pagination.svelte";
  import CardInputDetailTransaksi from "./../../../notusComponents/Cards/CardInput/CardInputDetailTransaksi.svelte";
  import DetailTransaksi from "./DetailTransaksi.svelte";
  import DetailBiayaTambahan from "./DetailBiayaTambahan.svelte";
  // core components
  import CardEditLaporanTransaksiOrder from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditLaporanTransaksiOrder.svelte";
  import { Router, Route } from "svelte-routing";
  import { mainUrl } from "../../../environment";
  import { getCookie } from "svelte-cookie";
  import CardInputLaporanTransaksiOrder from "../../../notusComponents/Cards/CardInput/CardInputLaporanTransaksiOrder.svelte";
  import { link } from "svelte-routing";
  import { onMount } from "svelte";
  import { createPopper } from "@popperjs/core";
  import Chips from "../../../notusComponents/Chips/Chips.svelte";
  import axios from "axios";
  import { get } from "svelte/store";
  // import "../../app.css";

  let data = [];
  let metaData = { links: [] };
  let dataTambahan = [];
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
    "Kendaraan / Sopir",
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

  let listTotal = [];

  async function fetchData(url = `${mainUrl}/api/transaksi/order`) {
    const res = await fetch(url, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });

    const json = (await res.json()).data;
    json.list.forEach((e) => {
      e.biaya_lain_harga_jual = [];
      e.biaya_lain_uang_jalan = [];
      e.biaya_lain_harga_order = [];
    });
    json.list.sort(
      (a, b) =>
        new Date(b.tanggal_awal).getTime() / 1000 -
        new Date(a.tanggal_awal).getTime() / 1000
    );
    return json;
  }

  let isDataValid = false;

  const getdata = async (url) => {
    // set cache lifetime in seconds
    var cachelife = 5000;
    //get cached data from local storage
    var localStorageData = localStorage.getItem("order");
    var cacheddata = await JSON.parse(localStorageData);
    if (cacheddata) {
      var expired = Date.now() / 1000 - cacheddata.cachetime > cachelife;
    }
    //If cached data available and not expired return them.
    if (cacheddata && !expired && isDataValid) {
      data = cacheddata.data;
    } else {
      //otherwise fetch data from api then save the data in localstorage
      fetchData(url).then((res) => {
        var json = { data: res.list, cachetime: Date.now() / 1000 };
        localStorage.setItem("order", JSON.stringify(json));
        data = res.list;
        metaData = res.meta;
      });
    }
  };

  $: data = data;

  async function fetchRekeningData() {
    let res = await axios.get(`${mainUrl}/api/master/tambahan`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    dataTambahan = res.data.data;
  }

  async function fetchMutasi(id) {
    let res = await axios.get(
      `${mainUrl}/api/master/rekening/mutasi?transaksi_order_id=${id}`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    );
    return res.data.data;
  }

  let search = "";
  let color = "light";
  // let data = [];

  // $: data = search
  //   ? data.filter((item) =>
  //       Object.keys(item).some(
  //         (key) =>
  //           String(item[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
  //       )
  //     )
  //   : data;

  const changeStatusKendaraanSendiri = ({ data, id }) => {
    try {
      axios
        .put(`${mainUrl}/api/transaksi/order/${id}`, data, {
          headers: {
            Authorization: `bearer ${getCookie("token")}`,
          },
        })
        .then((res) => {
          isDataValid = false;
          getdata();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatusSuratJalan = ({ data, id }) => {
    try {
      axios
        .put(`${mainUrl}/api/transaksi/order/${id}`, data, {
          headers: {
            Authorization: `bearer ${getCookie("token")}`,
          },
        })
        .then((res) => {
          fetchData().then(() => {
            isDataValid = false;
            getdata();
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const addBiaya = ({ data, id }) => {
    try {
      axios
        .put(`${mainUrl}/api/transaksi/order/${id}`, data, {
          headers: {
            Authorization: `bearer ${getCookie("token")}`,
          },
        })
        .then((res) => {
          sifat = 0;
          jenis = 0;
          biaya = null;
          isDataValid = false;
          getdata();
        });
    } catch (error) {
      console.log(error);
    }
  };

  let tableSendiri;
  let tableSubkon;
  onMount(() => {
    getdata();
    fetchRekeningData();
    const updatePosition = () => {
      if (popoverDropdownRefStatusHargaOrder) {
        popoverDropdownRefStatusHargaOrder.style.left = `${window.scrollX}px`;
      }
    };
  });

  let showHargaOrderModal = [];
  let showUangJalanModal = [];

  $: {
    showHargaOrderModal = data.map(() => false);
    showUangJalanModal = data.map(() => false);
  }

  function toggleHargaOrderModal(id) {
    showHargaOrderModal[id] = !showHargaOrderModal[id];
  }

  function toggleUangJalanModal(id) {
    showUangJalanModal[id] = !showUangJalanModal[id];
  }

  let dropdownPopoverShowStatusKendaraanSendiri = [];
  $: dropdownPopoverShowStatusKendaraanSendiri = data.map(() => false);
  let btnDropdownRefStatusKendaraanSendiri;
  let popoverDropdownRefStatusKendaraanSendiri;

  let dropdownPopoverShowStatusSuratJalan = [];
  $: dropdownPopoverShowStatusSuratJalan = data.map(() => false);
  let btnDropdownRefStatusSuratJalan;
  let popoverDropdownRefStatusSuratJalan;

  let dropdownPopoverShowStatusHargaOrder = [];
  $: dropdownPopoverShowStatusHargaOrder = data.map(() => false);
  let btnDropdownRefStatusHargaOrder;
  let popoverDropdownRefStatusHargaOrder;

  const toggleDropdownStatusKendaraanSendiri = (index) => {
    if (dropdownPopoverShowStatusKendaraanSendiri[index]) {
      dropdownPopoverShowStatusKendaraanSendiri[index] = false;
    } else {
      dropdownPopoverShowStatusKendaraanSendiri[index] = true;
      createPopper(
        btnDropdownRefStatusKendaraanSendiri,
        popoverDropdownRefStatusKendaraanSendiri,
        {
          placement: "bottom",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 3],
              },
            },
          ],
        }
      );
    }
  };

  const toggleDropdownStatusSuratJalan = (index) => {
    if (dropdownPopoverShowStatusSuratJalan[index]) {
      dropdownPopoverShowStatusSuratJalan[index] = false;
    } else {
      dropdownPopoverShowStatusSuratJalan[index] = true;
      createPopper(
        btnDropdownRefStatusSuratJalan[index],
        popoverDropdownRefStatusSuratJalan[index],
        {
          placement: "bottom",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 3],
              },
            },
          ],
        }
      );
    }
  };

  const toggleDropdownStatusHargaOrder = (index) => {
    if (dropdownPopoverShowStatusHargaOrder[index]) {
      dropdownPopoverShowStatusHargaOrder[index] = false;
    } else {
      dropdownPopoverShowStatusHargaOrder[index] = true;
      createPopper(
        btnDropdownRefStatusHargaOrder,
        popoverDropdownRefStatusHargaOrder,
        {
          placement: "bottom",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 3],
              },
            },
          ],
        }
      );
    }
  };

  let handleSearch = debounce(() => {
    isDataValid = false;
    currentPage = 0;
    getdata(`${mainUrl}/api/transaksi/order?cari=${search}&page=${currentPage + 1}`);
  }, 500);

  let sifat = 0;
  let jenis = 0;
  let biaya;
  let errorModalMsg;
  let totalSum = 0;
  let detailBiayaOrderData = [];
  let detailBiayaUangJalanData = [];
  let detailBiayahargaJualData = [];
  let IDRFormatter = new Intl.NumberFormat("id-ID");

  let openTab = 1;

  function toggleTabs(tabNumber) {
    openTab = tabNumber;
  }

  let currentPage = 0;
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="order">
      <Route path="">
        <!-- <CardTable
          tableHeading={headingTransaksiOrder}
          href="/transaksi/order"
          deleteApi={`${mainUrl}/api/transaksi/order/`}
          heading="Data Transaksi Order"
          {data}
          onLoad={fetchData}
        /> -->

        <div class="flex flex-wrap">
          <div class="w-full">
            <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
              <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  href="#"
                  class="text-sm font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {openTab ===
                  1
                    ? 'text-white bg-red-600'
                    : 'text-red-600 bg-white'}"
                  on:click={() => toggleTabs(1)}
                >
                  <i class="fas fa-cog text-base mr-1" /> Transaksi Order Sendiri
                </a>
              </li>
              <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  href="#"
                  class="text-sm font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {openTab ===
                  2
                    ? 'text-white bg-red-600'
                    : 'text-red-600 bg-white'}"
                  on:click={() => toggleTabs(2)}
                >
                  <i class="fas fa-briefcase text-base mr-1" /> Transaksi Order Subkon
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="w-full px-4 max-w-full flex justify-center items-center">
          <Pagination
            pageCount={metaData.links.length}
            onNext={() => {
              if (currentPage + 1 <= metaData.links.length - 1) {
                currentPage = currentPage + 1;
                console.log("next",currentPage, metaData.links[currentPage]);
                isDataValid = false;
                getdata(`${mainUrl}/api/transaksi/order?cari=${search}&page=${currentPage + 1}`);
              }
            }}
            onPrev={() => {
              if (currentPage - 1 >= 0) {
                currentPage = currentPage - 1;
                console.log("prev", currentPage, metaData.links[currentPage]);
                isDataValid = false;
                getdata(`${mainUrl}/api/transaksi/order?cari=${search}&page=${currentPage + 1}`);
              }
            }}
          />
        </div>
        {#if openTab == 1}
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
                      bind:value={search}
                      on:input={handleSearch}
                      type="text"
                      placeholder="Cari"
                      class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"
                    />
                  </div>

                  <a use:link href={`/transaksi/order/add`}>
                    <p
                      class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    >
                      Tambah Data
                    </p>
                  </a>
                </div>
              </div>
            </div>

            <div class="block w-full overflow-x-auto">
              <!-- Projects table -->
              <table
                bind:this={tableSendiri}
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
                    <!-- {#each data as tableData}
                    <tr>
                      {#each Object.keys(data[0]) as header}
                        {#if tableData[header] == "aktif"}
                          <td
                            class="border-t-0  align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <p
                              class="text-center bg-emerald-500 text-white text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                            >
                              {tableData[header]}
                            </p>
                          </td>
                        {:else if tableData[header] == "nonaktif"}
                          <td
                            class="border-t-0  align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <p
                              class="text-center bg-red-500 text-white text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                            >
                              {tableData[header]}
                            </p>
                          </td>
                        {:else}
                          <td
                            class="border-t-0  align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            {tableData[header]}
                          </td>
                        {/if}
                      {/each}
                      <td
                        class="border-t-0  align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                      >
                        <a use:link href={`/transaksi/order/edit/${tableData.id}`}>
                          <p
                            class="text-center bg-emerald-500 text-white active:bg-emerald-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                          >
                            Edit
                          </p>
                        </a>

                        <button
                          on:click={() => {
                            fetch(`${mainUrl}/api/transaksi/order/` + `${tableData.id}`, {
                              method: "delete",
                              headers: {
                                Authorization: `bearer ${getCookie("token")}`,
                              },
                            }).then(() => {
                              fetchData();
                            });
                          }}
                          class="w-full"
                        >
                          <p
                            class="text-center bg-red-500 text-white active:bg-red-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                          >
                            Hapus Data
                          </p>
                        </button></td
                      >
                    </tr>
                  {/each} -->
                    {#each data as tableData, index}
                      {#if tableData.status_kendaraan == "Sendiri"}
                        <tr>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <div class="container mx-autoflex flex-row mb-2">
                              <button
                                bind:this={btnDropdownRefStatusKendaraanSendiri}
                                on:click={() =>
                                  toggleDropdownStatusKendaraanSendiri(index)}
                                class="flex justify-center items-center m-1 px-2 py-1 rounded-full bg-orange-200 text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                                style="
                              background-color: 
                                {tableData.status_kendaraan_sendiri ==
                                'Berangkat'
                                  ? '#bbf7d0'
                                  : ''}
                                {tableData.status_kendaraan_sendiri == 'Pulang'
                                  ? '#fecaca'
                                  : ''}
                                {tableData.status_kendaraan_sendiri == 'Kontrak'
                                  ? '#fef08a'
                                  : ''}
                                {tableData.status_kendaraan_sendiri ==
                                'Kota-Kota'
                                  ? '#bfdbfe'
                                  : ''};
                              color: 
                                {tableData.status_kendaraan_sendiri ==
                                'Berangkat'
                                  ? '#16a34a'
                                  : ''}
                                {tableData.status_kendaraan_sendiri == 'Pulang'
                                  ? '#dc2626'
                                  : ''}
                                {tableData.status_kendaraan_sendiri == 'Kontrak'
                                  ? '#d97706'
                                  : ''}
                                {tableData.status_kendaraan_sendiri ==
                                'Kota-Kota'
                                  ? '#2563eb'
                                  : ''};"
                              >
                                <div
                                  class="flex-initial max-w-full leading-none text-sm font-semibold"
                                >
                                  {tableData.status_kendaraan_sendiri}
                                </div>
                              </button>
                              <div
                                bind:this={popoverDropdownRefStatusKendaraanSendiri}
                                class="bg-white px-3 text-base z-50 float-left py-2 list-none text-left rounded w-24 {dropdownPopoverShowStatusKendaraanSendiri[
                                  index
                                ]
                                  ? 'absolute'
                                  : 'hidden'}"
                              >
                                <Chips
                                  onClick={() =>
                                    changeStatusKendaraanSendiri({
                                      data: {
                                        ...tableData,
                                        status_kendaraan_sendiri: "Berangkat",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Berangkat"
                                  bgColor="#bbf7d0"
                                  textColor="#16a34a"
                                />
                                <Chips
                                  onClick={() =>
                                    changeStatusKendaraanSendiri({
                                      data: {
                                        ...tableData,
                                        status_kendaraan_sendiri: "Pulang",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Pulang"
                                  bgColor="#fecaca"
                                  textColor="#dc2626"
                                />
                                <Chips
                                  onClick={() =>
                                    changeStatusKendaraanSendiri({
                                      data: {
                                        ...tableData,
                                        status_kendaraan_sendiri: "Kontrak",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Kontrak"
                                  bgColor="#fef08a"
                                  textColor="#d97706"
                                />
                                <Chips
                                  onClick={() =>
                                    changeStatusKendaraanSendiri({
                                      data: {
                                        ...tableData,
                                        status_kendaraan_sendiri: "Kota-Kota",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Kota-Kota"
                                  bgColor="#bfdbfe"
                                  textColor="#2563eb"
                                />
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
                              <button
                                bind:this={btnDropdownRefStatusSuratJalan}
                                on:click={() =>
                                  toggleDropdownStatusSuratJalan(index)}
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
                              </button>
                              <!-- bind:this={popoverDropdownRef} -->
                              <!-- {dropdownPopoverShow ? 'block' : 'hidden'} -->
                              <div
                                bind:this={popoverDropdownRefStatusSuratJalan}
                                class="bg-white px-3 text-base z-50 float-left py-2 list-none text-left rounded w-24 {dropdownPopoverShowStatusSuratJalan[
                                  index
                                ]
                                  ? 'absolute'
                                  : 'hidden'}"
                              >
                                <Chips
                                  onClick={() =>
                                    changeStatusSuratJalan({
                                      data: {
                                        ...tableData,
                                        status_surat_jalan: "Sopir",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Sopir"
                                  bgColor="#bbf7d0"
                                  textColor="#16a34a"
                                />
                                <Chips
                                  onClick={() =>
                                    changeStatusSuratJalan({
                                      data: {
                                        ...tableData,
                                        status_surat_jalan: "Kantor",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Kantor"
                                  bgColor="#fecaca"
                                  textColor="#dc2626"
                                />
                                <Chips
                                  onClick={() =>
                                    changeStatusSuratJalan({
                                      data: {
                                        ...tableData,
                                        status_surat_jalan: "Selesai",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Selesai"
                                  bgColor="#fef08a"
                                  textColor="#d97706"
                                />
                              </div>
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
                            <form
                              on:submit|preventDefault={() => {
                                tableData.statusLoadingCatatan = true;
                                axios
                                  .put(
                                    `${mainUrl}/api/transaksi/order/${tableData.id}`,
                                    {
                                      catatan_surat_jalan:
                                        tableData.catatan_surat_jalan,
                                      ...tableData,
                                    },
                                    {
                                      headers: {
                                        Authorization: `bearer ${getCookie(
                                          "token"
                                        )}`,
                                      },
                                    }
                                  )
                                  .then((res) => {
                                    isDataValid = false;
                                    getdata().then(() => {
                                      tableData.statusLoadingCatatan = false;
                                    });
                                  });
                              }}
                            >
                              <div
                                class="relative flex w-full flex-wrap items-stretch mb-3"
                              >
                                <input
                                  bind:value={tableData.catatan_surat_jalan}
                                  type="text"
                                  placeholder="Keterangan"
                                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pr-10"
                                />
                                <span
                                  class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3"
                                >
                                  <button type="submit">
                                    <i
                                      class={tableData.statusLoadingCatatan
                                        ? "fas fa-spinner fa-pulse"
                                        : "fas fa-save"}
                                    ></i>
                                  </button>
                                </span>
                              </div>
                            </form>
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
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(tableData.harga_order)}
                            <br />
                            <a
                              use:link
                              href={`/transaksi/order/mutasi/${tableData.id}/order`}
                              class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            >
                              Rp. {IDRFormatter.format(
                                tableData.total_mutasi_order
                              )}</a
                            >
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <button
                              on:click={() =>
                                (showHargaOrderModal[index] = true)}
                              class="flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              style="background-color: #bbf7d0; color: #16a34a;"
                            >
                              <div
                                class="flex-initial max-w-full leading-none text-sm font-semibold"
                              >
                                Tambahkan Biaya
                              </div>
                            </button>
                            {#if tableData.biaya_lain_harga_order_arr.length == 0}
                              <p class="pl-1">Tidak ada biaya tambahan</p>
                            {:else}
                              <!-- Biaya lain harga order sendiri -->
                              <div>
                                <a
                                  use:link
                                  href={`/transaksi/order/detail-biaya-tambahan/${tableData.id}`}
                                  class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                                >
                                  Rp. {IDRFormatter.format(
                                    // tableData.biaya_lain_harga_jual_arr.reduce(
                                    //   (acc, curr) =>
                                    //     curr.sifat === "Menambahkan"
                                    //       ? acc + curr.nominal
                                    //       : acc - curr.nominal,
                                    //   0
                                    // ) +
                                    // tableData.biaya_lain_uang_jalan_arr.reduce(
                                    //   (acc, curr) =>
                                    //     curr.sifat === "Menambahkan"
                                    //       ? acc + curr.nominal
                                    //       : acc - curr.nominal,
                                    //   0
                                    // )+
                                    tableData.biaya_lain_harga_order_arr.reduce(
                                      (acc, curr) =>
                                        curr.sifat === "Menambahkan"
                                          ? acc + curr.nominal
                                          : acc - curr.nominal,
                                      0
                                    )
                                  )}</a
                                >
                              </div>
                            {/if}

                            {#if showHargaOrderModal[index]}
                              <div
                                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
                              >
                                <div
                                  class="relative w-auto my-6 mx-auto max-w-6xl"
                                >
                                  <!--content-->
                                  <div
                                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                                  >
                                    <!--header-->
                                    <div
                                      class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
                                    >
                                      <h3 class="text-3xl font-semibold">
                                        Tambahan biaya
                                      </h3>
                                      <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        on:click={() =>
                                          toggleHargaOrderModal(index)}
                                      >
                                        <span
                                          class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
                                        >
                                          ×
                                        </span>
                                      </button>
                                    </div>
                                    <!--body-->
                                    <div class="relative py-6 px-2 flex-auto">
                                      <div
                                        class="flex justify-center items-center"
                                      >
                                        <div class="relative flex-auto">
                                          <div
                                            class="flex flex-col justify-center items-center"
                                          >
                                            <select
                                              bind:value={sifat}
                                              class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            >
                                              <option selected value={0}
                                                >Silahkan pilih sifat biaya</option
                                              >
                                              {#each dataTambahan as tambahan}
                                                <option value={tambahan.id}>
                                                  {tambahan.nama} | {tambahan.sifat}
                                                </option>
                                              {/each}
                                            </select>
                                            <input
                                              class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                              type="number"
                                              bind:value={biaya}
                                              placeholder="Masukkan biaya tambahan"
                                            />
                                            {#if errorModalMsg}
                                              <div class="text-red-500 pt-6">
                                                <p>
                                                  {errorModalMsg}
                                                </p>
                                              </div>
                                            {/if}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <!--footer-->
                                    <div
                                      class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"
                                    >
                                      <button
                                        class="px-6 text-red-500 background-transparent font-bold uppercase py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        on:click={() =>
                                          toggleHargaOrderModal(index)}
                                      >
                                        Close
                                      </button>
                                      <button
                                        class="px-6 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        on:click={() => {
                                          if (sifat == 0) {
                                            errorModalMsg =
                                              "Mohon pilih jenis dan sifat terlebih dahulu";
                                            return;
                                          }
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_harga_order:
                                                tableData.biaya_lain_harga_order.concat(
                                                  {
                                                    m_tambahan_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });

                                          // if (jenis == 2) {
                                          //   addBiaya({
                                          //     data: {
                                          //       ...tableData,
                                          //       biaya_lain_uang_jalan:
                                          //         tableData.biaya_lain_uang_jalan.concat(
                                          //           {
                                          //             m_tambahan_id: sifat,
                                          //             nominal: biaya,
                                          //           }
                                          //         ),
                                          //     },
                                          //     id: tableData.id,
                                          //   });
                                          // }
                                          // if (jenis == 3) {
                                          //   addBiaya({
                                          //     data: {
                                          //       ...tableData,
                                          //       biaya_lain_harga_jual:
                                          //         tableData.biaya_lain_harga_jual.concat(
                                          //           {
                                          //             m_tambahan_id: sifat,
                                          //             nominal: biaya,
                                          //           }
                                          //         ),
                                          //     },
                                          //     id: tableData.id,
                                          //   });
                                          // }
                                          toggleHargaOrderModal(index);
                                        }}
                                      >
                                        Save Changes
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                class="opacity-25 fixed inset-0 z-40 bg-black"
                                on:click={() => toggleHargaOrderModal(index)}
                              ></div>
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
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(tableData.uang_jalan)}
                            <a
                              use:link
                              href={`/transaksi/order/mutasi/${tableData.id}/jual`}
                              class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            >
                              Rp. {IDRFormatter.format(
                                tableData.total_mutasi_jual
                              )}</a
                            >
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <button
                              on:click={() =>
                                (showUangJalanModal[index] = true)}
                              class="flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              style="background-color: #bbf7d0; color: #16a34a;"
                            >
                              <div
                                class="flex-initial max-w-full leading-none text-sm font-semibold"
                              >
                                Tambahkan Biaya
                              </div>
                            </button>
                            {#if tableData.biaya_lain_uang_jalan_arr.length == 0}
                              <p class="pl-1">Tidak ada biaya tambahan</p>
                            {:else}
                              <div>
                                <a
                                  use:link
                                  href={`/transaksi/order/detail-biaya-tambahan/${tableData.id}`}
                                  class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                                >
                                  Rp. {IDRFormatter.format(
                                    // tableData.biaya_lain_harga_jual_arr.reduce(
                                    //   (acc, curr) =>
                                    //     curr.sifat === "Menambahkan"
                                    //       ? acc + curr.nominal
                                    //       : acc - curr.nominal,
                                    //   0
                                    // ) +
                                    //   tableData.biaya_lain_uang_jalan_arr.reduce(
                                    //     (acc, curr) =>
                                    //       curr.sifat === "Menambahkan"
                                    //         ? acc + curr.nominal
                                    //         : acc - curr.nominal,
                                    //     0
                                    //   ) +
                                    tableData.biaya_lain_uang_jalan_arr.reduce(
                                      (acc, curr) =>
                                        curr.sifat === "Menambahkan"
                                          ? acc + curr.nominal
                                          : acc - curr.nominal,
                                      0
                                    )
                                  )}</a
                                >
                              </div>
                            {/if}

                            {#if showUangJalanModal[index]}
                              <div
                                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
                              >
                                <div
                                  class="relative w-auto my-6 mx-auto max-w-6xl"
                                >
                                  <!--content-->
                                  <div
                                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                                  >
                                    <!--header-->
                                    <div
                                      class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
                                    >
                                      <h3 class="text-3xl font-semibold">
                                        Tambahan biaya
                                      </h3>
                                      <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        on:click={() =>
                                          toggleHargaOrderModal(index)}
                                      >
                                        <span
                                          class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
                                        >
                                          ×
                                        </span>
                                      </button>
                                    </div>
                                    <!--body-->
                                    <div class="relative py-6 px-2 flex-auto">
                                      <div
                                        class="flex justify-center items-center"
                                      >
                                        <div class="relative flex-auto">
                                          <div
                                            class="flex flex-col justify-center items-center"
                                          >
                                            <select
                                              bind:value={sifat}
                                              class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            >
                                              <option selected value={0}
                                                >Silahkan pilih sifat biaya</option
                                              >
                                              {#each dataTambahan as tambahan}
                                                <option value={tambahan.id}>
                                                  {tambahan.nama} | {tambahan.sifat}
                                                </option>
                                              {/each}
                                            </select>
                                            <input
                                              class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                              type="number"
                                              bind:value={biaya}
                                              placeholder="Masukkan biaya tambahan"
                                            />
                                            {#if errorModalMsg}
                                              <div class="text-red-500 pt-6">
                                                <p>
                                                  {errorModalMsg}
                                                </p>
                                              </div>
                                            {/if}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <!--footer-->
                                    <div
                                      class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"
                                    >
                                      <button
                                        class="px-6 text-red-500 background-transparent font-bold uppercase py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        on:click={() =>
                                          toggleUangJalanModal(index)}
                                      >
                                        Close
                                      </button>
                                      <button
                                        class="px-6 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        on:click={() => {
                                          if (sifat == 0) {
                                            errorModalMsg =
                                              "Mohon pilih jenis dan sifat terlebih dahulu";
                                            return;
                                          }
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_uang_jalan:
                                                tableData.biaya_lain_uang_jalan.concat(
                                                  {
                                                    m_tambahan_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });

                                          // if (jenis == 2) {
                                          //   addBiaya({
                                          //     data: {
                                          //       ...tableData,
                                          //       biaya_lain_uang_jalan:
                                          //         tableData.biaya_lain_uang_jalan.concat(
                                          //           {
                                          //             m_tambahan_id: sifat,
                                          //             nominal: biaya,
                                          //           }
                                          //         ),
                                          //     },
                                          //     id: tableData.id,
                                          //   });
                                          // }
                                          // if (jenis == 3) {
                                          //   addBiaya({
                                          //     data: {
                                          //       ...tableData,
                                          //       biaya_lain_harga_jual:
                                          //         tableData.biaya_lain_harga_jual.concat(
                                          //           {
                                          //             m_tambahan_id: sifat,
                                          //             nominal: biaya,
                                          //           }
                                          //         ),
                                          //     },
                                          //     id: tableData.id,
                                          //   });
                                          // }
                                          toggleHargaOrderModal(index);
                                        }}
                                      >
                                        Save Changes
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                class="opacity-25 fixed inset-0 z-40 bg-black"
                                on:click={() => toggleHargaOrderModal(index)}
                              ></div>
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
                                  (acc, curr) =>
                                    curr.sifat === "Menambahkan"
                                      ? acc + curr.nominal
                                      : acc - curr.nominal,
                                  0
                                ) -
                                tableData.total_mutasi_order -
                                tableData.total_pajak
                            )}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <a
                              use:link
                              href={`/transaksi/order/edit/${tableData.id}`}
                            >
                              <p
                                class="text-center bg-emerald-500 text-white active:bg-emerald-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                              >
                                Edit
                              </p>
                            </a>
                            <button
                              on:click={() => {
                                fetch(
                                  mainUrl +
                                    "/api/transaksi/order/" +
                                    `${tableData.id}`,
                                  {
                                    method: "delete",
                                    headers: {
                                      Authorization: `bearer ${getCookie(
                                        "token"
                                      )}`,
                                    },
                                  }
                                ).then(() => {
                                  isDataValid = false;
                                  getdata();
                                });
                              }}
                              class="w-full"
                            >
                              <p
                                class="text-center bg-red-500 text-white active:bg-red-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                              >
                                Hapus Data
                              </p>
                            </button>
                          </td>
                        </tr>
                      {/if}
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

        {#if openTab == 2}
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
                      bind:value={search}
                      type="text"
                      placeholder="Cari"
                      class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"
                    />
                  </div>

                  <a use:link href={`/transaksi/order/add`}>
                    <p
                      class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    >
                      Tambah Data
                    </p>
                  </a>
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
                            <div class="container mx-autoflex flex-row mb-2">
                              <button
                                bind:this={btnDropdownRefStatusSuratJalan}
                                on:click={() =>
                                  toggleDropdownStatusSuratJalan(index)}
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
                              </button>
                              <!-- bind:this={popoverDropdownRef} -->
                              <!-- {dropdownPopoverShow ? 'block' : 'hidden'} -->
                              <div
                                bind:this={popoverDropdownRefStatusSuratJalan}
                                class="bg-white px-3 text-base z-50 float-left py-2 list-none text-left rounded w-24 {dropdownPopoverShowStatusSuratJalan[
                                  index
                                ]
                                  ? 'absolute'
                                  : 'hidden'}"
                              >
                                <Chips
                                  onClick={() =>
                                    changeStatusSuratJalan({
                                      data: {
                                        ...tableData,
                                        status_surat_jalan: "Sopir",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Sopir"
                                  bgColor="#bbf7d0"
                                  textColor="#16a34a"
                                />
                                <Chips
                                  onClick={() =>
                                    changeStatusSuratJalan({
                                      data: {
                                        ...tableData,
                                        status_surat_jalan: "Kantor",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Kantor"
                                  bgColor="#fecaca"
                                  textColor="#dc2626"
                                />
                                <Chips
                                  onClick={() =>
                                    changeStatusSuratJalan({
                                      data: {
                                        ...tableData,
                                        status_surat_jalan: "Selesai",
                                      },
                                      id: tableData.id,
                                    })}
                                  text="Selesai"
                                  bgColor="#fef08a"
                                  textColor="#d97706"
                                />
                              </div>
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
                            <form
                              on:submit|preventDefault={() => {
                                tableData.statusLoadingCatatan = true;
                                axios
                                  .put(
                                    `${mainUrl}/api/transaksi/order/${tableData.id}`,
                                    {
                                      catatan_surat_jalan:
                                        tableData.catatan_surat_jalan,
                                      ...tableData,
                                    },
                                    {
                                      headers: {
                                        Authorization: `bearer ${getCookie(
                                          "token"
                                        )}`,
                                      },
                                    }
                                  )
                                  .then((res) => {
                                    isDataValid = false;
                                    getdata();
                                    tableData.statusLoadingCatatan = false;
                                  });
                              }}
                            >
                              <div
                                class="relative flex w-full flex-wrap items-stretch mb-3"
                              >
                                <input
                                  bind:value={tableData.catatan_surat_jalan}
                                  type="text"
                                  placeholder="Keterangan"
                                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pr-10"
                                />
                                <span
                                  class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3"
                                >
                                  <button type="submit">
                                    <i
                                      class={tableData.statusLoadingCatatan
                                        ? "fas fa-spinner fa-pulse"
                                        : "fas fa-save"}
                                    ></i>
                                  </button>
                                </span>
                              </div>
                            </form>
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm"
                          >
                            {tableData.penyewa.nama_perusahaan} / {tableData.muatan}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            {tableData.nopol_subkon} / {tableData.sopir_subkon}
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
                            <a
                              use:link
                              href={`/transaksi/order/mutasi/${tableData.id}/order`}
                              class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            >
                              Rp. {IDRFormatter.format(
                                tableData.total_mutasi_order
                              )}</a
                            >
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <button
                              on:click={() =>
                                (showHargaOrderModal[index] = true)}
                              class="flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              style="background-color: #bbf7d0; color: #16a34a;"
                            >
                              <div
                                class="flex-initial max-w-full leading-none text-sm font-semibold"
                              >
                                Tambahkan Biaya
                              </div>
                            </button>
                            {#if tableData.biaya_lain_harga_order_arr.length == 0}
                              <p class="pl-1">Tidak ada biaya tambahan</p>
                            {:else}
                              <div>
                                <a
                                  use:link
                                  href={`/transaksi/order/detail-biaya-tambahan/${tableData.id}`}
                                  class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                                >
                                  Rp. {IDRFormatter.format(
                                    tableData.biaya_lain_harga_order_arr.reduce(
                                      (acc, curr) =>
                                        curr.sifat === "Menambahkan"
                                          ? acc + curr.nominal
                                          : acc - curr.nominal,
                                      0
                                    )
                                  )}</a
                                >
                              </div>
                            {/if}

                            {#if showHargaOrderModal[index]}
                              <div
                                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
                              >
                                <div
                                  class="relative w-auto my-6 mx-auto max-w-6xl"
                                >
                                  <!--content-->
                                  <div
                                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                                  >
                                    <!--header-->
                                    <div
                                      class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
                                    >
                                      <h3 class="text-3xl font-semibold">
                                        Tambahkan Biaya
                                      </h3>
                                      <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        on:click={() =>
                                          toggleHargaOrderModal(index)}
                                      >
                                        <span
                                          class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
                                        >
                                          ×
                                        </span>
                                      </button>
                                    </div>
                                    <!--body-->
                                    <div class="relative py-6 px-2 flex-auto">
                                      <div
                                        class="flex justify-center items-center"
                                      >
                                        <div class="relative flex-auto">
                                          <div
                                            class="flex flex-col justify-center items-center"
                                          >
                                            <select
                                              bind:value={sifat}
                                              class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            >
                                              <option selected value={0}
                                                >Silahkan pilih sifat biaya</option
                                              >
                                              {#each dataTambahan as tambahan}
                                                <option value={tambahan.id}>
                                                  {tambahan.nama} | {tambahan.sifat}
                                                </option>
                                              {/each}
                                            </select>
                                            <input
                                              class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                              type="number"
                                              bind:value={biaya}
                                              placeholder="Masukkan biaya tambahan"
                                            />
                                            <!-- <select
                                              bind:value={jenis}
                                              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            >
                                              <option selected value={0}
                                                >Silahkan pilih jenis biaya</option
                                              >
                                              <option value="1"
                                                >Harga tambahan biaya order</option
                                              >
                                              {#if tableData.status_kendaraan == "Sendiri"}
                                                <option value="2"
                                                  >Harga tambahan uang jalan</option
                                                >
                                              {/if}
                                              {#if tableData.status_kendaraan == "Subkon"}
                                                <option value="3"
                                                  >Harga tambahan harga jual</option
                                                >
                                              {/if}
                                            </select> -->
                                            {#if errorModalMsg}
                                              <div class="text-red-500 pt-6">
                                                <p>
                                                  {errorModalMsg}
                                                </p>
                                              </div>
                                            {/if}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <!--footer-->
                                    <div
                                      class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"
                                    >
                                      <button
                                        class="px-6 text-red-500 background-transparent font-bold uppercase py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        on:click={() =>
                                          toggleHargaOrderModal(index)}
                                      >
                                        Close
                                      </button>
                                      <button
                                        class="px-6 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        on:click={() => {
                                          if (sifat == 0) {
                                            errorModalMsg =
                                              "Mohon pilih jenis dan sifat terlebih dahulu";
                                            return;
                                          }
                                          // if (jenis == 1) {
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_harga_order:
                                                tableData.biaya_lain_harga_order.concat(
                                                  {
                                                    m_tambahan_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });
                                          // }
                                          // if (jenis == 2) {
                                          //   addBiaya({
                                          //     data: {
                                          //       ...tableData,
                                          //       biaya_lain_uang_jalan:
                                          //         tableData.biaya_lain_uang_jalan.concat(
                                          //           {
                                          //             m_tambahan_id: sifat,
                                          //             nominal: biaya,
                                          //           }
                                          //         ),
                                          //     },
                                          //     id: tableData.id,
                                          //   });
                                          // }
                                          // if (jenis == 3) {
                                          //   addBiaya({
                                          //     data: {
                                          //       ...tableData,
                                          //       biaya_lain_harga_jual:
                                          //         tableData.biaya_lain_harga_jual.concat(
                                          //           {
                                          //             m_tambahan_id: sifat,
                                          //             nominal: biaya,
                                          //           }
                                          //         ),
                                          //     },
                                          //     id: tableData.id,
                                          //   });
                                          // }
                                          toggleHargaOrderModal(index);
                                        }}
                                      >
                                        Save Changes
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                class="opacity-25 fixed inset-0 z-40 bg-black"
                                on:click={() => toggleHargaOrderModal(index)}
                              ></div>
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
                                tableData.total_pajak -
                                tableData.biaya_lain_harga_order_arr.reduce(
                                  (acc, curr) =>
                                    curr.sifat === "Menambahkan"
                                      ? acc + curr.nominal
                                      : acc - curr.nominal,
                                  0
                                )
                            )}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(tableData.harga_jual)}
                            <!-- Mutasi Harga Jual -->
                            <a
                              use:link
                              href={`/transaksi/order/mutasi/${tableData.id}/jual`}
                              class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            >
                              <!-- Mutasi total -->
                              Rp. {IDRFormatter.format(
                                tableData.total_mutasi_jual
                              )}</a
                            >
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <button
                              on:click={() =>
                                (showUangJalanModal[index] = true)}
                              class="flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              style="background-color: #bbf7d0; color: #16a34a;"
                            >
                              <div
                                class="flex-initial max-w-full leading-none text-sm font-semibold"
                              >
                                Tambahkan Biaya
                              </div>
                            </button>
                            {#if tableData.biaya_lain_harga_jual_arr.length == 0}
                              <p class="pl-1">Tidak ada biaya tambahan</p>
                            {:else}
                              <div>
                                <a
                                  use:link
                                  href={`/transaksi/order/detail-biaya-tambahan/${tableData.id}`}
                                  class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                                >
                                  Rp. {IDRFormatter.format(
                                    tableData.biaya_lain_harga_jual_arr.reduce(
                                      (acc, curr) =>
                                        curr.sifat === "Menambahkan"
                                          ? acc + curr.nominal
                                          : acc - curr.nominal,
                                      0
                                    ) //+
                                    // tableData.biaya_lain_uang_jalan_arr.reduce(
                                    //   (acc, curr) =>
                                    //     curr.sifat === "Menambahkan"
                                    //       ? acc + curr.nominal
                                    //       : acc - curr.nominal,
                                    //   0
                                    // ) +
                                    // tableData.biaya_lain_harga_order_arr.reduce(
                                    //   (acc, curr) =>
                                    //     curr.sifat === "Menambahkan"
                                    //       ? acc + curr.nominal
                                    //       : acc - curr.nominal,
                                    //   0
                                    // )
                                  )}</a
                                >
                              </div>
                            {/if}

                            {#if showUangJalanModal[index]}
                              <div
                                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
                              >
                                <div
                                  class="relative w-auto my-6 mx-auto max-w-6xl"
                                >
                                  <!--content-->
                                  <div
                                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                                  >
                                    <!--header-->
                                    <div
                                      class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
                                    >
                                      <h3 class="text-3xl font-semibold">
                                        Tambahkan Biaya
                                      </h3>
                                      <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        on:click={() =>
                                          toggleHargaOrderModal(index)}
                                      >
                                        <span
                                          class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
                                        >
                                          ×
                                        </span>
                                      </button>
                                    </div>
                                    <!--body-->
                                    <div class="relative py-6 px-2 flex-auto">
                                      <div
                                        class="flex justify-center items-center"
                                      >
                                        <div class="relative flex-auto">
                                          <div
                                            class="flex flex-col justify-center items-center"
                                          >
                                            <select
                                              bind:value={sifat}
                                              class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            >
                                              <option selected value={0}
                                                >Silahkan pilih sifat biaya</option
                                              >
                                              {#each dataTambahan as tambahan}
                                                <option value={tambahan.id}>
                                                  {tambahan.nama} | {tambahan.sifat}
                                                </option>
                                              {/each}
                                            </select>
                                            <input
                                              class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                              type="number"
                                              bind:value={biaya}
                                              placeholder="Masukkan biaya tambahan"
                                            />
                                            {#if errorModalMsg}
                                              <div class="text-red-500 pt-6">
                                                <p>
                                                  {errorModalMsg}
                                                </p>
                                              </div>
                                            {/if}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <!--footer-->
                                    <div
                                      class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"
                                    >
                                      <button
                                        class="px-6 text-red-500 background-transparent font-bold uppercase py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        on:click={() =>
                                          toggleUangJalanModal(index)}
                                      >
                                        Close
                                      </button>
                                      <button
                                        class="px-6 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        on:click={() => {
                                          if (sifat == 0) {
                                            errorModalMsg =
                                              "Mohon pilih jenis dan sifat terlebih dahulu";
                                            return;
                                          }
                                          // if (jenis == 1) {
                                          //   addBiaya({
                                          //     data: {
                                          //       ...tableData,
                                          //       biaya_lain_harga_order:
                                          //         tableData.biaya_lain_harga_order.concat(
                                          //           {
                                          //             m_tambahan_id: sifat,
                                          //             nominal: biaya,
                                          //           }
                                          //         ),
                                          //     },
                                          //     id: tableData.id,
                                          //   });
                                          // }
                                          // if (jenis == 2) {
                                          //   addBiaya({
                                          //     data: {
                                          //       ...tableData,
                                          //       biaya_lain_uang_jalan:
                                          //         tableData.biaya_lain_uang_jalan.concat(
                                          //           {
                                          //             m_tambahan_id: sifat,
                                          //             nominal: biaya,
                                          //           }
                                          //         ),
                                          //     },
                                          //     id: tableData.id,
                                          //   });
                                          // }
                                          // if (jenis == 3) {
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_harga_jual:
                                                tableData.biaya_lain_harga_jual.concat(
                                                  {
                                                    m_tambahan_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });
                                          // }
                                          toggleHargaOrderModal(index);
                                        }}
                                      >
                                        Save Changes
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                class="opacity-25 fixed inset-0 z-40 bg-black"
                                on:click={() => toggleHargaOrderModal(index)}
                              ></div>
                            {/if}
                          </td>
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            Rp. {IDRFormatter.format(
                              tableData.harga_jual +
                                tableData.biaya_lain_harga_jual_arr.reduce(
                                  (acc, curr) =>
                                    curr.sifat === "Menambahkan"
                                      ? acc + curr.nominal
                                      : acc - curr.nominal,
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
                          <td
                            class="border-t-0 align-middle border-l-0 border-r-0 text-sm py-4 px-2"
                          >
                            <a
                              use:link
                              href={`/transaksi/order/edit/${tableData.id}`}
                            >
                              <p
                                class="text-center bg-emerald-500 text-white active:bg-emerald-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                              >
                                Edit
                              </p>
                            </a>
                            <button
                              on:click={() => {
                                fetch(
                                  mainUrl +
                                    "/api/transaksi/order/" +
                                    `${tableData.id}`,
                                  {
                                    method: "delete",
                                    headers: {
                                      Authorization: `bearer ${getCookie(
                                        "token"
                                      )}`,
                                    },
                                  }
                                ).then(() => {
                                  isDataValid = false;
                                  getdata();
                                });
                              }}
                              class="w-full"
                            >
                              <p
                                class="text-center bg-red-500 text-white active:bg-red-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                              >
                                Hapus Data
                              </p>
                            </button>
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
      </Route>
      <Route path="mutasi/:id/:jenis" let:params>
        <DetailTransaksi id={params.id} jenis={params.jenis} />
      </Route>
      <Route path="add">
        <CardInputLaporanTransaksiOrder
          onSuccess={() => {
            isDataValid = false;
            getdata();
          }}
        />
      </Route>
      <Route path="detail-biaya-tambahan/:id" let:params>
        <DetailBiayaTambahan id={params.id} />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditLaporanTransaksiOrder
          id={params.edit}
          onSuccess={() => {
            isDataValid = false;
            getdata();
          }}
        />
      </Route>
      <Route path="mutasi/:id/:jenis/add/" let:params>
        <CardInputDetailTransaksi
          onSuccess={() => {
            isDataValid = false;
            getdata();
          }}
          id={params.id}
          jenis={params.jenis}
        />
      </Route>
    </Router>
  </div>
</div>
