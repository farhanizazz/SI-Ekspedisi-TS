<script>
  import { onMount } from "svelte";
  import { getCookie } from "svelte-cookie";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../../environment";

  export let id;
  let error = {};
  let data = {
    nama_perusahaan: "",
    alamat: "",
    penanggung_jawab: "",
    contact_person: "",
    keterangan: "",
  };

  onMount(async () => {
    const res = await fetch(`${mainUrl}/api/master/armada/${id}`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`,
      }
    });
    res.json().then((res) => {
      data = res.data;
    });
  });

  async function handleSubmit() {
    fetch(`${mainUrl}/api/master/armada/${id}`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`,
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "PUT",
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then((res) => {
        console.log(res)
        if (res.status != "error") {
          navigate("/admin/armada");
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
          Masukkan data armada
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
              Nopol
            </label>
            <input
              id="grid-supir"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Nomor Polisi Kendaraan"
              name="nama-supir"
              bind:value={data.nopol}
            />
            {#if "nopol" in error}
              <p class="text-red-500 text-sm">{error.nopol}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Merk
            </label>
            <input
              id="grid-alamat"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Merk Truck"
              name="alamat"
              bind:value={data.merk}
            />
            {#if "merk" in error}
              <p class="text-red-500 text-sm">{error.merk}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-ktp"
            >
              Jenis
            </label>
            <input
              id="grid-ktp"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan jenis truck"
              name="ktp"
              bind:value={data.jenis}
            />
            {#if "jenis" in error}
              <p class="text-red-500 text-sm">{error.jenis}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-sim"
            >
              Tanggal STNK
            </label>
            <input
              id="grid-sim"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nomor SIM"
              name="sim"
              bind:value={data.tgl_stnk}
            />
            {#if "tgl_stnk" in error}
              <p class="text-red-500 text-sm">{error.tgl_stnk}</p>
            {/if}
          </div>
        </div>

        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-nomor-hp"
            >
              Tanggal Uji Kir
            </label>
            <input
              id="grid-nomor-hp"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nomor HP pengemudi"
              name="nomor-pengemudi"
              bind:value={data.tgl_uji_kir}
            />
            {#if "tgl_uji_kir" in error}
              <p class="text-red-500 text-sm">{error.tgl_uji_kir}</p>
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
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              rows="4"
              bind:value={data.keterangan}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

