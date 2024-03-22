<script>
  import { getCookie } from "svelte-cookie";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../environment";
  import { onMount } from "svelte";

  export let id;
  export let jenis;
  export let onSuccess;

  let error = {
    transaksi_order_id: "",
    master_rekening_id: "",
    tanggal_pembayaran: "",
    nominal: "",
    keterangan: "",
  };
  let data = {
    transaksi_order_id: Number(id),
    master_rekening_id: "",
    tanggal_pembayaran: "",
    nominal: "",
    keterangan: "",
    jenis_transaksi: jenis,
  };

  let rekenings = [];
  function handleSubmit() {
    const response = fetch(`${mainUrl}/api/master/rekening/mutasi`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((res) => {
        console.log(res);
        if (res.status != "error") {
          onSuccess();
          navigate(`/transaksi/order/mutasi/${id}/${jenis}`);
        } else {
          error = res.message;
        }
      });
    });
  }

  onMount(async () => {
    console.log(jenis)
    fetch(`${mainUrl}/api/master/rekening`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "GET",
    }).then((res) => {
      res.json().then((res) => {
        rekenings = res.data;
      });
    });
  });
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">
          Masukkan data transaksi
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
              for="grid-Perusahaan"
            >
              Tanggal Transaksi
            </label>
            <input
              id="grid-Perusahaan"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan tanggal transaksi disini"
              name="tanggal-transaksi"
              bind:value={data.tanggal_pembayaran}
            />
            {#if "tanggal_pembayaran" in error}
              <p class="text-red-500 text-sm">{error.tanggal_pembayaran}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-rekening"
            >
              Pilih Rekening
            </label>
            <select
              id="grid-rekening"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              bind:value={data.master_rekening_id}
            >
              <option>Silahkan Pilih Rekening</option>
              {#each rekenings as rekening}
                <option value={rekening.id}
                  >{`Nama Rekening: ${rekening.nama_bank} | Nomor Rekening: ${rekening.nomor_rekening}`}</option
                >
              {/each}
            </select>
            {#if "master_rekening_id" in error}
              <p class="text-red-500 text-sm">{error.master_rekening_id}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-nominal"
            >
              Nominal pembayaran
            </label>
            <input
              id="grid-nominal"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nominal pembayaran"
              name="nominal"
              bind:value={data.nominal}
            />
            {#if "nominal" in error}
              <p class="text-red-500 text-sm">{error.nominal}</p>
            {/if}
          </div>
        </div>
      </div>

      <div class="flex flex-wrap">
        <div class="w-full lg:w-12/12 px-4">
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
              bind:value={data.keterangan}
            />
            {#if "keterangan" in error}
              <p class="text-red-500 text-sm">{error.keterangan}</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</form>
