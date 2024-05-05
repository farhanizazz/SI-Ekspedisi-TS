<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../../environment";
  import { getCookie } from "svelte-cookie";

  export let id: string;
  let error = {};
  let data = {
    nama: '',
    sifat: '',
  };

  onMount(async () => {
    const res = await fetch(`${mainUrl}/api/master/tambahan/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    res.json().then((res) => {
      data = res.data;
    });
  });

  async function handleSubmit() {

    fetch(`${mainUrl}/api/master/tambahan/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${getCookie("token")}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "PUT",
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then((res) => {
        console.log(res)
        if (res.status != "error") {
          navigate("/admin/tambahan");
        } else {
          error = res.message;
        }

      })
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
          Masukkan data rekening
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
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-supir"
            >
              Nama Transaksi
            </label>
            <input
              id="grid-supir"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Biaya Kuli"
              name="nama"
              bind:value={data.nama}
            />
            {#if "nama" in error}
              <p class="text-red-500 text-sm">{error.nama}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Sifat
            </label>
            <select
              id="grid-biaya_lain_harga_order"
              bind:value={data.sifat}
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            >
              <option>Silahkan Pilih Sifat Rekening</option>
              <option value="Menambahkan">Menambahkan</option>
              <option value="Mengurangi">Mengurangi</option>

            </select>
            {#if "sifat" in error}
              <p class="text-red-500 text-sm">{error.sifat}</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</form>