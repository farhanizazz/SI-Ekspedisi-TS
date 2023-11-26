<script>
  import axios from "axios";
  import CardInputArmada from "./../../notusComponents/Cards/CardInput/CardInputArmada.svelte";
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
  export let location;

  let data = [];
  const headingArmada = [
    "ID",
    "Nopol",
    "Merk",
    "Jenis",
    "Tanggal STNK",
    "Tanggal Uji Kir",
    "Status STNK",
    "Status Uji Kir",
    "Keterangan",
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
        if (data.role.akses.master_armada.view != true) {
          navigate("/admin/dashboard");
        } else {
          fetch(`${mainUrl}/api/master/armada`, {
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
    <Router route="armada">
      <Route path="">
        <CardTable
          tableHeading={headingArmada}
          href="/admin/armada"
          deleteApi={`${mainUrl}/api/master/armada/`}
          heading="Data Armada"
          {data}
          onLoad={fetchData}
        />
      </Route>
      <Route path="add">
        <CardInputArmada />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditArmada id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
