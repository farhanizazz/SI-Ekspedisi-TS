<script>
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  import CardEditPenyewa from "../../notusComponents/Cards/CardInput/CardEdit/CardEditPenyewa.svelte";
  import { afterUpdate, beforeUpdate, onMount } from "svelte";
  import { Router, Route, navigate } from "svelte-routing";
  // core components
  import CardInputPenyewa from "../../notusComponents/Cards/CardInput/CardInputPenyewa.svelte";
  import CardProfile from "../../notusComponents/Cards/CardProfile.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../environment";

  let data = [];
  const headingPenyewa = [
    "ID",
    "Nama Perusahaan",
    "Alamat",
    "Penanggung Jawab",
    "Kontak Person",
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
        if (data.role.akses.master_penyewa.view != true) {
          console.log("unauthorized");
          navigate("/admin/dashboard");
        } else {
          fetch(`${mainUrl}/api/master/penyewa`, {
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
    <Router route="penyewa">
      <Route path="">
        <CardTable
          onLoad={fetchData}
          tableHeading={headingPenyewa}
          href="/admin/penyewa"
          deleteApi={`${mainUrl}/api/master/penyewa/`}
          heading="Data Penyewa"
          {data}
        />
      </Route>
      <Route path="add">
        <CardInputPenyewa />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditPenyewa id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
