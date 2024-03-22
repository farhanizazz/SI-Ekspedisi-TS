<script>
	import CardInputDetailTransaksi from '../../../notusComponents/Cards/CardInput/CardInputDetailTransaksi.svelte';
  import { Router, Route } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  import { mainUrl } from "../../../environment";
  import axios from "axios";
  import { onMount } from "svelte";
  import { computeStyles } from '@popperjs/core';

  export let id;
  export let jenis;

  let data = [];
  let dataOriginal = [];
  const headingPengeluaran = [
    "ID",
    "Tanggal Pembayaran",
    "Nominal",
    "Keterangan",
    "Pembuat"
  ];
  console.log(data);

  function fetchData() {
    fetch(`${mainUrl}/api/master/rekening/mutasi?transaksi_order_id=${id}`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        console.log(res.data)
        res.data = res.data.filter(e => e.jenis_transaksi == jenis)
        
        data = res.data.map((e) => {
          let copy = { ...e };
          if(copy.pembuat == null) {
            copy.pembuat = "Tidak ada data pembuat";
          }
          delete copy.created_by;
          delete copy.created_at;
          delete copy.updated_at;
          delete copy.transaksi_order_id;
          delete copy.master_rekening_id;
          delete copy.jenis_transaksi;
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
      href="/transaksi/order/mutasi/{id}/{jenis}"
      deleteApi={`${mainUrl}/api/master/rekening/mutasi/`}
      heading="Detail Transaksi"
      {data}
      withEdit={false}
      addData={true}
      onLoad={fetchData}
    />
  </Route>

</Router>
