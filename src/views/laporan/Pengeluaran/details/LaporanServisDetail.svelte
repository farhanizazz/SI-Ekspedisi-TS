<script lang="ts">
  import CardTable from "../../../../notusComponents/Cards/CardTable.svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../../../environment";
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import CardTableMutasi from "../../../../notusComponents/Cards/CardTableMutasi.svelte";
  import type { LaporanServis, NotaBeliItem } from "../models/LaporanModel";

  export let id: number;
  export let type: string;
  let data: NotaBeliItem[] = [];
  const heading = ["ID", "Tanggal Pembayaran", "Nominal", "Nama Bank", "Nomor Rekening", "Atas Nama"];
  let originalData: LaporanServis;

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
          fetch(`${mainUrl}/api/master/laporan/servis/${id}`, {
            headers: {
              Authorization: `bearer ${getCookie("token")}`,
            },
          }).then((res) => {
            res.json().then((res) => {
              originalData = res.data;
              console.log(originalData);

              res.data.servis_mutasi.forEach((e: any) => {
                delete e.master_mutasi_id;
                delete e.created_at;
                delete e.updated_at;
                delete e.servis_id;
                e.tanggal_pembayaran = e.master_mutasi.tanggal_pembayaran
                e.nominal = e.master_mutasi.nominal;
                e.nama_bank = e.master_mutasi.master_rekening.nama_bank;
                e.nomor_rekening = e.master_mutasi.master_rekening.nomor_rekening.toString();
                e.atas_nama = e.master_mutasi.master_rekening.atas_nama;
                delete e.master_mutasi
              });
              data = res.data.servis_mutasi;
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
    <!-- <div
      class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
    >
      <div class="rounded-t mb-0 px-4 py-3 border-0">
        <div class="flex flex-wrap items-start">
          <div
            class="relative w-full px-4 max-w-full flex-grow flex flex-1 justify-between items-start flex-col"
          >
            <h3 class="font-semibold text-lg text-blueGray-700">
              Detail Invoice
            </h3>
            <br />
            {#if originalData == undefined}
              <p>Loading...</p>
            {:else}
              <b>Armada:</b>
              {originalData.master_armada.nopol}
              <br />
              <b>Nama Toko:</b>
              {originalData.nama_toko}
              <br />
              <b>Nomor Nota:</b>
              {originalData.nomor_nota}
              <br />
              <b>Tanggal Servis:</b>
              {originalData.tanggal_servis}
              <br />
              <br />
              <b>Item:</b>
              <table>
                <thead>
                  <tr>
                    <th class="text-start flex">Nama Barang</th>
                    <th>Nominal</th>
                  </tr>
                </thead>
                {#each originalData.nota_beli_items as item}
                  <tbody>
                    <tr>
                      <td class="pr-10">{item.nama_barang}</td>
                      <td>{item.harga}</td>
                    </tr>
                  </tbody>
                {/each}
              </table>
            {/if}
          </div>
        </div>
      </div>
    </div> -->
    <CardTableMutasi
      tableHeading={heading}
      addData={true}
      withEdit={false}
      href="/transaksi/pengeluaran/servis/laporan/{id}"
      deleteApi={`${mainUrl}/api/master/laporan/servis/mutasi/`}
      heading="Data Laporan {type}"
      {data}
      onLoad={fetchData}
    />
  </div>
</div>
