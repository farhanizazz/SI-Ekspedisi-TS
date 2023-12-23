<script>
	import { getCookie } from 'svelte-cookie';
  import CardTable from "./../../../../src/notusComponents/Cards/CardTable.svelte";
  import { mainUrl } from "../../../environment";
  import axios from "axios";
  import { onMount } from 'svelte';

  export let id;
  let data = [{ biaya_lain_harga_order_arr: [] }];
  const headingPengeluaran = ["ID Rekening", "Jumlah", "Sifat"];
  console.log(data);

  function fetchData() {
    fetch(`${mainUrl}/api/transaksi/order`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          if (e.biaya_lain_harga_jual == null) {
            e.biaya_lain_harga_jual = [];
          }
        });
        data = res.data;
      });
    });
  }
  onMount(() => {
    fetchData();
  });
</script>

<CardTable
  on:delete={(event) => {
    const index = event.detail.index;
    console.log(index);
    data[id].biaya_lain_harga_order.splice(index, 1);
    axios.put(`${mainUrl}/api/transaksi/order/${data[id].id}`, {
      biaya_lain_harga_order: data[id].biaya_lain_harga_order,
      ...data[id]
    }).then((res) => {
      console.log(res);
      if(res.data.status == "success") {
        fetchData();
      }
    });
  }}
  tableHeading={headingPengeluaran}
  href="/transaksi/pengeluaran"
  deleteApi={undefined}
  heading="Biaya Lain Harga Order"
  data={data[id].biaya_lain_harga_order_arr}
  withEdit={false}
  addData={false}
/>
<CardTable
  tableHeading={headingPengeluaran}
  href="/transaksi/pengeluaran"
  deleteApi={undefined}
  heading="Biaya Lain Uang Jalan"
  data={data[id].biaya_lain_uang_jalan_arr}
  withEdit={false}
  addData={false}
  on:delete={(event) => {
    const index = event.detail.index;
    console.log(index);
    data[id].biaya_lain_uang_jalan.splice(index, 1);
    axios.put(`${mainUrl}/api/transaksi/order/${data[id].id}`, {
      biaya_lain_uang_jalan: data[id].biaya_lain_uang_jalan,
      ...data[id]
    }).then((res) => {
      if(res.data.status == "success") {
        fetchData();
      }
    });
  }}
/>
<CardTable
  tableHeading={headingPengeluaran}
  href="/transaksi/pengeluaran"
  deleteApi={`${mainUrl}/api/transaksi/`}
  heading="Data Lain Harga Jual"
  data={data[id].biaya_lain_harga_jual_arr}
  withEdit={false}
  addData={false}
  on:delete={(event) => {
    const index = event.detail.index;
    console.log(index);
    data[id].biaya_lain_harga_jual.splice(index, 1);
    axios.put(`${mainUrl}/api/transaksi/order/${data[id].id}`, {
      biaya_lain_harga_jual: data[id].biaya_lain_harga_jual,
      ...data[id]
    }).then((res) => {
      if(res.data.status == "success") {
        fetchData();
      }
    });
  }}
/>
