<script>
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  // core components
  import { Router, Route } from "svelte-routing";
  import { getCookie } from 'svelte-cookie';
  import { mainUrl } from '../../environment';
  import CardInputRoles from '../../notusComponents/Cards/CardInput/CardInputRoles.svelte';
  import CardEditRoles from '../../notusComponents/Cards/CardInput/CardEdit/CardEditRoles.svelte';

  let data = [];
  const headingSubkon = [
    "ID",
    "Akses",
  ];

  function fetchData() {
    fetch(`${mainUrl}/api/master/roles`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`
      }
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          delete e.created_at;
          delete e.updated_at;
          delete e.akses;
        });
        data = res.data;
      });
    });
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="roles">
      <Route path="">
        <CardTable
          tableHeading={headingSubkon}
          href="/admin/roles"
          deleteApi={`${mainUrl}/api/master/roles/`}
          heading="Data Roles"
          {data}
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
