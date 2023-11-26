<script>
  // core components
  import CardEditLaporanTransaksiOrder from "../../notusComponents/Cards/CardInput/CardEdit/CardEditLaporanTransaksiOrder.svelte";
  import { Router, Route } from "svelte-routing";
  import { mainUrl } from "../../environment";
  import { getCookie } from "svelte-cookie";
  import CardInputLaporanTransaksiOrder from "../../notusComponents/Cards/CardInput/CardInputLaporanTransaksiOrder.svelte";
  import { link } from "svelte-routing";
  import { onMount } from "svelte";
  import { createPopper } from "@popperjs/core";
  import Chips from "../../notusComponents/Chips/Chips.svelte";
  // import "../../app.css";

  let data = [];
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
    "Uang Jalan Tambah / Kurang",
    "Sisa Tagihan",
  ];

  function fetchData() {
    fetch(`${mainUrl}/api/transaksi/order`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          delete e.created_at;
          delete e.updated_at;
          delete e.m_penyewa_id;
          delete e.m_armada_id;
          delete e.m_sopir_id;
          delete e.m_subkon_id;
          delete e.rekening;

          e.biaya_lain_harga_order_arr = e.biaya_lain_harga_order_arr.map(
            (e) => {
              return ` ${e.nama} | ${e.nominal}`;
            }
          );

          e.biaya_lain_uang_jalan_arr = e.biaya_lain_uang_jalan_arr.map((e) => {
            return ` ${e.nama}`;
          });
          e.biaya_lain_harga_jual_arr = e.biaya_lain_harga_jual_arr.map((e) => {
            return ` ${e.nama}`;
          });
          e.penyewa = e.penyewa.nama_perusahaan;
          e.armada = e.armada.nopol;
          e.sopir = e.sopir.nama;
          if (e.subkon != null) {
            e.subkon = e.subkon.nama_perusahaan;
          } else {
            e.subkon = "Bukan kendaraan subkon";
          }
          if (e.status_kendaraan_sendiri == null) {
            e.status_kendaraan_sendiri = "Bukan kendaraan sendiri";
          }
        });
        data = res.data;
      });
    });
  }

  let search = "";
  let color = "light";

  $: dataSearch = search
    ? data.filter((item) =>
        Object.keys(item).some(
          (key) =>
            String(item[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
        )
      )
    : data;

  $: console.log(dataSearch);

  onMount(() => {
    fetchData();
  });

  let showHargaOrderModal = false;

  let dropdownPopoverShowStatusKendaraanSendiri = false;
  let btnDropdownRefStatusKendaraanSendiri;
  let popoverDropdownRefStatusKendaraanSendiri;

  let dropdownPopoverShowStatusSuratJalan = false;
  let btnDropdownRefStatusSuratJalan;
  let popoverDropdownRefStatusSuratJalan;

  let dropdownPopoverShowStatusHargaOrder = false;
  let btnDropdownRefStatusHargaOrder;
  let popoverDropdownRefStatusHargaOrder;

  const toggleDropdownStatusKendaraanSendiri = () => {
    if (dropdownPopoverShowStatusKendaraanSendiri) {
      dropdownPopoverShowStatusKendaraanSendiri = false;
    } else {
      dropdownPopoverShowStatusKendaraanSendiri = true;
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

  const toggleDropdownStatusSuratJalan = () => {
    if (dropdownPopoverShowStatusSuratJalan) {
      dropdownPopoverShowStatusSuratJalan = false;
    } else {
      dropdownPopoverShowStatusSuratJalan = true;
      createPopper(
        btnDropdownRefStatusSuratJalan,
        popoverDropdownRefStatusSuratJalan,
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

  const toggleDropdownStatusHargaOrder = () => {
    if (dropdownPopoverShowStatusHargaOrder) {
      dropdownPopoverShowStatusHargaOrder = false;
    } else {
      dropdownPopoverShowStatusHargaOrder = true;
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

  function toggleHargaOrderModal() {
    showHargaOrderModal = !showHargaOrderModal;
  }
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
                  Data Transaksi Order
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
                  {#each dataSearch as tableData}
                    {#if tableData.status_kendaraan == "Sendiri"}
                      <tr>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          <div class="container mx-autoflex flex-row mb-2">
                            <button
                              bind:this={btnDropdownRefStatusKendaraanSendiri}
                              on:click={toggleDropdownStatusKendaraanSendiri}
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
                              class="bg-white px-3 text-base z-50 float-left py-2 list-none text-left rounded w-24 {dropdownPopoverShowStatusKendaraanSendiri
                                ? 'block'
                                : 'hidden'}"
                            >
                              <Chips
                                onClick={() => {
                                  tableData.status_kendaraan_sendiri =
                                    "Berangkat";
                                }}
                                text="Berangkat"
                                bgColor="#bbf7d0"
                                textColor="#16a34a"
                              />
                              <Chips
                                onClick={() => {
                                  tableData.status_kendaraan_sendiri = "Pulang";
                                }}
                                text="Pulang"
                                bgColor="#fecaca"
                                textColor="#dc2626"
                              />
                              <Chips
                                onClick={() => {
                                  tableData.status_kendaraan_sendiri =
                                    "Kontrak";
                                }}
                                text="Kontrak"
                                bgColor="#fef08a"
                                textColor="#d97706"
                              />
                              <Chips
                                onClick={() => {
                                  tableData.status_kendaraan_sendiri =
                                    "Kota-Kota";
                                }}
                                text="Kota-Kota"
                                bgColor="#bfdbfe"
                                textColor="#2563eb"
                              />
                            </div>
                          </div>
                          {tableData.tanggal_awal}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          <div class="container mx-autoflex flex-row mb-2">
                            <button
                              bind:this={btnDropdownRefStatusSuratJalan}
                              on:click={toggleDropdownStatusSuratJalan}
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
                              class="bg-white px-3 text-base z-50 float-left py-2 list-none text-left rounded w-24 {dropdownPopoverShowStatusSuratJalan
                                ? 'block'
                                : 'hidden'}"
                            >
                              <Chips
                                onClick={() => {
                                  tableData.status_surat_jalan = "Sopir";
                                }}
                                text="Sopir"
                                bgColor="#bbf7d0"
                                textColor="#16a34a"
                              />
                              <Chips
                                onClick={() => {
                                  tableData.status_surat_jalan = "Kantor";
                                }}
                                text="Kantor"
                                bgColor="#fecaca"
                                textColor="#dc2626"
                              />
                              <Chips
                                onClick={() => {
                                  tableData.status_surat_jalan = "Dikirim";
                                }}
                                text="Dikirim"
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
                          {tableData.penyewa} / {tableData.muatan}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.armada} / {tableData.sopir}
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
                              on:click={toggleDropdownStatusHargaOrder}
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
                              class="bg-white px-3 text-base z-50 float-left py-2 list-none text-left rounded w-24 {dropdownPopoverShowStatusHargaOrder
                                ? 'block'
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
                          {tableData.harga_order}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          <button
                            class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            on:click={toggleHargaOrderModal}
                          >
                            Open regular modal
                          </button>
                          {#if tableData.biaya_lain_harga_order_arr.length == 0 && tableData.biaya_lain_harga_jual_arr.length == 0 && tableData.biaya_lain_uang_jalan_arr.length == 0}
                            <p class="text-center">Tidak ada biaya tambahan</p>
                          {:else}
                            {#each tableData.biaya_lain_harga_order_arr as biaya}
                              <p class="text-center">{biaya}</p>
                            {/each}
                            {#each tableData.biaya_lain_harga_jual_arr as biaya}
                              <p class="text-center">{biaya}</p>
                            {/each}
                            {#each tableData.biaya_lain_uang_jalan_arr as biaya}
                              <p class="text-center">{biaya}</p>
                            {/each}
                          {/if}

                          {#if showHargaOrderModal}
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
                                      on:click={toggleHargaOrderModal}
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
                                            class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                          >
                                            <option selected
                                              >Choose an option</option
                                            >
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                          </select>
                                          <input
                                            class="mb-5 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            type="number"
                                            placeholder="Masukkan biaya tambahan"
                                          />
                                          <select
                                            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                          >
                                            <option selected
                                              >Choose an option</option
                                            >
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                          </select>
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
                                      on:click={toggleHargaOrderModal}
                                    >
                                      Close
                                    </button>
                                    <button
                                      class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      on:click={toggleHargaOrderModal}
                                    >
                                      Save Changes
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              class="opacity-25 fixed inset-0 z-40 bg-black"
                            ></div>
                          {/if}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.total_pajak}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.setor}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.uang_jalan}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.potongan_wajib}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.uang_jalan}
                        </td>
                        <td
                          class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {tableData.sisa_tagihan}
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
      </Route>
      <Route path="add">
        <CardInputLaporanTransaksiOrder />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditLaporanTransaksiOrder id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
