<script>
	import CardEditSubkon from '../../notusComponents/Cards/CardInput/CardEdit/CardEditSubkon.svelte';
	import CardInputSubkon from '../../notusComponents/Cards/CardInput/CardInputSubkon.svelte';
  import CardInputArmada from "../../notusComponents/Cards/CardInput/CardInputArmada.svelte";
  import CardEditSopir from "../../notusComponents/Cards/CardInput/CardEdit/CardEditSopir.svelte";
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  // core components
  import CardSettings from "../../notusComponents/Cards/CardSettings.svelte";
  import CardProfile from "../../notusComponents/Cards/CardProfile.svelte";
  import { Router, Route } from "svelte-routing";
  import CardInputSopir from "../../notusComponents/Cards/CardInput/CardInputSopir.svelte";
  import CardEditArmada from "../../notusComponents/Cards/CardInput/CardEdit/CardEditArmada.svelte";
  import { mainUrl } from '../../environment';
  import CardEditHutangSopir from '../../notusComponents/Cards/CardInput/CardEdit/CardEditHutangSopir.svelte';
  import CardInputHutangSopir from '../../notusComponents/Cards/CardInput/CardInputHutangSopir.svelte';
  import { getCookie } from "svelte-cookie";

  export let location;

  let data = [];
  const headingHutangSopir = [
    "ID",
    "Tanggal Transaksi",
    "Nominal Hutang",
    "Keterangan Transaksi",
    "Nama Sopir"
  ];

  function fetchData() {
    fetch(`${mainUrl}/api/transaksi/hutang_sopir`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`
      }
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          delete e.created_at;
          delete e.updated_at;
          delete e.master_sopir_id
        });
        res.data.forEach((data) => {
          data.master_sopir = data.master_sopir.nama
        })
        data = res.data;
      });
    });
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="subkon">
      <Route path="">
        <CardTable
          tableHeading={headingHutangSopir}
          href="/transaksi/hutangSopir"
          deleteApi={`${mainUrl}/api/transaksi/hutang_sopir/`}
          heading="Data Hutang Sopir"
          {data}
          onLoad={fetchData}
        />
      </Route>
      <Route path="add">
        <CardInputHutangSopir />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditHutangSopir id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
