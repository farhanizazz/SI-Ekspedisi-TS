<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../environment";
  import { getCookie } from "svelte-cookie";

  let error = {
  };
  let data = {
    tgl_transaksi: "",
    master_sopir_id: "",
    nominal_trans: "",
    ket_trans: ""
  };

  let sopirs = [];

  onMount(async () => {
    fetch(`${mainUrl}/api/master/sopir`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "GET",
    }).then((res) => {
      res.json().then((res) => {
        sopirs = res.data;
      });
    });
  });

  function handleSubmit() {
    const response = fetch(`${mainUrl}/api/transaksi/hutang_sopir`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((res) => {
        console.log(res);
        if (res.status != "error") {
          navigate("/transaksi/hutangSopir");
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
          Masukkan data subkon
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
              Tanggal Transaksi
            </label>
            <input
              id="grid-supir"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Tanggal Transaksi"
              name="nama-supir"
              bind:value={data.tgl_transaksi}
            />
            {#if "tgl_transaksi" in error}
              <p class="text-red-500 text-sm">{error.tgl_transaksi}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Nominal Transaksi
            </label>
            <input
              id="grid-alamat"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nominal hutang"
              name="alamat"
              bind:value={data.nominal_trans}
            />
            {#if "nominal_trans" in error}
              <p class="text-red-500 text-sm">{error.nominal_trans}</p>
            {/if}
          </div>
        </div>

        <div class="flex flex-wrap flex-grow">
          <div class="w-full w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-about-me"
              >
                Pilih Sopir
              </label>
              <select
                id="grid-about-me"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value={data.master_sopir_id}
              >
              <option>Silahkan Pilih Sopir</option>
                {#each sopirs as sopir}
                  <option value={sopir.id}>{`${sopir.nama} | ID Sopir: ${sopir.id}`}</option>
                {/each}
              </select>
              {#if "master_sopir_id" in error}
                <p class="text-red-500 text-sm">{error.master_sopir_id}</p>
              {/if}
            </div>
          </div>
        </div>

        <div class="w-full w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-about-me"
            >
              Keterangan
            </label>
            <textarea
              id="grid-about-me"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              rows="4"
              bind:value={data.ket_trans}
            />
            {#if "ket_trans" in error}
              <p class="text-red-500 text-sm">{error.ket_trans}</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</form>
