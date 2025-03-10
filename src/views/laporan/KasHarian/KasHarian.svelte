<script lang="ts">
  import CardTableMutasi from "./../../../notusComponents/Cards/CardTableMutasi.svelte";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../../environment";
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import Pagination from "/src/notusComponents/Pagination/Pagination.svelte";
  import { writable } from "svelte/store";
  import Select from "svelte-select";

  export let location;

  export let id: number;
  let data = [];
  let dataLength: number;
  const today = new Date();
  let selectedDate = {
    awal: today.toISOString().substring(0, 10),
    akhir: today.toISOString().substring(0, 10),
  };
  const currentPage = writable(0);
  let dataRekening = [];
  let selectedRekening;
  let timeout: number;
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

  async function fetchRekening() {
    await fetch(`${mainUrl}/api/master/rekening`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        res.data.forEach((e) => {
          delete e.created_at;
          delete e.updated_at;
        });
        dataRekening = res.data;
        console.log(data);
      });
    });
  }

  $: {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Your function here
      fetchData(
        $currentPage,
        selectedRekening,
        selectedDate.awal,
        selectedDate.akhir
      );
    }, 1000);
  }

  async function fetchData(
    page = 0,
    id = selectedRekening,
    tglAwal = selectedDate.awal,
    tglAkhir = selectedDate.akhir
  ) {
    await fetch(`${mainUrl}/api/getProfile`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      res.json().then((res) => {
        if (res.data.role.akses.master_rekening.view != true) {
          navigate("/admin/dashboard");
        } else {
          fetch(
            `${mainUrl}/api/laporan-v2/kas-harian?rekeningId=${id}&page=${page + 1}&tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}`,
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
              dataLength = res.data.meta.links.length;
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
    <div class="flex justify-center">
      <Pagination
        onLast={() => {
          fetchData(dataLength - 1);
          $currentPage = dataLength - 1;
        }}
        onFirst={() => {
          fetchData(0);
          $currentPage = 0;
        }}
        {currentPage}
        pageCount={dataLength}
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
    <div class='flex items-center justify-between flex-row'>
      <div class="flex flex-row items-center gap-3 my-2 w-1/2">
        <h1>Tanggal Awal:</h1>
        <input
          bind:value={selectedDate.awal}
          type="date"
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
          placeholder="Tanggal Awal"
        />
        <h1>Tanggal Akhir:</h1>
        <input
          bind:value={selectedDate.akhir}
          type="date"
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
          placeholder="Tanggal Akhir"
        />
        <h1>Rekening:</h1>
        <Select
          showChevron={true}
          placeholder=""
          id="grid-penyewa"
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
          items={dataRekening.map((rekening) => ({
            value: rekening.id,
            label: `${rekening.atas_nama} | ${rekening.nama_bank} | ${rekening.nomor_rekening}`,
          }))}
          bind:justValue={selectedRekening}
          label="label"
          searchable={true}
        />
      </div>
      <div>
        <button
          on:click={() => {
            if (data.length == 0) {
              alert("Data kosong, gagal mencetak laporan");
              return;
            }
            window.open(
              `${mainUrl}/api/laporan-v2/kas-harian?rekeningId=${selectedRekening}&page=${$currentPage + 1}&tanggalAwal=${selectedDate.awal}&tanggalAkhir=${selectedDate.akhir}&export=pdf`,
            );
          }}
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          <i class="fa-solid fa-print pr-2"></i>Cetak PDF
        </button>
      </div>
    </div>
    <CardTableMutasi
      withDelete={false}
      tableHeading={heading}
      addData={false}
      href="/admin/rekening/mutasi"
      withEdit={false}
      heading="Data Mutasi Rekening"
      {data}
      onLoad={fetchRekening}
    />
  </div>
</div>
