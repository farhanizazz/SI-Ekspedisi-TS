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
  import CardTableHutangSopir from "./CardTableHutangSopir.svelte";
  import { hutangSopirData, hutangSopirDetailData } from "./stores/hutangSopirStore";
  import CardTableHutangSopirDetail from "./CardTableHutangSopirDetail.svelte";

  export let location;
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="">
      <Route path="">
        {#await hutangSopirData.getStore()}
        <CardTable heading="Data Hutang Sopir" data={[]} href="" deleteApi="" tableHeading={["Nama Sopir", "Nominal Hutang", "Action"]}/>
        {:then dataHutangSopir}
          <CardTableHutangSopir
            repository={hutangSopirData}
            href="/transaksi/hutangSopir"
            deleteApi={`${mainUrl}/api/transaksi/hutang-sopir/`}
            heading="Data Hutang Sopir"
            dataStore={dataHutangSopir}
          />
        {:catch e}
          <div>Error: {e.message}</div>
        {/await}
      </Route>
      <Route path="add">
        <CardInputHutangSopir />
      </Route>
      <Route path=":id" let:params>
        {#await hutangSopirDetailData.getStore(params.id)}
        <div class="pt-10"></div>
        <CardTable heading="Data Hutang Sopir Detail" data={[]} href="" deleteApi="" tableHeading={["Tanggal Transaksi", "Nominal Hutang", "Keterangan Transaksi", "Action"]}/>
        {:then dataServis}
          <CardTableHutangSopirDetail 
            repository={hutangSopirDetailData}
            href="/transaksi/hutangSopir"
            deleteApi={`${mainUrl}/api/transaksi/hutang-sopir/`}
            heading="Data Hutang Sopir Detail"
            dataStore={dataServis}
            id={params.id}
          />
        {:catch e}
          <div>Error: {e.message}</div>
        {/await}
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditHutangSopir id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
