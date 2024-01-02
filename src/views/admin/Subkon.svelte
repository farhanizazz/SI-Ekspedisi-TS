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
  import { getCookie } from 'svelte-cookie';
  import { mainUrl } from '../../environment';

  let data = [];
  const headingSubkon = [
    "ID",
    "Nama Perusahaan",
    "Alamat",
    "Penanggung Jawab",
    "Keterangan",
  ];

  function fetchData() {
    fetch(`${mainUrl}/api/master/subkon`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`
      }
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
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="subkon">
      <Route path="">
        <CardTable
          tableHeading={headingSubkon}
          href="/admin/subkon"
          deleteApi={`${mainUrl}/api/master/subkon/`}
          heading="Data Subkon"
          {data}
          onLoad={fetchData}
        />
      </Route>
      <Route path="add">
        <CardInputSubkon />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditSubkon id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
