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
  let total = {
    pemasukan_setor: 0,
    pengeluaran_servis: 0,
    total_akhir: 0
  };
  const headingSubkon = [
    "Nopol",
    "Pemasukan Setor",
    "Pengeluaran Servis",
    "Total",
  ];
  let IDRFormatter = new Intl.NumberFormat("id-ID");
  const today = new Date();
  let tglAwal = today.toISOString().substring(0, 10);
  let tglAkhir = today.toISOString().substring(0, 10);
  let debounceTimeout;
  let page;
  const currentPage = writable(0);
  let selectedArmada = [];

  function transformData(data) {
    return {
      Nopol: data.nopol,
      "Pemasukan Setor": data.pemasukan_setor, // Using formatted currency
      "Pengeluaran Servis": data.pengeluaran_servis, // Using formatted currency
      Total: data.pemasukan_setor - Math.abs(data.pengeluaran_servis),
    };
  }

  function fetchData(tglAwal, tglAkhir, currentPage, armadaId) {
    fetch(
      `${mainUrl}/api/laporan-v2/armada-rugi-laba?tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&page=${currentPage + 1}&armadaId=${armadaId == null ? "all" : armadaId}`,
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
        total = res.data.total;
      });
    });
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
      fetchData(tglAwal, tglAkhir, $currentPage, selectedArmada);
    }, 1000); // Adjust the delay as needed (500ms in this case)
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <div style="display: flex; justify-content: center; align-items: center;">
      <Pagination
        onLast={() => {
          fetchData(tglAwal, tglAkhir, $currentPage + 1, selectedArmada);
        }}
        onFirst={() => {
          fetchData(tglAwal, tglAkhir, $currentPage + 1, selectedArmada);
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
        <h1>Armada:</h1>
        <Select
          showChevron={true}
          placeholder=""
          id="grid-penyewa"
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
          items={armadaData.map((armada) => ({
            value: armada.id,
            label: `${armada.nopol} | ${armada.merk} | ${armada.jenis}`,
          }))}
          bind:justValue={selectedArmada}
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
            `${mainUrl}/api/laporan-v2/armada-rugi-laba?tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&armadaId=${selectedArmada == null ? "" : selectedArmada}&export=true`
          );
        }}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        <i class="fa-solid fa-print pr-2"></i>Cetak
      </button>
    </div>
    <div
      class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
    >
      <div class="rounded-t mb-0 px-4 py-3 border-0">
        <div class="flex flex-wrap items-center">
          <div
            class="relative w-full px-4 max-w-full flex-grow flex flex-1 flex-col"
          >
            <p>Pemasukan Setor: { "Rp. " + IDRFormatter.format(total.pemasukan_setor)}</p>
            <p>Pengeluaran Servis: { "Rp. " + IDRFormatter.format(total.pengeluaran_servis)}</p>
            <p>Total Akhir: { "Rp. " + IDRFormatter.format(total.total_akhir)}</p>
          </div>
        </div>
      </div>
    </div>
    <Router route="roles">
      <Route path="">
        <CardTable
          tableHeading={headingSubkon}
          href="/admin/roles"
          addData={false}
          withEdit={false}
          heading="Laporan Rugi Laba"
          {data}
          withDelete={false}
          onLoad={fetchData}
          subtotal="Total"
        />
      </Route>
    </Router>
  </div>
</div>
