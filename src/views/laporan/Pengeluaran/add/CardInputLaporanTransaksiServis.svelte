<script lang="ts">
  import {
    laporanServisPostRepository,
    laporanLainLainPostRepository,
  } from "./../../../../data/repository/laporanServisRepository.js";
  import Select from "svelte-select";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../../environment";
  import { getCookie } from "svelte-cookie";
  import axios from "axios";

  export let type;
  let mengurangi = false;
  let error = {};
  let data = {
    master_armada_id: "",
    nama_toko: "",
    nama_barang: "lorem",
    kategori_servis: "servis",
    nota_beli_items: [],
    nomor_nota: "",
    // ket_trans: "",
    tanggal_servis: "",
    nama_tujuan_lain: "",
    keterangan_lain: "",
    nominal_lain: "0",
    jumlah_lain: 0,
    total_lain: 0,
  };
  let columnTransaksi = [
    "Keterangan / Nama barang",
    "Harga",
    "Jumlah",
    "Sub total",
  ];
  $: type === "servis"
    ? (columnTransaksi = [
        "Keterangan / Nama barang",
        "Harga",
        "Jumlah",
        "Sub total",
      ])
    : (columnTransaksi = ["Keterangan", "Harga", "Jumlah", "Sub total"]);
  let dataTransaksi = [];

  function addRow() {
    let newRow = columnTransaksi.map((column) => {
      return {
        column: column,
        value: column === "Sub total" ? 0 : "",
      };
    });
    dataTransaksi = [...dataTransaksi, newRow];
  }

  $: {
    dataTransaksi.forEach((row) => {
      let hargaField = row.find((field) => field.column === "Harga");
      let jumlahField = row.find((field) => field.column === "Jumlah");
      let subtotalField = row.find((field) => field.column === "Sub total");
      if (hargaField && jumlahField && subtotalField) {
        subtotalField.value =
          Number(hargaField.value) * Number(jumlahField.value);
      }
    });
  }

  let simplifiedDataTransaksi;

  $: simplifiedDataTransaksi = dataTransaksi.map((row) => {
    let simplifiedRow = {
      nama_barang: row[0].value,
      harga: row[1].value,
      jumlah: row[2].value,
    };
    return simplifiedRow;
  });

  function deleteRow(index) {
    dataTransaksi = dataTransaksi.filter((e, i) => i != index);
  }

  let sopirs = [];
  let rekenings = [];

  let isDataValid = false;

  async function getData() {
    var cachelife = 5000;
    var localStorageData = localStorage.getItem("armada");
    var cacheddata = await JSON.parse(localStorageData);
    if (cacheddata) {
      var expired = Date.now() / 1000 - cacheddata.cachetime > cachelife;
    }
    if (cacheddata && !expired && isDataValid) {
      sopirs = cacheddata.data;
      isDataValid = true;
    } else {
      //otherwise fetch data from api then save the data in localstorage
      fetchData()
        .then((res) => {
          var json = { data: res, cachetime: Date.now() / 1000 };
          localStorage.setItem("armada", JSON.stringify(json));
          sopirs = res.armada;
          rekenings = res.rekening;
          isDataValid = true;
        })
        .catch((err) => {
          navigate("/transaksi/pengeluaran");
        });
    }
  }

  async function fetchData() {
    const permission = await axios.get(`${mainUrl}/api/getProfile`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });

    if (permission.data.data.role.akses.master_armada.view != true) {
      throw new Error("Anda tidak memiliki akses untuk melihat data ini");
    }

    const response = await axios.get(`${mainUrl}/api/master/armada`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
      },
    });

    const response_rekening = await axios.get(
      `${mainUrl}/api/master/rekening`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    );

    const data = {
      armada: response.data.data,
      rekening: response_rekening.data.data,
    };

    data.armada.forEach((e: any) => {
      delete e.created_at;
      delete e.updated_at;
    });

    data.rekening.forEach((e: any) => {
      delete e.created_at;
      delete e.updated_at;
    });

    return data;
  }

  let IDRFormatter = new Intl.NumberFormat("id-ID");

  onMount(async () => {
    await getData();
  });

  async function handleSubmit() {
    data.nota_beli_items = simplifiedDataTransaksi;
    let res;
    if (type === "servis") {
      res = await laporanServisPostRepository(data);
    } else {
      data.kategori_servis = "lain";
      data.nama_toko = "lain";
      data.nomor_nota = "lain";
      if (mengurangi) {
        console.log(data);
        console.log(mengurangi);

        data.nota_beli_items = data.nota_beli_items.map((item) => {
          return {
            ...item,
            harga: -item.harga,
          };
        });
      }
      res = await laporanLainLainPostRepository(data);
    }
    if (res.status != "error") {
      navigate("/transaksi/pengeluaran");
    } else {
      error = res.message;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">
          Masukkan data nota {type} baru
        </h6>
        <button
          class="bg-red-400 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="submit"
        >
          Tambahkan
        </button>
      </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10">
      <div class="flex flex-wrap">
        <div class="flex flex-wrap flex-grow">
          <div class="w-full w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-about-me"
              >
                Pilih Jenis Transaksi
              </label>
              <!-- <select
                id="grid-about-me"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value={data.master_armada_id}
              >
                <option>Silahkan Pilih Armada</option>
                {#each sopirs as sopir}
                  <option value={sopir.id}
                    >{`${sopir.nopol}`}</option
                  >
                {/each}
              </select> -->
              <Select
                value={type}
                showChevron={true}
                placeholder=""
                id="grid-penyewa"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                items={[
                  {
                    value: "servis",
                    label: "Servis",
                  },
                  {
                    value: "lain-lain",
                    label: "Lain-Lain",
                  },
                ]}
                bind:justValue={type}
                label="label"
                searchable={true}
              />

              {#if "master_armada_id" in error}
                <p class="text-red-500 text-sm">{error.master_armada_id}</p>
              {/if}
            </div>
          </div>
        </div>

        <div class="flex flex-wrap flex-grow">
          <div class="w-full w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-about-me"
              >
                Pilih Armada
              </label>
              <!-- <select
                id="grid-about-me"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value={data.master_armada_id}
              >
                <option>Silahkan Pilih Armada</option>
                {#each sopirs as sopir}
                  <option value={sopir.id}
                    >{`${sopir.nopol}`}</option
                  >
                {/each}
              </select> -->
              <Select
                showChevron={true}
                placeholder=""
                id="grid-penyewa"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                items={sopirs.map((sopir) => ({
                  value: sopir.id,
                  label: sopir.nopol,
                }))}
                bind:justValue={data.master_armada_id}
                label="label"
                searchable={true}
              />

              {#if "master_armada_id" in error}
                <p class="text-red-500 text-sm">{error.master_armada_id}</p>
              {/if}
            </div>
          </div>
        </div>

        <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-supir"
            >
              Tanggal Servis
            </label>
            <input
              id="grid-supir"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Tanggal Transaksi"
              name="nama-supir"
              bind:value={data.tanggal_servis}
            />
            {#if "tanggal_servis" in error}
              <p class="text-red-500 text-sm">{error.tanggal_servis}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              {type === "servis" ? "Nama toko / bengkel" : "Nama Tujuan Lain"}
            </label>
            {#if type === "servis"}
              <input
                id="grid-alamat"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Masukkan Nama Toko"
                name="alamat"
                bind:value={data.nama_toko}
              />
              {#if "nama_toko" in error}
                <p class="text-red-500 text-sm">{error.nama_toko}</p>
              {/if}
            {:else}
              <input
                id="grid-alamat"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Masukkan Nama Tujuan"
                name="alamat"
                bind:value={data.nama_tujuan_lain}
              />
              {#if "nama_tujuan_lain" in error}
                <p class="text-red-500 text-sm">{error.nama_tujuan_lain}</p>
              {/if}
            {/if}
          </div>
        </div>

        <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              {type === "servis" ? "Nomor Nota" : "Keterangan"} 
            </label>
            {#if type === "servis"}
              <input
                id="grid-alamat"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Masukkan Nomor Nota"
                name="alamat"
                bind:value={data.nomor_nota}
              />
              {#if "nomor_nota" in error}
                <p class="text-red-500 text-sm">{error.nomor_nota}</p>
              {/if}
            {:else}
              <input
                id="grid-alamat"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Masukkan Keterangan"
                name="alamat"
                bind:value={data.keterangan_lain}
              />
              {#if "keterangan_lain" in error}
                <p class="text-red-500 text-sm">{error.keterangan_lain}</p>
              {/if}
            {/if}
          </div>
        </div>

        {#if type === "lain-lain"}
          <div class="w-full lg:w-12/12 px-4">
            <div class="relative w-full mb-3 flex items-center">
              <input
                type="checkbox"
                id="menambah-atau-mengurangi-checkbox"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                placeholder="Masukkan nominal hutang"
                name="alamat"
                bind:checked={mengurangi}
              />
              <label
                for="menambah-atau-mengurangi-checkbox"
                class="block uppercase text-blueGray-600 text-xs font-bold ml-2"
              >
                Nota ini bersifat mengurangi
              </label>
            </div>
          </div>
        {/if}

        <table class="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              {#each columnTransaksi as column}
                <th
                  class="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                  >{column}</th
                >
              {/each}
              <th
                class="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                >Action</th
              >
            </tr>
          </thead>
          {#each dataTransaksi as row, index}
            <tr>
              {#each row as field, indexField}
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4"
                >
                  {#if field.column === "Harga" || field.column === "Jumlah"}
                    <div class="flex flex-col">
                      <input
                        type="number"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder={field.column}
                        bind:value={field.value}
                      />

                      {#if `nota_beli_items.${index}.harga` in error || `nota_beli_items.${index}.jumlah` in error}
                        <p class="text-red-500 text-sm">
                          {field.column === "Harga" &&
                          error[`nota_beli_items.${index}.harga`]
                            ? error[`nota_beli_items.${index}.harga`]
                            : ""}
                          {field.column === "Jumlah" &&
                          error[`nota_beli_items.${index}.jumlah`]
                            ? error[`nota_beli_items.${index}.jumlah`]
                            : ""}
                        </p>
                      {/if}
                    </div>
                  {:else if field.column !== "Sub total"}
                    <div class="flex flex-col">
                      <input
                        type="text"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder={field.column}
                        bind:value={field.value}
                      />
                      {#if error[`nota_beli_items.${index}.nama_barang`]}
                        <p class="text-red-500 text-sm">
                          {field.column === "Keterangan / Nama barang" &&
                          error[`nota_beli_items.${index}.nama_barang`]
                            ? error[`nota_beli_items.${index}.nama_barang`]
                            : ""}
                        </p>
                      {/if}
                    </div>
                  {:else}
                    Rp. {IDRFormatter.format(field.value)}
                  {/if}
                </td>
              {/each}
              <td>
                <button on:click={() => deleteRow(index)}>Hapus</button>
              </td>
            </tr>
          {/each}
          {#if dataTransaksi.length !== 0}
            <tr>
              <td
                colspan={columnTransaksi.length - 1}
                class="text-right font-semibold">Total:</td
              >
              <td class="pl-5">
                Rp. {IDRFormatter.format(
                  dataTransaksi.reduce((sum, row) => {
                    let subtotalField = row.find(
                      (field) => field.column === "Sub total"
                    );
                    return (
                      sum + (subtotalField ? Number(subtotalField.value) : 0)
                    );
                  }, 0)
                )}
              </td>
            </tr>
          {/if}
        </table>
        <div class="w-full text-center mt-5">
          <button
            class="bg-red-400 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            on:click={addRow}>Tambah Data</button
          >
        </div>
      </div>
    </div>
  </div>
</form>
