<script lang="ts">
  import {
    laporanPengeluaranData,
    laporanPengeluaranLainData,
    laporanPengeluaranSemuaData,
  } from "./stores/PengeluaranStore.ts";
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
  import LaporanServisDetail from "./details/LaporanServisDetail.svelte";
  import CardEditLaporanTransaksiServis from "./edit/CardEditLaporanTransaksiServis.svelte";
  import CardInputPembayaranLaporanTransaksiServis from "./add/CardInputPembayaranLaporanTransaksiServis.svelte";
  import { get, writable } from "svelte/store";
  import CardTablePengeluaran from "../../../notusComponents/Cards/CardTablePengeluaran.svelte";
  import axios from "axios";
  import { onMount } from "svelte";

  const errorImage = "/public/assets/img/error.png";

  let openTab = 1;

  function toggleTabs(tabNumber: number) {
    openTab = tabNumber;
  }

  let armadaData = [];
  let selectedArmada = [];

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
                  >Servis
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
                  Lain-Lain
                </a>
              </li>
              <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  href="#"
                  class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {openTab ===
                  3
                    ? 'text-white bg-red-600'
                    : 'text-red-600 bg-white'}"
                  on:click={() => toggleTabs(3)}
                >
                  Semua
                </a>
              </li>
            </ul>
          </div>
        </div>
        {#if openTab === 1}
          {#await laporanPengeluaranData.getStore()}
            <div>Loading...</div>
          {:then dataServis}
            <CardTablePengeluaran
              jenis={"servis"}
              {armadaData}
              repository={laporanPengeluaranData}
              href="/transaksi/pengeluaran/servis"
              deleteApi={`${mainUrl}/api/master/laporan/servis/`}
              heading="Data Pengeluaran Servis"
              addData={false}
              dataStore={dataServis}
            />
          {:catch e}
            <div>{e}</div>
          {/await}
        {:else if openTab === 2}
          {#await laporanPengeluaranLainData.getStore()}
            <div>Loading...</div>
          {:then data}
            <CardTablePengeluaran
              jenis={"lain"}
              {armadaData}
              href="/transaksi/pengeluaran/lainlain"
              deleteApi={`${mainUrl}/api/master/laporan/servis/`}
              heading="Data Pengeluaran Lain-Lain"
              dataStore={data}
              addData={false}
              repository={laporanPengeluaranLainData}
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
        {:else if openTab === 3}
          {#await laporanPengeluaranSemuaData.getStore()}
            <div>Loading...</div>
          {:then data}
            <CardTablePengeluaran
              jenis={"semua"}

              {armadaData}
              href="/transaksi/pengeluaran/lainlain"
              deleteApi={`${mainUrl}/api/master/laporan/servis/`}
              heading="Data Pengeluaran Lain-Lain"
              dataStore={data}
              addData={false}
              repository={laporanPengeluaranSemuaData}
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
        <LaporanServisDetail id={params.id} type={params.type} />
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
