<script>
  // core components
  import CardLineChart from "../../notusComponents/Cards/CardLineChart.svelte";
    import CardBarChart from "../../notusComponents/Cards/CardBarChart.svelte";
  import CardPageVisits from "../../notusComponents/Cards/CardPageVisits.svelte";
  // import CardSocial from "components/Cards/CardSocial.svelte";
  import CardTable from "../../notusComponents/Cards/CardTable.svelte";
  import { onMount } from "svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../environment";
  export let location;

  const headingPenyewa = [
    "ID",
    "Nama Perusahaan",
    "Alamat",
    "Penanggung Jawab",
    "Kontak Person",
    "Keterangan",
  ];

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

  let dataPenyewa;
  function fetchDataPenyewa() {
    fetch(`${mainUrl}/api/master/penyewa`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`
      }
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          delete e.created_at;
          delete e.updated_at;
        });
        dataPenyewa = res.data;
      });
    });
  }

  let dataSopir;
  function fetchDataSopir() {
    fetch(`${mainUrl}/api/master/sopir`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`
      }
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          delete e.created_at;
          delete e.updated_at;
        });
        dataSopir = res.data;
      });
    });
  }
</script>

<div>
  <div class="flex flex-wrap">
    <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
      <CardLineChart />
    </div>
    <div class="w-full xl:w-4/12 px-4">
      <CardBarChart />
    </div>
  </div>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 xl:mb-0 px-4">
      <CardTable
        href="/admin/penyewa/add"
        heading="Data Penyewa"
        tableHeading={headingPenyewa}
        data={dataPenyewa}
        onLoad={fetchDataPenyewa}
      />
      <!-- <CardPageVisits /> -->
    </div>
    <div class="w-full px-4">
      <CardTable
        href="/admin/sopir"
        deleteApi={`${mainUrl}/api/master/sopir/`}
        heading="Data Supir"
        tableHeading={headingSopir}
        data={dataSopir}
        onLoad={fetchDataSopir}
      />
      <!-- <CardSocial /> -->
    </div>
  </div>
</div>
