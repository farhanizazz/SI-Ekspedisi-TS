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
  const headingBukuBesar = ["Nomor", "Tanggal", "No Transaksi", "Keterangan", "Debet", "Kredit", "Saldo"];
  const today = new Date();
  let tglAwal = today.toISOString().substring(0, 10);
  let tglAkhir = today.toISOString().substring(0, 10);
  let debounceTimeout;
  let page;
  const currentPage = writable(0);
  let selectedRekening = [];

  function transformData(data) {
    return {
      "Nomor": data.no == undefined ? '' : data.no,
      "Tanggal": data.tanggal,
      "NoTransaksi": data.no_transaksi,
      "Keterangan": data.keterangan == null ? '-' : data.keterangan,
      "Debet": data.kredit,
      "Kredit": data.debet,
      "Saldo": data.total,
    };
  }

  function fetchData(tglAwal, tglAkhir, currentPage, rekeningId) {
    fetch(
      `${mainUrl}/api/laporan-v2/buku-besar?tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&page=${currentPage + 1}&rekeningId=${rekeningId == null ? "all" : rekeningId}`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    ).then((res) => {
      res.json().then((res) => {
        res.data.list = res.data.list.map((e) => transformData(e));
        // page = res.data.meta.links.length;
        page = Math.ceil(res.data.list.length/20)

        console.log(res.data.list);
        data = res.data.list;
      });
    });
  }

  let rekeningData = [];

  async function getArmada() {
    const response = await axios.get(`${mainUrl}/api/master/rekening`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    return response.data.data;
  }

  onMount(() => {
    getArmada().then((res) => {
      rekeningData = res;
    });
  });

  $: {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchData(tglAwal, tglAkhir, $currentPage, selectedRekening);
    }, 1000); // Adjust the delay as needed (500ms in this case)
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <div style="display: flex; justify-content: center; align-items: center;">
      <Pagination
        onLast={() => {
          fetchData(tglAwal, tglAkhir, $currentPage + 1, selectedRekening);
        }}
        onFirst={() => {
          fetchData(tglAwal, tglAkhir, $currentPage + 1, selectedRekening);
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
        <h1>Rekening:</h1>
        <Select
          showChevron={true}
          placeholder=""
          id="grid-penyewa"
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
          items={rekeningData.map((rekening) => ({
            value: rekening.id,
            label: `${rekening.nama_bank} | ${rekening.nomor_rekening} | ${rekening.atas_nama}`,
          }))}
          bind:justValue={selectedRekening}
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
            `${mainUrl}/api/laporan-v2/buku-besar?tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&rekeningId=${selectedRekening == null ? "" : selectedRekening}&export=true`
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
          tableHeading={headingBukuBesar}
          href="/admin/roles"
          addData={false}
          withEdit={false}
          heading="Laporan Buku Besar"
          {data}
          withDelete={false}
          onLoad={fetchData}
          subtotal="Total"
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
