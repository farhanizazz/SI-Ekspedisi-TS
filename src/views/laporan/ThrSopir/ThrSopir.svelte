<script>
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

  let data = [];
  const headingSubkon = [
    "Tanggal Transaksi",
    "Status",
    "Nopol",
    "Penyewa",
    "Muatan",
    "Asal - Tujuan",
    "Potongan THR",
  ];
  const today = new Date();
  let tglAwal = today.toISOString().substring(0, 10);
  let tglAkhir = today.toISOString().substring(0, 10);
  let debounceTimeout;
  let page;
  const currentPage = writable(0);
  let selectedSopir = [];

  function transformData(data) {
    // Extract date from "no_transaksi"
    const match = data.no_transaksi.match(/\.(\d{8})\./);
    let transactionDate = "";

    if (match) {
      const dateString = match[1];
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      transactionDate = `${day}-${month}-${year}`; // Format as dd-mm-yyyy
    }

    return {
      "Tanggal Transaksi": transactionDate,
      Status: data.status,
      Nopol: data.nopol,
      Penyewa: data.penyewa,
      Muatan: data.muatan,
      "Asal-Tujuan": `${data.asal} - ${data.tujuan}`,
      "Potongan THR": data.potongan_thr,
    };
  }

  function fetchData(tglAwal, tglAkhir, currentPage, sopirId) {
    fetch(
      `${mainUrl}/api/laporan-v2/thr-sopir?tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&page=${currentPage + 1}&sopirId=${sopirId == null ? "" : sopirId}`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    ).then((res) => {
      res.json().then((res) => {
        res.data.list = res.data.list.map((e) => transformData(e));
        page = res.data.meta.links.length;

        console.log(res.data.list);
        data = res.data.list;
      });
    });
  }

  let sopirData = [];

  async function getSopir() {
    const response = await axios.get(`${mainUrl}/api/master/sopir`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    return response.data.data;
  }

  onMount(() => {
    getSopir().then((res) => {
      sopirData = res;
    });
  });

  $: {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchData(tglAwal, tglAkhir, $currentPage, selectedSopir);
    }, 1000); // Adjust the delay as needed (500ms in this case)
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <div style="display: flex; justify-content: center; align-items: center;">
      <Pagination
        onLast={() => {
          fetchData(tglAwal, tglAkhir, $currentPage + 1);
        }}
        onFirst={() => {
          fetchData(tglAwal, tglAkhir, $currentPage + 1);
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
        <h1>Sopir:</h1>
        <Select
          showChevron={true}
          placeholder=""
          id="grid-penyewa"
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
          items={sopirData.map((sopir) => ({
            value: sopir.id,
            label: `${sopir.nama} | ${sopir.status}`,
          }))}
          bind:justValue={selectedSopir}
          label="label"
          searchable={true}
        />
      </div>
      <button
        on:click={() => {
          if (data.length == 0) {
            alert("Data kosong, gagal mencetak laporan");
            return;
          }
          window.open(
            `${mainUrl}/api/laporan-v2/thr-sopir?tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&sopirId=${selectedSopir == null ? "" : selectedSopir}`
          );
        }}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        <i class="fa-solid fa-print pr-2"></i>Cetak
      </button>
    </div>
    <Router route="roles">
      <Route path="">
        <CardTable
          tableHeading={headingSubkon}
          href="/admin/roles"
          addData={false}
          withEdit={false}
          heading="Laporan THR Potongan Wajib Sopir"
          {data}
          withDelete={false}
          onLoad={fetchData}
          subtotal="Potongan THR"
        />
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
