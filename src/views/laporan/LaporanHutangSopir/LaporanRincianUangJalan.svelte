<script>
  import CardEditSubkon from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditSubkon.svelte";
  import CardInputSubkon from "../../../notusComponents/Cards/CardInput/CardInputSubkon.svelte";
  import CardInputArmada from "../../../notusComponents/Cards/CardInput/CardInputArmada.svelte";
  import CardEditSopir from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditSopir.svelte";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  // core components
  import CardSettings from "../../../notusComponents/Cards/CardSettings.svelte";
  import CardProfile from "../../../notusComponents/Cards/CardProfile.svelte";
  import { Router, Route } from "svelte-routing";
  import CardInputSopir from "../../../notusComponents/Cards/CardInput/CardInputSopir.svelte";
  import CardEditArmada from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditArmada.svelte";
  import { mainUrl } from "../../../environment";
  import CardEditHutangSopir from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditHutangSopir.svelte";
  import CardInputHutangSopir from "../../../notusComponents/Cards/CardInput/CardInputHutangSopir.svelte";
  import { getCookie } from "svelte-cookie";
  import CardTableHutangSopir from "./CardTableLaporanRincianUangJalan.svelte";
  import { laporanHutangSopirData } from "./stores/laporanHutangSopirStore";
  import CardTableHutangSopirDetail from "./CardTableLaporanRincianUangJalanDetail.svelte";
  import { onMount } from "svelte";
  import axios from "axios";

  export let location;
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
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="">
      <Route path="">
        {#await laporanHutangSopirData.getStore()}
          <CardTable
            heading="Data Hutang Sopir"
            data={[]}
            href=""
            deleteApi=""
            tableHeading={["Nama Sopir", "Nominal Hutang", "Action"]}
          />
        {:then dataHutangSopir}
          <CardTableHutangSopir
            withEdit={false}
            repository={laporanHutangSopirData}
            href="/transaksi/hutangSopir"
            deleteApi={`${mainUrl}/api/transaksi/hutang-sopir/`}
            heading="Data Hutang Sopir"
            dataStore={dataHutangSopir}
            sopirData={sopirData}
          />
        {:catch e}
          <div>Error: {e.message}</div>
        {/await}
      </Route>
    </Router>
  </div>
</div>
