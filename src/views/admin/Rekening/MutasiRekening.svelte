<script>
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../../environment";
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";

  export let location;

  export let id;
  let data = [];
  const heading = ["ID", "Tanggal pembayaran", "Nominal", "Keterangan"];

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
                delete e.created_at;
                delete e.updated_at;
                delete e.master_rekening_id;
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
      <CardTable
        tableHeading={heading}
        href="/admin/rekening/mutasi"
        deleteApi={`${mainUrl}/api/master/rekening/mutasi/`}
        heading="Data Rekening"
        {data}
        onLoad={fetchData}
      />
  </div>
</div>
