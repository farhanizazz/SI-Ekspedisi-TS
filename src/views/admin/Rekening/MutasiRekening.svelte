<script lang="ts">
  import CardTableMutasi from "./../../../notusComponents/Cards/CardTableMutasi.svelte";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../../environment";
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import Pagination from "/src/notusComponents/Pagination/Pagination.svelte";
  import { writable } from "svelte/store";

  export let location;

  export let id: number;
  let data = [];
  const heading = [
    "ID",
    "Tanggal pembayaran",
    "Nominal",
    "Jenis Transaksi",
    "Asal Transaksi",
    "Keterangan",
    "Pembuat",
    "Nomor transaksi",
  ];

  function fetchData(page = 0) {
    fetch(`${mainUrl}/api/getProfile`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        if (res.data.role.akses.master_rekening.view != true) {
          navigate("/admin/dashboard");
        } else {
          fetch(
            `${mainUrl}/api/master/rekening/mutasi?master_rekening_id=${id}&page=${page + 1}`,
            {
              headers: {
                Authorization: `bearer ${getCookie("token")}`,
              },
            }
          ).then((res) => {
            res.json().then((res) => {
              res.data.list.forEach((e) => {
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
                  case "pengeluaran":
                    e.jenis_transaksi = "Pembayaran Pengeluaran";
                    break;
                }
                switch (e.asal_transaksi) {
                  case "transaksi_order":
                    e.asal_transaksi = "Transaksi Order";
                    break;
                  case "servis":
                    e.asal_transaksi = "Servis";
                    break;
                  default:
                    e.asal_transaksi = "Tidak diketahui";
                    break;
                }
                if (e.transaksi_order == null) {
                  e.nomor_transaksi = "Tidak diketahui";
                } else {
                  e.nomor_transaksi = e.transaksi_order.no_transaksi;
                }
                delete e.transaksi_order;
                delete e.master_rekening;
                delete e.created_at;
                delete e.updated_at;
                delete e.master_rekening_id;
                delete e.created_by;
                delete e.transaksi_order_id;
                delete e.model_type;
                delete e.model_id;
                if (e.pembuat == null) {
                  e.pembuat = "Tidak diketahui";
                } else {
                  e.pembuat = e.pembuat.name;
                }
                if (e.keterangan == null) e.keterangan = "Tidak ada keterangan";
              });
              data = res.data.list;
              console.log(data);
            });
          });
        }
      });
    });
  }

  const currentPage = writable(0);
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <div class="flex justify-center">
      <Pagination
        onLast={() => {
          fetchData(data.length - 1);
          $currentPage = data.length - 1;
        }}
        onFirst={() => {
          fetchData(0);
          $currentPage = 0;
        }}
        {currentPage}
        pageCount={data.length}
        onNext={() => {
          fetchData($currentPage + 1);
            $currentPage += 1;
        }}
        onPrev={() => {
          fetchData($currentPage - 1);
          $currentPage -= 1;
        }}
        onSeek={(page) => {
          {
            fetchData(page);
          $currentPage = page;
          }
        }}
      />
    </div>
    <CardTableMutasi
      tableHeading={heading}
      addData={false}
      href="/admin/rekening/mutasi"
      deleteApi={`${mainUrl}/api/master/rekening/mutasi/`}
      heading="Data Mutasi Rekening"
      {data}
      onLoad={fetchData}
    />
  </div>
</div>
