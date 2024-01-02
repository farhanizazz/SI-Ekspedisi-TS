<script>
	import CardTableRekening from './../../notusComponents/Cards/CardTableRekening.svelte';
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  import { Router, Route } from "svelte-routing";
  import CardInputRekening from "../../notusComponents/Cards/CardInput/CardInputRekening.svelte";
  import CardEditRekening from "../../notusComponents/Cards/CardInput/CardEdit/CardEditRekening.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../environment";
  export let location;

  let data = [];
  const headingRekening = [
    "ID",
    "Nama",
    "Nama Bank",
    "Nomor Rekening",
    ];

  function fetchData() {
    fetch(`${mainUrl}/api/getProfile`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        console.log(res)
        if (res.data.role.akses.master_rekening.view != true) {
          navigate("/admin/dashboard");
        } else {
          fetch(`${mainUrl}/api/master/rekening`, {
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
              console.log(data);
            });
          });
        }
      });
    });
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="rekening">
      <Route path="">
        <CardTableRekening
          tableHeading={headingRekening}
          href="/admin/rekening"
          deleteApi={`${mainUrl}/api/master/rekening/`}
          heading="Data Rekening"
          {data}
          onLoad={fetchData}
        />
      </Route>
      <Route path="add">
        <CardInputRekening />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditRekening id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
