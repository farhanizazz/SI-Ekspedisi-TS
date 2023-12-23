<script>
  import CardTable from "./../../../../src/notusComponents/Cards/CardTable.svelte";
  import { mainUrl } from "../../../environment";
  import axios from "axios";

  export let id;
  export let data;
  const headingPengeluaran = ["ID Rekening", "Jumlah", "Sifat"];
  console.log(data);
</script>

<CardTable
  on:delete={(event) => {
    const index = event.detail.index;
    console.log(index);
    data[id].biaya_lain_harga_order.splice(index, 1);
    axios.put(`${mainUrl}/api/transaksi/order/${data[id].id}`, {
      biaya_lain_harga_order: data[id].biaya_lain_harga_order,
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
  deleteApi={`${mainUrl}/api/transaksi/`}
  heading="Biaya Lain Uang Jalan"
  data={data[id].biaya_lain_uang_jalan_arr}
  withEdit={false}
  addData={false}
/>
<CardTable
  tableHeading={headingPengeluaran}
  href="/transaksi/pengeluaran"
  deleteApi={`${mainUrl}/api/transaksi/`}
  heading="Data Lain Harga Jual"
  data={data[id].biaya_lain_harga_jual_arr}
  withEdit={false}
  addData={false}
/>
