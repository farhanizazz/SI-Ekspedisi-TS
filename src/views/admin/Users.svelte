<script>
	import CardEditUsers from '../../notusComponents/Cards/CardInput/CardEdit/CardEditUsers.svelte';
	import CardInputUsers from '../../notusComponents/Cards/CardInput/CardInputUsers.svelte';
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  // core components
  import { Router, Route } from "svelte-routing";
  import { getCookie } from 'svelte-cookie';
  import { mainUrl } from '../../environment';

  let data = [];
  const headingSubkon = [
    "ID",
    "Nama Pegawai",
    "Username",
    "Email",
    "Nama Hak Akses",
  ];

  function fetchData() {
    fetch(`${mainUrl}/api/master/user`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`
      }
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          delete e.created_at;
          delete e.updated_at;
          delete e.email_verified_at;
          delete e.m_role_id;
          if(e.role !== null) {
            e.role = e.role.name;
          } else {
            e.role = "Tidak ada hak akses";
          }
        });
        data = res.data;
      });
    });
  }

</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="users">
      <Route path="">
        <CardTable
          tableHeading={headingSubkon}
          href="/admin/users"
          deleteApi={`${mainUrl}/api/master/user/`}
          heading="Data Pegawai"
          {data}
          onLoad={fetchData}
        />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditUsers id={params.edit} />
      </Route>
      <Route path="add">
        <CardInputUsers/>
      </Route>
    </Router>
  </div>
</div>
