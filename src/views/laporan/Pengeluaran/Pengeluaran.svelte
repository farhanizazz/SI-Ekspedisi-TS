<script lang="ts">
	import { type LaporanServis } from './models/LaporanModel.ts';
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
  import CardTableLaporan from '../../../notusComponents/Cards/CardTableLaporan.svelte';
  import LaporanServisDetail from './details/LaporanServisDetail.svelte';
  import CardEditLaporanTransaksiServis from './edit/CardEditLaporanTransaksiServis.svelte';
  import CardInputPembayaranLaporanTransaksiServis from './add/CardInputPembayaranLaporanTransaksiServis.svelte';

  let dataServis: LaporanServis[] = [];
  const headingPengeluaran = [
    "ID",
    "Tanggal Servis",
    "Nama Toko",
    "Keterangan / Nama Barang",
    "Harga",
    "Jumlah / Satuan",
    "Sub Total"
  ];

  function fetchDataServis() {
    fetch(`${mainUrl}/api/laporan/servis`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        dataServis = res.data;
      });
    });
  }

  let openTab = 1;

  function toggleTabs(tabNumber: number) {
    openTab = tabNumber;
  }
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
          <CardTableLaporan
            href="/transaksi/pengeluaran/servis"
            deleteApi={`${mainUrl}/api/laporan/servis/`}
            heading="Data Pengeluaran Servis"
            data={dataServis}
            onLoad={fetchDataServis}
          />
        {:else if openTab === 2}
          <!-- <CardTable
            tableHeading={headingPengeluaran}
            href="/transaksi/pengeluaran/lain-lain"
            deleteApi={`${mainUrl}/api/transaksi/`}
            heading="Data Pengeluaran Lain-Lain"
            {data}
            onLoad={fetchData}
          /> -->
        {/if}
      </Route>
      <Route path="servis/add">
        <CardInputLaporanTransaksiServis />
      </Route>
      <Route path="servis/laporan/:id" let:params>
        <LaporanServisDetail id={params.id} />
      </Route>
      <Route path="lain-lain/add">
        <CardInputLaporanTransaksiLainLain />
      </Route>
      <Route path="servis/edit/:edit" let:params>
        <CardEditLaporanTransaksiServis id={params.edit} />
      </Route>
      <Route path="servis/laporan/:id/add/" let:params>
        <CardInputPembayaranLaporanTransaksiServis id={params.id} />
      </Route>
    </Router>
  </div>
</div>
