<script>
  import CardEditSopir from "../../notusComponents/Cards/CardInput/CardEdit/CardEditSopir.svelte";
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  // core components
  import CardSettings from "../../notusComponents/Cards/CardSettings.svelte";
  import CardProfile from "../../notusComponents/Cards/CardProfile.svelte";
  import { Router, Route } from "svelte-routing";
  import CardInputSopir from "../../notusComponents/Cards/CardInput/CardInputSopir.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../environment";
  export let location;

  let data = [];
  const headingSopir = [
    "ID",
    "Nama Supir",
    "Alamat",
    "KTP",
    "SIM",
    "Nomor HP",
    "Keterangan",
    "Tanggal bergabung",
  ];

  function fetchData() {
    fetch(`${mainUrl}/api/getProfile`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        data = res.data;
        console.log(data);
        if (data.role.akses.master_sopir.view != true) {
          navigate("/admin/dashboard");
        } else {
          fetch(`${mainUrl}/api/master/sopir`, {
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
      });
    });
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <Router route="sopir">
      <Route path="">
        <CardTable
          tableHeading={headingSopir}
          href="/admin/sopir"
          deleteApi={`${mainUrl}/api/master/sopir/`}
          heading="Data Supir"
          {data}
          onLoad={fetchData}
        />
      </Route>
      <Route path="add">
        <CardInputSopir />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditSopir id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
