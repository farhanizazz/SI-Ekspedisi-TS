<script>
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  import { Router, Route } from "svelte-routing";
  import CardInputRekening from "../../notusComponents/Cards/CardInput/CardInputRekening.svelte";
  import CardEditRekening from "../../notusComponents/Cards/CardInput/CardEdit/CardEditRekening.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../environment";
  import CardInputTambahan from "../../notusComponents/Cards/CardInput/CardInputTambahan.svelte";
  import CardEditTambahan from "../../notusComponents/Cards/CardInput/CardEdit/CardEditTambahan.svelte";

  let data = [];
  const headingRekening = [
    "ID",
    "Nama",
    "Sifat",
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
          fetch(`${mainUrl}/api/master/tambahan`, {
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
    <Router route="tambahan">
      <Route path="">
        <CardTable
          tableHeading={headingRekening}
          href="/admin/tambahan"
          deleteApi={`${mainUrl}/api/master/tambahan/`}
          heading="Data Tambahan"
          {data}
          onLoad={fetchData}
        />
      </Route>
      <Route path="add">
        <CardInputTambahan/>
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditTambahan id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
