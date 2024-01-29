<script>
  import { getCookie } from "svelte-cookie";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../environment";
  import { onMount } from "svelte";

  let error = {
    transaksi_order_id: "",
    master_rekening_id: "",
    tanggal_pembayaran: "",
    nominal: "",
    keterangan: "",
  };
  let data = {
    transaksi_order_id: "",
    master_rekening_id: "",
    tanggal_pembayaran: "",
    nominal: "",
    keterangan: "",
  };

  let rekenings = [];
  function handleSubmit() {
    const response = fetch(`${mainUrl}/api/master/rekening/mutasi/`, {
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
          navigate("/admin/penyewa");
        } else {
          error = res.message;
        }
      });
    });
  }

  onMount(async () => {
    fetch(`${mainUrl}/api/master/rekening/`, {
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
              {#each rekenings as sopir}
                <option value={sopir.id}
                  >{`Nama Rekening: ${sopir.nama_bank} | Nomor Rekening: ${sopir.nomor_rekening}`}</option
                >
              {/each}
            </select>
            {#if "master_sopir_id" in error}
              <p class="text-red-500 text-sm">{error.master_sopir_id}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-penanggung-jawab"
            >
              Penanggung Jawab
            </label>
            <input
              id="grid-penanggung-jawab"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama penanggung jawab"
              name="penanggung-jawab"
              bind:value={data.penanggung_jawab}
            />
            {#if "penanggung_jawab" in error}
              <p class="text-red-500 text-sm">{error.penanggung_jawab}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-cp"
            >
              Kontak Person
            </label>
            <input
              id="grid-cp"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nomor yang bisa dihubungi"
              name="contact-person"
              bind:value={data.contact_person}
            />
            {#if "contact_person" in error}
              <p class="text-red-500 text-sm">{error.contact_person}</p>
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
