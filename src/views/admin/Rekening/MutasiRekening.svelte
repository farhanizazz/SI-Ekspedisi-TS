<script>
	import CardTableMutasi from './../../../notusComponents/Cards/CardTableMutasi.svelte';
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../../environment";
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";

  export let location;

  export let id;
  let data = [];
  const heading = ["ID", "Tanggal pembayaran", "Nominal","Jenis Transaksi", "Keterangan", "Pembuat"];

  function fetchData() {
    fetch(`${mainUrl}/api/getProfile`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        console.log(res);
        if (res.data.role.akses.master_rekening.view != true) {
          navigate("/admin/dashboard");
        } else {
          fetch(`${mainUrl}/api/master/rekening/mutasi`, {
            headers: {
              Authorization: `bearer ${getCookie("token")}`,
            },
          }).then((res) => {
            res.json().then((res) => {
              data = res.data.filter((e) => {
                return e.master_rekening_id == id;
              });
              res.data.forEach((e) => {
                switch (e.jenis_transaksi) {
                  case "order":
                    e.jenis_transaksi = "Pembayaran Order";
                    e.nominal = `+${e.nominal}`;
                    break;
                  case "jual":
                    e.jenis_transaksi = "Pembayaran Penjualan";
                    e.nominal = `-${e.nominal}`;
                    break;
                  case "uang_jalan":
                    e.jenis_transaksi = "Pembayaran Uang Jalan";
                    e.nominal = `-${e.nominal}`;
                    break;
                } 
                delete e.created_at;
                delete e.updated_at;
                delete e.master_rekening_id;
                delete e.created_by;
                delete e.transaksi_order_id;
                if (e.keterangan == null) e.keterangan = "Tidak ada keterangan";
              });
              console.log(data);
            });
          });
        }
      });
    });
  }
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
      <CardTableMutasi
        tableHeading={heading}
        addData={false}
        href="/admin/rekening/mutasi"
        deleteApi={`${mainUrl}/api/master/rekening/mutasi/`}
        heading="Data Rekening"
        {data}
        onLoad={fetchData}
      />
  </div>
</div>
