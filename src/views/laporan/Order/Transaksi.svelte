<script>
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
  // import "../../app.css";

  let data = [];
  let dataRekening = [];
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
    "Biaya Tambah / Kurang",
    "PPH/PPN",
    "Sisa Piutang Tagihan",
    "Harga Jual",
    "Sisa Hutang ke Subkon",
    "Ket",
  ];

  function fetchData() {
    fetch(`${mainUrl}/api/transaksi/order`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          // delete e.created_at;
          // delete e.updated_at;
          // delete e.m_penyewa_id;
          // delete e.m_armada_id;
          // delete e.m_sopir_id;
          // delete e.m_subkon_id;
          // delete e.rekening;

          // // e.biaya_lain_harga_order_arr = e.biaya_lain_harga_order_arr.map(
          // //   (e) => {
          // //     return ` ${e.nama} | ${e.nominal}`;
          // //   }
          // // );

          // // e.biaya_lain_uang_jalan_arr = e.biaya_lain_uang_jalan_arr.map((e) => {
          // //   return ` ${e.nama}`;
          // // });
          // // e.biaya_lain_harga_jual_arr = e.biaya_lain_harga_jual_arr.map((e) => {
          // //   return ` ${e.nama}`;
          // // });
          // e.penyewa = e.penyewa.nama_perusahaan;
          // e.armada = e.armada.nopol;
          // e.sopir = e.sopir.nama;
          // if (e.subkon != null) {
          //   e.subkon = e.subkon.nama_perusahaan;
          // } else {
          //   e.subkon = "Bukan kendaraan subkon";
          // }
          // if (e.status_kendaraan_sendiri == null) {
          //   e.status_kendaraan_sendiri = "Bukan kendaraan sendiri";
          // }
          if (e.biaya_lain_harga_jual == null) {
            e.biaya_lain_harga_jual = [];
          }
          if (e.biaya_lain_uang_jalan == null) {
            e.biaya_lain_uang_jalan = [];
          }
          if (e.biaya_lain_harga_order == null) {
            e.biaya_lain_harga_order = [];
          }
        });
        data = res.data;
      });
    });
  }

  async function fetchRekeningData() {
    let res = await axios.get(`${mainUrl}/api/rekening`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    dataRekening = res.data.data;
    console.log(dataRekening);
  }

  let search = "";
  let color = "light";
  let dataSearch = [];

  $: dataSearch = search
    ? data.filter((item) =>
        Object.keys(item).some(
          (key) =>
            String(item[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
        )
      )
    : data;

  const changeStatusKendaraanSendiri = ({ data, id }) => {
    try {
      axios
        .put(`${mainUrl}/api/transaksi/order/${id}`, data, {
          headers: {
            Authorization: `bearer ${getCookie("token")}`,
          },
        })
        .then((res) => {
          console.log(res);
          fetchData();
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
          console.log(res);
          fetchData();
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
          console.log(res);
          sifat = 0;
          jenis = 0;
          biaya = null;
          fetchData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  let tableSendiri;
  let tableSubkon;
  onMount(() => {
    fetchData();
    fetchRekeningData();
    const updatePosition = () => {
      console.log(popoverDropdownRefStatusHargaOrder);
      if (popoverDropdownRefStatusHargaOrder) {
        popoverDropdownRefStatusHargaOrder.style.left = `${window.scrollX}px`;
      }
    };
  });

  let showHargaOrderModal = [];
  $: showHargaOrderModal = data.map(() => false);

  let dropdownPopoverShowStatusKendaraanSendiri = [];
  $: dropdownPopoverShowStatusKendaraanSendiri = dataSearch.map(() => false);
  let btnDropdownRefStatusKendaraanSendiri;
  let popoverDropdownRefStatusKendaraanSendiri;

  let dropdownPopoverShowStatusSuratJalan = [];
  $: dropdownPopoverShowStatusSuratJalan = dataSearch.map(() => false);
  let btnDropdownRefStatusSuratJalan;
  let popoverDropdownRefStatusSuratJalan;

  let dropdownPopoverShowStatusHargaOrder = [];
  $: dropdownPopoverShowStatusHargaOrder = dataSearch.map(() => false);
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

  function toggleHargaOrderModal(id) {
    showHargaOrderModal[id] = !showHargaOrderModal[id];
  }

  let sifat = 0;
  let jenis = 0;
  let biaya;
  let errorModalMsg;
  let totalSum = 0;
  let detailBiayaOrderData = [];
  let detailBiayaUangJalanData = [];
  let detailBiayahargaJualData = [];
  let IDRFormatter = new Intl.NumberFormat("id-ID",);
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
                    type="text"
                    placeholder="Cari"
                    class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"
                  />
                </div>

                <a use:link href={`/transaksi/order/add`}>
                  <p
                    class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
                  {#each headingTransaksiOrder as data}
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
                      'light'
                        ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                        : 'bg-red-700 text-red-200 border-red-600'}"
                    >
                      {data}
                    </th>
                  {/each}
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
                  <!-- {#each dataSearch as tableData}
                    <tr>
                      {#each Object.keys(data[0]) as header}
                        {#if tableData[header] == "aktif"}
                          <td
                            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                          >
                            <p
                              class="text-center bg-emerald-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                            >
                              {tableData[header]}
                            </p>
                          </td>
                        {:else if tableData[header] == "nonaktif"}
                          <td
                            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                          >
                            <p
                              class="text-center bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                            >
                              {tableData[header]}
                            </p>
                          </td>
                        {:else}
                          <td
                            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                          >
                            {tableData[header]}
                          </td>
                        {/if}
                      {/each}
                      <td
                        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                      >
                        <a use:link href={`/transaksi/order/edit/${tableData.id}`}>
                          <p
                            class="text-center bg-emerald-500 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
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
                            class="text-center bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                          >
                            Hapus Data
                          </p>
                        </button></td
                      >
                    </tr>
                  {/each} -->
                  {#each dataSearch as tableData, index}
                    {#if tableData.status_kendaraan == "Sendiri"}
                      <tr>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
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
                                class="flex-initial max-w-full leading-none text-xs font-semibold"
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
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
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
                                class="flex-initial max-w-full leading-none text-xs font-semibold"
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
                          {tableData.no_transaksi}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.penyewa.nama_perusahaan} / {tableData.muatan}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.armada.nopol} / {tableData.sopir.nama}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.asal} / {tableData.tujuan}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          <div class="container mx-autoflex flex-row mb-2">
                            <button
                              bind:this={btnDropdownRefStatusHargaOrder}
                              on:click={() =>
                                toggleDropdownStatusHargaOrder(index)}
                              class="flex justify-center items-center m-1 px-2 py-1 rounded-full text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              style="
                            background-color: 
                              {tableData.status_harga_order == 'Dp'
                                ? '#bbf7d0'
                                : ''}
                              {tableData.status_harga_order == 'Pelunasan'
                                ? '#bbf7d0'
                                : ''};
                            color: 
                              {tableData.status_harga_order == 'Dp'
                                ? '#16a34a'
                                : ''}
                              {tableData.status_harga_order == 'Pelunasan'
                                ? '#16a34a'
                                : ''};"
                            >
                              <div
                                class="flex-initial max-w-full leading-none text-xs font-semibold"
                              >
                                {tableData.status_harga_order}
                              </div>
                            </button>
                            <!-- bind:this={popoverDropdownRef} -->
                            <!-- {dropdownPopoverShow ? 'block' : 'hidden'} -->
                            <div
                              bind:this={popoverDropdownRefStatusHargaOrder}
                              class="bg-white px-3 text-base z-50 float-left py-2 list-none text-left rounded w-24 {dropdownPopoverShowStatusHargaOrder[
                                index
                              ]
                                ? 'absolute'
                                : 'hidden'}"
                            >
                              <Chips
                                onClick={() => {
                                  tableData.status_harga_order = "Dp";
                                }}
                                text="Dp"
                                bgColor="#bbf7d0"
                                textColor="#16a34a"
                              />
                              <Chips
                                onClick={() => {
                                  tableData.status_harga_order = "Pelunasan";
                                }}
                                text="Pelunasan"
                                bgColor="#bbf7d0"
                                textColor="#16a34a"
                              />
                            </div>
                          </div>
                          Rp. {IDRFormatter.format(tableData.harga_order)}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          <button
                            on:click={() => (showHargaOrderModal[index] = true)}
                            class="flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            style="background-color: #bbf7d0; color: #16a34a;"
                          >
                            <div
                              class="flex-initial max-w-full leading-none text-xs font-semibold"
                            >
                              Tambahkan Biaya
                            </div>
                          </button>
                          {#if tableData.biaya_lain_harga_order_arr.length == 0 && tableData.biaya_lain_harga_jual_arr.length == 0 && tableData.biaya_lain_uang_jalan_arr.length == 0}
                            <p class="text-center">Tidak ada biaya tambahan</p>
                          {:else}
                            <!-- {#each tableData.biaya_lain_harga_order_arr as biaya}
                              <div
                                class="bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              >
                                <div
                                  class="flex-initial max-w-full leading-none text-xs font-semibold"
                                >
                                  {biaya.nominal} | {biaya.sifat}
                                </div>
                              </div>
                            {/each}
                            {#each tableData.biaya_lain_harga_jual_arr as biaya}
                              <div
                                class="bg-sky-300 text-sky-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              >
                                <div
                                  class="flex-initial max-w-full leading-none text-xs font-semibold"
                                >
                                  {biaya.nominal} | {biaya.sifat}
                                </div>
                              </div>
                            {/each}
                            {#each tableData.biaya_lain_uang_jalan_arr as biaya}
                              <div
                                class="bg-sky-300 text-sky-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              >
                                <div
                                  class="flex-initial max-w-full leading-none text-xs font-semibold"
                                >
                                  {biaya.nominal} | {biaya.sifat}
                                </div>
                              </div>
                            {/each} -->
                            <div>
                              Total Biaya Tambahan: <a
                                use:link
                                href={`/transaksi/order/detail-biaya-tambahan/${index}`}
                                class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              >
                                Rp. {IDRFormatter.format(tableData.biaya_lain_harga_jual_arr.reduce(
                                  (acc, curr) =>
                                    curr.sifat === "Menambahkan"
                                      ? acc + curr.nominal
                                      : acc - curr.nominal,
                                  0
                                ) +
                                  tableData.biaya_lain_uang_jalan_arr.reduce(
                                    (acc, curr) =>
                                      curr.sifat === "Menambahkan"
                                        ? acc + curr.nominal
                                        : acc - curr.nominal,
                                    0
                                  ) +
                                  tableData.biaya_lain_harga_order_arr.reduce(
                                    (acc, curr) =>
                                      curr.sifat === "Menambahkan"
                                        ? acc + curr.nominal
                                        : acc - curr.nominal,
                                    0
                                  ))}</a
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
                                      Modal Title
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
                                            {#each dataRekening as rekening}
                                              <option value={rekening.id}>
                                                {rekening.nama} | {rekening.sifat}
                                              </option>
                                            {/each}
                                          </select>
                                          <input
                                            class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            type="number"
                                            bind:value={biaya}
                                            placeholder="Masukkan biaya tambahan"
                                          />
                                          <select
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
                                          </select>
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
                                      class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      on:click={() =>
                                        toggleHargaOrderModal(index)}
                                    >
                                      Close
                                    </button>
                                    <button
                                      class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      on:click={() => {
                                        console.log(tableData.id);
                                        if (jenis == 0 || sifat == 0) {
                                          errorModalMsg =
                                            "Mohon pilih jenis dan sifat terlebih dahulu";
                                          return;
                                        }
                                        if (jenis == 1) {
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_harga_order:
                                                tableData.biaya_lain_harga_order.concat(
                                                  {
                                                    m_rekening_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });
                                        }
                                        if (jenis == 2) {
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_uang_jalan:
                                                tableData.biaya_lain_uang_jalan.concat(
                                                  {
                                                    m_rekening_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });
                                        }
                                        if (jenis == 3) {
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_harga_jual:
                                                tableData.biaya_lain_harga_jual.concat(
                                                  {
                                                    m_rekening_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });
                                        }
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
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Rp. {IDRFormatter.format(tableData.total_pajak)}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Rp. {IDRFormatter.format(tableData.setor)}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Rp. {IDRFormatter.format(tableData.uang_jalan)}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Rp. {IDRFormatter.format(tableData.potongan_wajib)}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Rp. {IDRFormatter.format(tableData.sisa_tagihan)}
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
                    class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    Tambah Data
                  </p>
                </a>
              </div>
            </div>
          </div>

          <div class="block w-full overflow-x-auto">
            <!-- Projects table -->
            <table class="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  {#each headingTransaksiOrderSubkon as data}
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color ===
                      'light'
                        ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                        : 'bg-red-700 text-red-200 border-red-600'}"
                    >
                      {data}
                    </th>
                  {/each}
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
                  <!-- {#each dataSearch as tableData}
                    <tr>
                      {#each Object.keys(data[0]) as header}
                        {#if tableData[header] == "aktif"}
                          <td
                            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                          >
                            <p
                              class="text-center bg-emerald-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                            >
                              {tableData[header]}
                            </p>
                          </td>
                        {:else if tableData[header] == "nonaktif"}
                          <td
                            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                          >
                            <p
                              class="text-center bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                            >
                              {tableData[header]}
                            </p>
                          </td>
                        {:else}
                          <td
                            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                          >
                            {tableData[header]}
                          </td>
                        {/if}
                      {/each}
                      <td
                        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                      >
                        <a use:link href={`/transaksi/order/edit/${tableData.id}`}>
                          <p
                            class="text-center bg-emerald-500 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
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
                            class="text-center bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                          >
                            Hapus Data
                          </p>
                        </button></td
                      >
                    </tr>
                  {/each} -->
                  {#each dataSearch as tableData, index}
                    {#if tableData.status_kendaraan == "Subkon"}
                      <tr>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {#if tableData.status_kendaraan == "Sendiri"}
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
                                  class="flex-initial max-w-full leading-none text-xs font-semibold"
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
                          {/if}
                          {tableData.tanggal_awal}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
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
                                class="flex-initial max-w-full leading-none text-xs font-semibold"
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
                          {tableData.no_transaksi}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.penyewa.nama_perusahaan} / {tableData.muatan}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.armada.nopol} / {tableData.sopir.nama}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.asal} / {tableData.tujuan}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          <div class="container mx-autoflex flex-row mb-2">
                            <button
                              bind:this={btnDropdownRefStatusHargaOrder}
                              on:click={() =>
                                toggleDropdownStatusHargaOrder(index)}
                              class="flex justify-center items-center m-1 px-2 py-1 rounded-full text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              style="
                            background-color: 
                              {tableData.status_harga_order == 'Dp'
                                ? '#bbf7d0'
                                : ''}
                              {tableData.status_harga_order == 'Pelunasan'
                                ? '#bbf7d0'
                                : ''};
                            color: 
                              {tableData.status_harga_order == 'Dp'
                                ? '#16a34a'
                                : ''}
                              {tableData.status_harga_order == 'Pelunasan'
                                ? '#16a34a'
                                : ''};"
                            >
                              <div
                                class="flex-initial max-w-full leading-none text-xs font-semibold"
                              >
                                {tableData.status_harga_order}
                              </div>
                            </button>
                            <!-- bind:this={popoverDropdownRef} -->
                            <!-- {dropdownPopoverShow ? 'block' : 'hidden'} -->
                            <div
                              bind:this={popoverDropdownRefStatusHargaOrder}
                              class="bg-white px-3 text-base z-50 float-left py-2 list-none text-left rounded w-24 {dropdownPopoverShowStatusHargaOrder[
                                index
                              ]
                                ? 'absolute'
                                : 'hidden'}"
                            >
                              <Chips
                                onClick={() => {
                                  tableData.status_harga_order = "Dp";
                                }}
                                text="Dp"
                                bgColor="#bbf7d0"
                                textColor="#16a34a"
                              />
                              <Chips
                                onClick={() => {
                                  tableData.status_harga_order = "Pelunasan";
                                }}
                                text="Pelunasan"
                                bgColor="#bbf7d0"
                                textColor="#16a34a"
                              />
                            </div>
                          </div>
                          Rp. {IDRFormatter.format(tableData.harga_order)}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          <button
                            on:click={() => (showHargaOrderModal[index] = true)}
                            class="flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                            style="background-color: #bbf7d0; color: #16a34a;"
                          >
                            <div
                              class="flex-initial max-w-full leading-none text-xs font-semibold"
                            >
                              Tambahkan Biaya
                            </div>
                          </button>
                          {#if tableData.biaya_lain_harga_order_arr.length == 0 && tableData.biaya_lain_harga_jual_arr.length == 0 && tableData.biaya_lain_uang_jalan_arr.length == 0}
                            <p class="text-center">Tidak ada biaya tambahan</p>
                          {:else}
                            <!-- {#each tableData.biaya_lain_harga_order_arr as biaya}
                              <div
                                class="bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              >
                                <div
                                  class="flex-initial max-w-full leading-none text-xs font-semibold"
                                >
                                  {biaya.nominal} | {biaya.sifat}
                                </div>
                              </div>
                            {/each}
                            {#each tableData.biaya_lain_harga_jual_arr as biaya}
                              <div
                                class="bg-sky-300 text-sky-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              >
                                <div
                                  class="flex-initial max-w-full leading-none text-xs font-semibold"
                                >
                                  {biaya.nominal} | {biaya.sifat}
                                </div>
                              </div>
                            {/each}
                            {#each tableData.biaya_lain_uang_jalan_arr as biaya}
                              <div
                                class="bg-sky-300 text-sky-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              >
                                <div
                                  class="flex-initial max-w-full leading-none text-xs font-semibold"
                                >
                                  {biaya.nominal} | {biaya.sifat}
                                </div>
                              </div>
                            {/each} -->
                            <div>
                              Total Biaya Tambahan: <a
                                use:link
                                href={`/transaksi/order/detail-biaya-tambahan/${index}`}
                                class="font-medium bg-violet-300 text-violet-800 flex justify-center items-center m-1 px-2 py-1 rounded-md text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-none"
                              >
                                Rp. {IDRFormatter.format(tableData.biaya_lain_harga_jual_arr.reduce(
                                  (acc, curr) =>
                                    curr.sifat === "Menambahkan"
                                      ? acc + curr.nominal
                                      : acc - curr.nominal,
                                  0
                                ) +
                                  tableData.biaya_lain_uang_jalan_arr.reduce(
                                    (acc, curr) =>
                                      curr.sifat === "Menambahkan"
                                        ? acc + curr.nominal
                                        : acc - curr.nominal,
                                    0
                                  ) +
                                  tableData.biaya_lain_harga_order_arr.reduce(
                                    (acc, curr) =>
                                      curr.sifat === "Menambahkan"
                                        ? acc + curr.nominal
                                        : acc - curr.nominal,
                                    0
                                  ))}</a
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
                                      Modal Title
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
                                            {#each dataRekening as rekening}
                                              <option value={rekening.id}>
                                                {rekening.nama} | {rekening.sifat}
                                              </option>
                                            {/each}
                                          </select>
                                          <input
                                            class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            type="number"
                                            bind:value={biaya}
                                            placeholder="Masukkan biaya tambahan"
                                          />
                                          <select
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
                                          </select>
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
                                      class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      on:click={() =>
                                        toggleHargaOrderModal(index)}
                                    >
                                      Close
                                    </button>
                                    <button
                                      class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      on:click={() => {
                                        console.log(tableData.id);
                                        if (jenis == 0 || sifat == 0) {
                                          errorModalMsg =
                                            "Mohon pilih jenis dan sifat terlebih dahulu";
                                          return;
                                        }
                                        if (jenis == 1) {
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_harga_order:
                                                tableData.biaya_lain_harga_order.concat(
                                                  {
                                                    m_rekening_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });
                                        }
                                        if (jenis == 2) {
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_uang_jalan:
                                                tableData.biaya_lain_uang_jalan.concat(
                                                  {
                                                    m_rekening_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });
                                        }
                                        if (jenis == 3) {
                                          addBiaya({
                                            data: {
                                              ...tableData,
                                              biaya_lain_harga_jual:
                                                tableData.biaya_lain_harga_jual.concat(
                                                  {
                                                    m_rekening_id: sifat,
                                                    nominal: biaya,
                                                  }
                                                ),
                                            },
                                            id: tableData.id,
                                          });
                                        }
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
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Rp. {IDRFormatter.format(tableData.total_pajak)}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Sisa Piutang
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Rp. {IDRFormatter.format(tableData.harga_jual)}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          Rp. {IDRFormatter.format(tableData.sisa_hutang_ke_subkon)}
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
      </Route>
      <Route path="add">
        <CardInputLaporanTransaksiOrder />
      </Route>
      <Route path="detail-biaya-tambahan/:id" let:params>
        <DetailBiayaTambahan id={params.id} />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditLaporanTransaksiOrder id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
