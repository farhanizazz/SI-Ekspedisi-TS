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
  import CardTableHutangSubkon from "./CardTableHutangSubkon.svelte";

  let data = [];
  const headingSubkon = [
    "Tanggal / No Transaksi",
    "Nopol / Sopir / Muatan",
    "Asal / Tujuan",
    "Harga Order",
    "Biaya Tambah / Kurang",
    "PPH / PPN",
    "Sisa Tagihan",
  ];
  const today = new Date();
  let tglAwal = today.toISOString().substring(0, 10);
  let tglAkhir = today.toISOString().substring(0, 10);
  let debounceTimeout;
  let page;
  const currentPage = writable(0);
  let selectedSubkon = [];
  let selectedStatus = 'all';
  let jenis = ""

  function fetchData(tglAwal, tglAkhir, currentPage, subkonId, status) {
    console.log(subkonId);
    if(subkonId != null) {
      fetch(
        `${mainUrl}/api/laporan-v2/hutang-subkon?subkonId=${subkonId}&status=${status}&tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&page=${currentPage + 1}`,
        {
          headers: {
            Authorization: `bearer ${getCookie("token")}`,
          },
        }
      ).then((res) => {
        res.json().then((res) => {
          res.data.list.forEach((e) => {
            delete e.created_at;
            delete e.updated_at;
            delete e.akses;
            if (e.nopol_subkon == null)
              e.nopol_subkon = "Tidak ada data subkon";
            if (e.sopir_subkon == null)
              e.sopir_subkon = "Tidak ada data subkon";
            if (e.armada != null) {
              e.armada = e.armada.nopol;
            } else {
              e.armada = "Tidak ada armada";
            }
            if (e.penyewa != null) {
              e.penyewa = e.penyewa.nama_perusahaan;
            } else {
              e.penyewa = "Tidak ada data penyewa";
            }
            if (e.subkon != null) {
              e.subkon = e.subkon.nama;
            } else {
              e.subkon = "Tidak ada data subkon";
            }
          });
          page = res.data.meta.links.length;
          console.log(page);
          data = res.data.list;
        });
      });
    } else {
      page = 0
      data = []
    }
  }

  let subkonData = [];

  async function getSubkon() {
    const response = await axios.get(`${mainUrl}/api/master/subkon`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    return response.data.data;
  }

  onMount(() => {
    getSubkon().then((res) => {
      subkonData = res;
    });
  });

  $: {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchData(tglAwal, tglAkhir, $currentPage, selectedSubkon, selectedStatus);
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
      <div class="flex flex-row items-center gap-3 my-2 w-3/4">
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
        <h1>Status:</h1>
        <Select
          showChevron={true}
          placeholder=""
          id="grid-penyewa"
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
          items={[{
            value: 'lunas',
            label: 'Lunas'
          }, {
            value: 'belum',
            label: "Belum Lunas"
          }, {
            value: 'all',
            label: "Semua"
          }]}
          bind:justValue={selectedStatus}
          label="label"
          searchable={true}
        />
        <h1>Penyewa:</h1>
        <Select
          showChevron={true}
          placeholder=""
          id="grid-penyewa"
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 z-50"
          items={subkonData.map((penyewa) => ({
            value: penyewa.id,
            label: `${penyewa.nama_perusahaan} | ${penyewa.penanggung_jawab} | ${penyewa.alamat}`,
          }))}
          bind:justValue={selectedSubkon}
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
            `${mainUrl}/api/laporan-v2/hutang-subkon?subkonId=${selectedSubkon}&status=${selectedStatus}&tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&page=${$currentPage + 1}&export=1`
          );
        }}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        <i class="fa-solid fa-print pr-2"></i>Cetak
      </button>
    </div>
    <Router route="roles">
      <Route path="">
        <CardTableHutangSubkon
          tableHeading={headingSubkon}
          href="/admin/roles"
          addData={false}
          withEdit={false}
          heading="Data Hutang Customer"
          {data}
          withDelete={false}
          onLoad={fetchData}
          subtotal="sisa_hutang"
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
