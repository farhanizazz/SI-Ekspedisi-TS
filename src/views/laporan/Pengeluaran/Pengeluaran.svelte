<script lang="ts">
	import { laporanLainData, laporanServisData } from './stores/PengeluaranStore.ts';
  import CardTableLaporanLain from "./../../../notusComponents/Cards/CardTableLaporanLain.svelte";
  import {
    LaporanServisRepository,
    laporanLainLainRepository,
  } from "./../../../data/repository/laporanServisRepository.js";
  import { type LaporanServis } from "./models/LaporanModel.ts";
  import CardEditSubkon from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditSubkon.svelte";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  // core components
  import CardSettings from "../../../notusComponents/Cards/CardSettings.svelte";
  import CardProfile from "../../../notusComponents/Cards/CardProfile.svelte";
  import { Router, Route } from "svelte-routing";
  import CardInputSopir from "../../../notusComponents/Cards/CardInput/CardInputSopir.svelte";
  import CardEditArmada from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditArmada.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../../environment";
  import CardInputLaporanTransaksi from "../../../notusComponents/Cards/CardInput/CardInputLaporanTransaksi.svelte";
  import CardInputLaporanTransaksiServis from "./add/CardInputLaporanTransaksiServis.svelte";
  import CardInputLaporanTransaksiLainLain from "./edit/CardEditLaporanTransaksiLainLain.svelte";
  import CardTableLaporan from "../../../notusComponents/Cards/CardTableLaporan.svelte";
  import LaporanServisDetail from "./details/LaporanServisDetail.svelte";
  import CardEditLaporanTransaksiServis from "./edit/CardEditLaporanTransaksiServis.svelte";
  import CardInputPembayaranLaporanTransaksiServis from "./add/CardInputPembayaranLaporanTransaksiServis.svelte";
  import { get, writable } from "svelte/store";

  const errorImage = "/public/assets/img/error.png";
  let dataServis: LaporanServis[] = [];
  const headingPengeluaran = [
    "ID",
    "Tanggal Servis",
    "Nama Toko",
    "Keterangan / Nama Barang",
    "Harga",
    "Jumlah / Satuan",
    "Sub Total",
  ];

  let openTab = 1;

  function toggleTabs(tabNumber: number) {
    openTab = tabNumber;
  }
  let currentPage = writable(0);
  let currentSearch = "";
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="pengeluaran">
      <Route path="">
        <div class="flex flex-wrap">
          <div class="w-full">
            <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
              <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  href="#"
                  class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {openTab ===
                  1
                    ? 'text-white bg-red-600'
                    : 'text-red-600 bg-white'}"
                  on:click={() => toggleTabs(1)}
                >
                  <i class="fas fa-cog text-base mr-1" /> Servis
                </a>
              </li>
              <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  href="#"
                  class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {openTab ===
                  2
                    ? 'text-white bg-red-600'
                    : 'text-red-600 bg-white'}"
                  on:click={() => toggleTabs(2)}
                >
                  <i class="fas fa-briefcase text-base mr-1" /> Lain-Lain
                </a>
              </li>
            </ul>
          </div>
        </div>
        {#if openTab === 1}
            {#await laporanServisData.getStore()}
              <div>Loading...</div>
            {:then dataServis}
              <CardTableLaporan
                repository={laporanServisData}
                href="/transaksi/pengeluaran/servis"
                deleteApi={`${mainUrl}/api/laporan/servis/`}
                heading="Data Pengeluaran Servis"
                dataStore={dataServis}
              />
            {:catch e}
              <div>{e}</div>
            {/await}
        {:else if openTab === 2}
          {#await laporanLainData.getStore()}
            <div>Loading...</div>
          {:then data}
            <CardTableLaporanLain
              href="/transaksi/pengeluaran/lain-lain"
              deleteApi={`${mainUrl}/api/laporan/servis/`}
              heading="Data Pengeluaran Lain-Lain"
              dataStore={data}
              repository={laporanLainData}
            />
          {:catch error}
            <div
              class="flex flex-col items-center justify-center text-center"
              style="height: calc(100vh - 340px);"
            >
              <img class="mb-4 h-72" src={errorImage} alt="Error" />
              <h2 class="font-semibold text-gray-400">
                Maaf, telah terjadi gangguan server, silahkan coba lagi
              </h2>
            </div>
          {/await}
        {/if}
      </Route>
      <Route path=":type/add/" let:params>
        <CardInputLaporanTransaksiServis type={params.type} />
      </Route>
      <Route path=":type/laporan/:id" let:params>
        <LaporanServisDetail id={params.id} type={params.type}/>
      </Route>
      <!-- <Route path="lain-lain/add">
        <CardInputLaporanTransaksiLainLain />
      </Route> -->
      <Route path=":type/edit/:edit" let:params>
        <CardEditLaporanTransaksiServis id={params.edit} type={params.type} />
      </Route>
      <Route path="servis/laporan/:id/add/" let:params>
        <CardInputPembayaranLaporanTransaksiServis id={params.id} />
      </Route>
    </Router>
  </div>
</div>
