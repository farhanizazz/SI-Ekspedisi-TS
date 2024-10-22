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
    "Tanggal",
    "Nomor Transaksi",
    "Status",
    "Status Kendaraan",
    "Armada",
    "Nama Sopir",
    "Nopol Subkon",
    "Sopir Subkon",
    "Perusahaan Penyewa",
    "Subkon",
    "Muatan",
    "Asal",
    "Tujuan",
    "Pemasukan",
  ];
  const today = new Date();
  let tglAwal = today.toISOString().substring(0, 10);
  let tglAkhir = today.toISOString().substring(0, 10);
  let debounceTimeout;
  let page;
  const currentPage = writable(0);
  let selectedArmada = [];
  

  function fetchData(tglAwal, tglAkhir, currentPage, armadaId) {
    fetch(
      `${mainUrl}/api/laporan/pemasukan-cv?tanggal_awal=${tglAwal}&tanggal_akhir=${tglAkhir}&page=${currentPage + 1}&m_armada_id=[${armadaId == null ? '' : armadaId}]`,
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
          if (e.nopol_subkon == null) e.nopol_subkon = "Tidak ada data subkon";
          if (e.sopir_subkon == null) e.sopir_subkon = "Tidak ada data subkon";
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
          if (e.sopir != null) {
            e.sopir = e.sopir.nama;
          } else {
            e.sopir = "Tidak ada data sopir";
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
      console.log(armadaData);
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
        multiple
        showChevron={true}
        placeholder=""
        id="grid-penyewa"
        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
        items={armadaData.map((armada) => ({
          value: armada.id,
          label: `${armada.nopol} | ${armada.jenis} | ${armada.merk}`
        }))}
        bind:justValue={selectedArmada}
        label="label"
        searchable={true}
      />
    </div>
    <Router route="roles">
      <Route path="">
        <CardTable
          tableHeading={headingSubkon}
          href="/admin/roles"
          addData={false}
          withEdit={false}
          heading="Data Roles"
          {data}
          withDelete={false}
          onLoad={fetchData}
          subtotal='pemasukan'
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
