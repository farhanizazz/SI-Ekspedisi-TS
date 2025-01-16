<script>
  import { getCookie } from "svelte-cookie";
  import CardTable from "./../../../../src/notusComponents/Cards/CardTable.svelte";
  import { mainUrl } from "../../../environment";
  import axios from "axios";
  import { onMount } from "svelte";

  export let id;
  let data = {
    id,
    status_kendaraan: "",
  };
  const headingInvoice = ["ID Rekening", "Jumlah", "Sifat", "Keterangan"];
  console.log(data);

  function fetchData() {
    fetch(`${mainUrl}/api/transaksi/order/${id}`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        res.data.biaya_lain_harga_jual = [];
        console.log(res.data);
        data = res.data;
      });
    });
  }
  onMount(() => {
    fetchData();
    console.log(data);
  });
</script>

<CardTable
  on:delete={(event) => {
    const index = event.detail.index;
    console.log(index);
    data.biaya_lain_harga_order.splice(index, 1);
    axios
      .put(
        `${mainUrl}/api/transaksi/order/${data.id}`,
        {
          biaya_lain_harga_order: data.biaya_lain_harga_order,
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          fetchData();
        }
      });
  }}
  tableHeading={headingInvoice}
  href="/transaksi/pengeluaran"
  deleteApi={undefined}
  heading="Biaya Lain Harga Order"
  data={data && data.biaya_lain_harga_order_arr}
  withEdit={false}
  addData={false}
/>

{#if data.status_kendaraan == "Sendiri"}
  <CardTable
    tableHeading={headingInvoice}
    href="/transaksi/pengeluaran"
    deleteApi={undefined}
    heading="Biaya Lain Uang Jalan"
    data={data && data.biaya_lain_uang_jalan_arr}
    withEdit={false}
    addData={false}
    on:delete={(event) => {
      const index = event.detail.index;
      console.log(index);
      data.biaya_lain_uang_jalan.splice(index, 1);
      axios
        .put(
          `${mainUrl}/api/transaksi/order/${data.id}`,
          {
            biaya_lain_uang_jalan: data.biaya_lain_uang_jalan,
            ...data,
          },
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status == "success") {
            fetchData();
          }
        });
    }}
  />
{/if}

{#if data.status_kendaraan == "Subkon"}
  <CardTable
    tableHeading={headingInvoice}
    href="/transaksi/pengeluaran"
    deleteApi={undefined}
    heading="Data Lain Harga Jual"
    data={data && data.biaya_lain_harga_jual_arr}
    withEdit={false}
    addData={false}
    on:delete={(event) => {
      const index = event.detail.index;
      console.log(index);
      data.biaya_lain_harga_jual.splice(index, 1);
      axios
        .put(`${mainUrl}/api/transaksi/order/${data.id}`, {
          biaya_lain_harga_jual: data.biaya_lain_harga_jual,
          ...data,
        })
        .then((res) => {
          if (res.data.status == "success") {
            fetchData();
          }
        });
    }}
  />
{/if}
