<script lang="ts">
  import CardEditSubkon from "../../notusComponents/Cards/CardInput/CardEdit/CardEditSubkon.svelte";
  import CardInputSubkon from "../../notusComponents/Cards/CardInput/CardInputSubkon.svelte";
  import CardInputArmada from "../../notusComponents/Cards/CardInput/CardInputArmada.svelte";
  import CardEditSopir from "../../notusComponents/Cards/CardInput/CardEdit/CardEditSopir.svelte";
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  // core components
  import CardSettings from "../../notusComponents/Cards/CardSettings.svelte";
  import CardProfile from "../../notusComponents/Cards/CardProfile.svelte";
  import { Router, Route } from "svelte-routing";
  import CardInputSopir from "../../notusComponents/Cards/CardInput/CardInputSopir.svelte";
  import CardEditArmada from "../../notusComponents/Cards/CardInput/CardEdit/CardEditArmada.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../environment";
  import CardInputLaporanTransaksi from "../../notusComponents/Cards/CardInput/CardInputLaporanTransaksi.svelte";

  let data = [];
  const headingPengeluaran = [
    "ID",
    "Nama Perusahaan",
    "Alamat",
    "Keterangan",
    "Penanggung Jawab",
  ];

  function fetchData() {
    fetch(`${mainUrl}/api/pengeluaran`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          delete e.created_at;
          delete e.updated_at;
        });
        data = res.data;
      });
    });
  }

  let openTab = 1;

  function toggleTabs(tabNumber) {
    openTab = tabNumber;
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="subkon">
      <Route path="">
        {#if openTab === 1}
          <CardTable
            tableHeading={headingPengeluaran}
            href="/transaksi/pengeluaran"
            deleteApi={`${mainUrl}/api/transaksi/`}
            heading="Data Pengeluaran Servis"
            {data}
            onLoad={fetchData}
          />
        {:else if openTab === 2}
          <CardTable
            tableHeading={headingPengeluaran}
            href="/transaksi/pengeluaran"
            deleteApi={`${mainUrl}/api/transaksi/`}
            heading="Data Pengeluaran Lain-Lain"
            {data}
            onLoad={fetchData}
          />
        {/if}

          <div class="flex flex-wrap">
            <div class="w-full">
              <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    href="#pablo"
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
                    href="#pablo"
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
      </Route>
      <Route path="add">
        <CardInputLaporanTransaksi />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditSubkon id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
