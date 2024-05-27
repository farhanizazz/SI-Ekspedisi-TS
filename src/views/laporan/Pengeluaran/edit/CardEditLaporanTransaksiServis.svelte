<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../../environment";
  import { getCookie } from "svelte-cookie";
  import axios from "axios";

  export let id: number;

  let error = {};
  let data = {
    master_armada_id: "",
    nama_toko: "",
    nama_barang: "lorem",
    kategori_servis: "servis",
    nota_beli_items: [],
    // nomor_nota: "",
    // ket_trans: "",
    tanggal_servis: "",
  };
  const columnTransaksi = [
    "Keterangan / Nama barang",
    "Harga",
    "Jumlah",
    "Rekening",
    "Sub total",
  ];
  let dataTransaksi: any[] = [];

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
      let hargaField = row.find((field: any) => field.column === "Harga");
      let jumlahField = row.find((field: any) => field.column === "Jumlah");
      let subtotalField = row.find(
        (field: any) => field.column === "Sub total"
      );
      if (hargaField && jumlahField && subtotalField) {
        subtotalField.value =
          Number(hargaField.value) * Number(jumlahField.value);
      }
    });
  }

  let simplifiedDataTransaksi: any;

  $: simplifiedDataTransaksi = dataTransaksi.map((row) => {
    console.log(row);

    let simplifiedRow = {
      nama_barang: row[0].value,
      harga: row[1].value,
      jumlah: row[2].value,
      master_rekening_id: row[4].value,
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
    const nota_servis_response = await axios.get(
      `${mainUrl}/api/laporan/servis/${id}`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    );

    data = nota_servis_response.data.data;
    console.log(nota_servis_response);
    data.nama_barang = "lorem";
    dataTransaksi = data.nota_beli_items.map((item) => {
      return [
        { column: "Keterangan / Nama barang", value: item.nama_barang },
        { column: "Harga", value: item.harga },
        { column: "Jumlah", value: item.jumlah },
        { column: "Rekening", value: item.master_rekening_id },
        { column: "Sub total", value: item.harga * item.jumlah },
      ];
    });
  });

  function handleSubmit() {
    data.nota_beli_items = simplifiedDataTransaksi;
    const response = fetch(`${mainUrl}/api/laporan/servis/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "PUT",
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((res) => {
        console.log(res);
        if (res.status != "error") {
          navigate("/transaksi/pengeluaran");
        } else {
          error = res.message;
        }
      });
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">
          Masukkan data nota servis baru
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
                Pilih Armada
              </label>
              <select
                id="grid-about-me"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value={data.master_armada_id}
              >
                <option>Silahkan Pilih Armada</option>
                {#each sopirs as sopir}
                  <option value={sopir.id}
                    >{`${sopir.nopol} | ID Sopir: ${sopir.id}`}</option
                  >
                {/each}
              </select>
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
              Tanggal Transaksi
            </label>
            <input
              id="grid-supir"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Tanggal Transaksi"
              name="nama-supir"
              bind:value={data.tanggal_servis}
            />
            {#if "tgl_transaksi" in error}
              <p class="text-red-500 text-sm">{error.tgl_transaksi}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Nama toko / bengkel
            </label>
            <input
              id="grid-alamat"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nominal hutang"
              name="alamat"
              bind:value={data.nama_toko}
            />
            {#if "nama_toko" in error}
              <p class="text-red-500 text-sm">{error.nama_toko}</p>
            {/if}
          </div>
        </div>

        <!-- <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Nomor Nota Beli
            </label>
            <input
              id="grid-alamat"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nominal hutang"
              name="alamat"
              bind:value={data.nomor_nota}
            />
            {#if "nomor_nota" in error}
              <p class="text-red-500 text-sm">{error.nomor_nota}</p>
            {/if}
          </div>
        </div> -->

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
                  {:else if field.column === "Rekening"}
                    <div class="flex flex-col">
                      <select
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        bind:value={field.value}
                      >
                        <option>Silahkan Pilih Rekening</option>
                        {#each rekenings as rekening}
                          <option value={rekening.id}
                            >{rekening.nama_bank} | {rekening.atas_nama} | {rekening.nomor_rekening}</option
                          >
                        {/each}
                      </select>
                      {#if `nota_beli_items.${index}.master_rekening_id` in error}
                        <p class="text-red-500 text-sm">
                          Mohon memilih rekening
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
