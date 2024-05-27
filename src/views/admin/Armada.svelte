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

  async function fetchData() {
    var data;
    // fetch(`${mainUrl}/api/getProfile`, {
    //   headers: {
    //     Authorization: `bearer ${getCookie("token")}`,
    //   },
    // }).then((res) => {
    //   res.json().then((res) => {
    //     data = res.data;
    //     console.log(data);
    //     if (data.role.akses.master_armada.view != true) {
    //       navigate("/admin/dashboard");
    //     } else {
    //       fetch(`${mainUrl}/api/master/armada`, {
    //         headers: {
    //           Authorization: `bearer ${getCookie("token")}`,
    //         },
    //       }).then((res) => {
    //         res.json().then((res) => {
    //           res.data.forEach((e) => {
    //             delete e.created_at;
    //             delete e.updated_at;
    //           });
    //           data = res.data;
    //         });
    //       });
    //     }
    //   });
    // });
    // return data;
    const permission = await axios.get(`${mainUrl}/api/getProfile`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });

    if(permission.data.data.role.akses.master_armada.view != true){
      navigate("/admin/dashboard");
    }

    const response = await axios.get(`${mainUrl}/api/master/armada`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    response.data.data.forEach((e) => {
      delete e.created_at;
      delete e.updated_at;
    });
    console.log(response)
    return response.data.data;
  }

  var isDataValid = false;

  async function getData() {
    var cachelife = 5000;
    var localStorageData = localStorage.getItem('armada'); 
    var cacheddata = await JSON.parse(localStorageData);
    if(cacheddata){
     var expired = Date.now() / 1000 - cacheddata.cachetime > cachelife;
    }
    if (cacheddata  && (!expired && isDataValid)){
      data = cacheddata.data;
      isDataValid = true;
    }else{
    //otherwise fetch data from api then save the data in localstorage 
     fetchData().then((res) => {
      var json = {data: res, cachetime: Date.now() / 1000};
      localStorage.setItem('armada', JSON.stringify(json));
      data = res;
      isDataValid = true;
     })
    }
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
          onLoad={getData}
        />
      </Route>
      <Route path="add">
        <CardInputArmada onSuccess={() => isDataValid = false} />
      </Route>
      <Route path="edit/:edit" let:params>
        <CardEditArmada onSuccess={() => isDataValid = false} id={params.edit} />
      </Route>
    </Router>
  </div>
</div>
