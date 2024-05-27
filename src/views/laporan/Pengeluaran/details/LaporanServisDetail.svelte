<script lang="ts">
  import CardTable from "../../../../notusComponents/Cards/CardTable.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../../../environment";
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import CardTableMutasi from "../../../../notusComponents/Cards/CardTableMutasi.svelte";
  import type { LaporanServis, NotaBeliItem } from "../models/LaporanModel";

  export let id: number;
  let data: NotaBeliItem[] = [];
  const heading = [
    "ID",
    "Nama Barang",
    "Harga",
    "Jumlah",
  ];

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
          fetch(`${mainUrl}/api/laporan/servis/${id}`, {
            headers: {
              Authorization: `bearer ${getCookie("token")}`,
            },
          }).then((res) => {
            res.json().then((res) => {
              res.data.nota_beli_items.forEach((e: NotaBeliItem) => {
                delete e.master_rekening_id;
                delete e.mutasi;
                delete e.created_at;
                delete e.updated_at;
                delete e.servis_id;
              });
              data = res.data.nota_beli_items;
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
      withEdit={false}
      href="/admin/rekening/mutasi"
      deleteApi={`${mainUrl}/api/master/rekening/mutasi/`}
      heading="Data Laporan Servis"
      {data}
      onLoad={fetchData}
    />
  </div>
</div>
