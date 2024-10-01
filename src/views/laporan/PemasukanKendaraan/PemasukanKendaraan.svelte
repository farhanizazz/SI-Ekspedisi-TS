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
  import Select from "svelte-select";
  import { onMount } from "svelte";
  import axios from "axios";

  let data = [];
  let headingSubkon = [];
  const today = new Date();
  let tglAwal = today.toISOString().substring(0, 10);
  let tglAkhir = today.toISOString().substring(0, 10);
  let debounceTimeout;
  let page;
  const currentPage = writable(0);
  let jenis = "sendiri";
  let armadaData = [];
  let selectedArmada = "";

  $: {
    if (jenis === "sendiri") {
      headingSubkon = [
        "Tanggal",
        "Nomor Transaksi",
        "Status",
        "Status Kendaraan",
        "Armada",
        "Nama Sopir",
        "Nopol Subkon",
        "Sopir Subkon",
        "Perusahaan Penyewa",
        "Tujuan",
        "Setor",
      ];
    } else if (jenis === "subkon") {
      headingSubkon = [
        "Tanggal",
        "Nomor Transaksi",
        "Status",
        "Status Kendaraan",
        "Armada",
        "Nama Sopir",
        "Perusahaan Penyewa",
        "Subkon",
        "Muatan",
        "Asal",
        "Tujuan",
      ];
    }
  }

  function fetchData(tglAwal, tglAkhir, currentPage, armadaId) {
    fetch(
      `${mainUrl}/api/laporan/pemasukan-kendaraan-${jenis}?tanggal_awal=${tglAwal}&tanggal_akhir=${tglAkhir}&page=${currentPage + 1}&m_armada_id=${armadaId}`,
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
          if (jenis == "subkon") {
            e.subkon = e.subkon.nama_perusahaan;
            delete e.armada;
            delete e.sopir;
            delete e.setor;
          }
        });
        page = res.data.meta.links.length;
        console.log(page);
        data = res.data.list;
      });
    });
  }
  
  async function getArmada() {
    const response = await axios.get(`${mainUrl}/api/master/armada`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    return response.data.data
  }

    onMount(() => {
      getArmada().then((res) => {
        armadaData = res
        console.log(armadaData);
      })
    })

  $: {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      jenis;
      fetchData(tglAwal, tglAkhir, $currentPage, selectedArmada);
    }, 1000);
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <div class="w-full">
      <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
          <a
            href="#"
            class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {jenis ===
            'sendiri'
              ? 'text-white bg-red-600'
              : 'text-red-600 bg-white'}"
            on:click={() => {
              jenis = "sendiri";
              currentPage.set(0);
            }}
          >
            Sendiri
          </a>
        </li>
        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
          <a
            href="#"
            class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {jenis ===
            'subkon'
              ? 'text-white bg-red-600'
              : 'text-red-600 bg-white'}"
            on:click={() => {
              jenis = "subkon";
              currentPage.set(0);
            }}
          >
            Subkon
          </a>
        </li>
      </ul>
    </div>
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

    <div class="flex flex-row items-center gap-3 my-2  w-1/2">
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
          addData={false}
          tableHeading={headingSubkon}
          href="/admin/roles"
          withEdit={false}
          heading="Laporan Pemasukan Kendaraan"
          {data}
          withDelete={false}
          onLoad={fetchData}
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
