<script>
  import { Router, Route } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  import { mainUrl } from "../../../environment";
  import axios from "axios";
  import { onMount } from "svelte";

  export let id;
  let data = [];
  const headingPengeluaran = ["ID Rekening", "Jumlah", "Sifat"];
  console.log(data);

  function fetchData() {
    fetch(`${mainUrl}/api/master/rekening/mutasi?transaksi_order_id=${id}`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        data = res.data;
      });
    });
  }
  onMount(() => {
    fetchData();
  });
  $: console.log(data);
</script>

<Router route={id}>
  <Route path="">
    <CardTable
      tableHeading={headingPengeluaran}
      href="/transaksi/order/mutasi/{id}"
      deleteApi={undefined}
      heading="Detail Transaksi"
      {data}
      withEdit={false}
      addData={true}
    />
  </Route>

  <Route path="add"></Route>
</Router>
