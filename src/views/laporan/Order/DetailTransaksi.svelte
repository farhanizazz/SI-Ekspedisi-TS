<script>
  import { Router, Route } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  import { mainUrl } from "../../../environment";
  import axios from "axios";
  import { onMount } from "svelte";

  export let id;
  let data = [];
  let dataOriginal = [];
  const headingPengeluaran = [
    "ID",
    "Tanggal Pembayaran",
    "Nominal",
    "Keterangan",
  ];
  console.log(data);

  function fetchData() {
    fetch(`${mainUrl}/api/master/rekening/mutasi?transaksi_order_id=${id}`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        data = res.data.map((e) => {
          let copy = { ...e };
          delete copy.created_at;
          delete copy.updated_at;
          delete copy.transaksi_order_id;
          delete copy.master_rekening_id;
          if (copy.keterangan == null) {
            copy.keterangan = "Tidak ada keterangan";
          }
          return copy;
        });
        dataOriginal = res.data;
      });
    });
  }
  onMount(() => {
    fetchData();
  });
  $: console.log(dataOriginal);
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
