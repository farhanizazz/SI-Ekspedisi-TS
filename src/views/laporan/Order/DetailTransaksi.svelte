<script>
  import { transaksi } from "./stores/TransaksiStores.ts";
  import { IDRFormatter } from "./../../../helper/idrFormatter.js";
  import CardInputDetailTransaksi from "../../../notusComponents/Cards/CardInput/CardInputDetailTransaksi.svelte";
  import { Router, Route } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
  import { mainUrl } from "../../../environment";
  import axios from "axios";
  import { onMount } from "svelte";
  import { computeStyles } from "@popperjs/core";
  import Pagination from "/src/notusComponents/Pagination/Pagination.svelte";
  import { writable } from "svelte/store";

  export let id;
  export let jenis;

  let data = [];
  // let dataOriginal = [{detail: {detail: {}}}];
  const headingInvoice = [
    "ID",
    "Tanggal Pembayaran",
    "Nominal",
    "Keterangan",
    "Pembuat",
    "Rekening Tujuan",
  ];
  export const currentPage = writable(0);
  let pageCount;

  async function fetchData(page = 1) {
    const responseJson = await fetch(
      `${mainUrl}/api/master/rekening/mutasi?transaksi_order_id=${id}&page=${page}`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    );
    const response = await responseJson.json();
    pageCount = response.data.meta.links.length;
    data = response.data.list.filter((e) => e.jenis_transaksi == jenis);
    data = data.map((e) => {
      let copy = { ...e };
      if (copy.pembuat == null) {
        copy.pembuat = "Tidak ada data pembuat";
      }
      copy.master_rekening = `${copy.master_rekening.atas_nama} | ${copy.master_rekening.nama_bank} | ${copy.master_rekening.nomor_rekening}`;
      copy.pembuat = copy.pembuat.name;
      delete copy.detail;
      delete copy.created_by;
      delete copy.created_at;
      delete copy.updated_at;
      delete copy.transaksi_order_id;
      delete copy.master_rekening_id;
      delete copy.jenis_transaksi;
      delete copy.model_type;
      delete copy.model_id;
      delete copy.asal_transaksi;
      delete copy.transaksi_order;
      if (copy.keterangan == null) {
        copy.keterangan = "Tidak ada keterangan";
      }
      return copy;
    });
    return response;
  }
</script>

<Router route={id}>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white mt-5"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div
          class="relative w-full px-4 max-w-full flex-grow flex flex-1 justify-between items-center"
        >
          <h3 class="font-semibold text-lg text-blueGray-700">
            Detail Transaksi
          </h3>
        </div>
      </div>
      {#await fetchData()}
        <p class="px-4 mt-2">Loading...</p>
      {:then dataOriginal}
        {#if dataOriginal.data.list.length > 0}
          <p class="px-4 mt-2">
            Nomor transaksi: {dataOriginal.data.list[0].detail.no_transaksi}
            {#if jenis == "order"}
              <br />
              Harga order: Rp. {IDRFormatter.format(
                dataOriginal.data.list[0].detail.harga_order
              )}
              <br />
              <table class="table-auto">
                <tbody>
                  {#each dataOriginal.data.list[0].detail.biaya_lain_harga_order_arr as item, index}
                    <tr>
                      {#if index == 0}
                        <td class="pr-3">Biaya Tambah: </td>
                      {:else}
                        <td></td>
                      {/if}

                      <td class="pr-3">
                        Nama: {item.nama}
                      </td>

                      <td>
                        Nominal: Rp. {IDRFormatter.format(item.nominal)}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
              <br />
              Sisa tagihan: Rp. {IDRFormatter.format(
                dataOriginal.data.list[0].detail.harga_order +
                  dataOriginal.data.list[0].detail.biaya_lain_harga_order_arr.reduce(
                    (acc, curr) => {
                      return acc + curr.nominal;
                    },
                    0
                  ) -
                  dataOriginal.data.list[0].detail.mutasi_order -
                  dataOriginal.data.list[0].detail.total_pajak
              )}
              <br />
            {:else if jenis == "uang_jalan"}
              <br />
              Muatan: {dataOriginal.data.list[0].detail.muatan}
              <br />
              Asal - Tujuan: {dataOriginal.data.list[0].detail.asal} - {dataOriginal
                .data.list[0].detail.tujuan}
              <br />
              Uang jalan: Rp. {IDRFormatter.format(
                dataOriginal.data.list[0].detail.uang_jalan
              )}
              <br />
              THR: Rp. {IDRFormatter.format(
                dataOriginal.data.list[0].detail.thr
              )}
              <br />
              {#each dataOriginal.data.list[0].detail.biaya_lain_uang_jalan_arr as item, index}
                <tr>
                  {#if index == 0}
                    <td class="pr-3">Biaya Tambahan: </td>
                  {:else}
                    <td></td>
                  {/if}

                  <td class="pr-3">
                    Nama: {item.nama}
                  </td>

                  <td>
                    Nominal: Rp. {IDRFormatter.format(item.nominal)}
                  </td>
                </tr>
              {/each}
              <br />
              <!-- Total mutasi: {dataOriginal.data.list[0].detail.mutasi}
          <br /> -->
              Sisa uang jalan: Rp. {IDRFormatter.format(
                dataOriginal.data.list[0].detail.sisa_uang_jalan
              )}
              <br />
            {:else if jenis == "jual"}
              <!-- 
          No transaksi:
          Pemilik subkon 
          Nopol/sopir 
          Harga jual
          Biaya tambah/kurang 
          Sisa hutang ke subkon -->
              <br />
              Pemilik subkon: -
              <br />
              Nopol/sopir: {dataOriginal.data.list[0].detail.nopol_subkon} / {dataOriginal
                .data.list[0].detail.sopir_subkon}
              <br />
              Harga jual: Rp. {IDRFormatter.format(
                dataOriginal.data.list[0].detail.harga_jual
              )}
              <br />
              Total biaya tambah / kurang: Rp. {IDRFormatter.format(
                dataOriginal.data.list[0].detail.biaya_lain_harga_jual_arr.reduce(
                  (acc, curr) => acc + curr.nominal,
                  0
                )
              )}
              <br />
              Sisa hutang ke subkon: Rp. {IDRFormatter.format(
                dataOriginal.data.list[0].detail.harga_jual +
                  dataOriginal.data.list[0].detail.biaya_lain_harga_jual_arr.reduce(
                    (acc, curr) => {
                      acc + curr.nominal;
                    },
                    0
                  ) -
                  dataOriginal.data.list[0].detail.mutasi_jual
              )}
            {/if}
          </p>
        {:else}
          <p class="px-4 mt-2">Tidak ada data</p>
        {/if}
      {:catch error}
        <p class="px-4 mt-2">Error: {error.message}</p>
      {/await}
    </div>
  </div>
  <div style="display: flex; justify-content: center; align-items: center;">
    <Pagination
      onLast={() => {
        fetchData($currentPage + 1);
      }}
      onFirst={() => {
        fetchData($currentPage + 1);
      }}
      {currentPage}
      {pageCount}
      onNext={() => {
        currentPage.set($currentPage + 1);
        fetchData($currentPage + 1);
      }}
      onPrev={() => {
        currentPage.set($currentPage - 1);
        fetchData($currentPage + 1);
      }}
      onSeek={(page) => {
        currentPage.set(page);
        fetchData($currentPage + 1);
      }}
    />
  </div>
  <CardTable
    tableHeading={headingInvoice}
    href="/transaksi/order/mutasi/{id}/{jenis}"
    deleteApi={`${mainUrl}/api/master/rekening/mutasi/`}
    heading="Detail Transaksi"
    {data}
    withEdit={false}
    addData={true}
    onLoad={fetchData}
  />
</Router>
