<script>
  import { onMount } from "svelte";
  import { getCookie } from "svelte-cookie";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../../environment";

  export let id;
  let error = {
    nama: "",
    alamat: "",
    ktp: "",
    sim: "",
    nomor_hp: "",
    keterangan: "",
    tanggal_gabung: ""
  };
  let data = {
    nama: "",
    alamat: "",
    ktp: "",
    sim: "",
    nomor_hp: "",
    keterangan: "",
    tanggal_gabung: "",
    status: '',
  };

  onMount(async () => {
    const res = await fetch(`${mainUrl}/api/master/sopir/${id}`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`,
      }
    });
    res.json().then((res) => {
      data = res.data;
    });
  });

  async function handleSubmit() {
    fetch(`${mainUrl}/api/master/sopir/${id}`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then((res) => {
        console.log(res)
        if (res.status != "error") {
          navigate("/admin/sopir");
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
        <h6 class="text-blueGray-700 text-xl font-bold">Masukkan data sopir</h6>
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
              Nama Supir
            </label>
            <input
              id="grid-supir"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama sopir truck"
              name="nama-supir"
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
              Alamat
            </label>
            <input
              id="grid-alamat"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan alamat sopir"
              name="alamat"
              bind:value={data.alamat}
            />
            {#if "alamat" in error}
              <p class="text-red-500 text-sm">{error.alamat}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-ktp"
            >
              KTP
            </label>
            <input
              id="grid-ktp"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nomor KTP supir"
              name="ktp"
              bind:value={data.ktp}
            />
            {#if "ktp" in error}
              <p class="text-red-500 text-sm">{error.ktp}</p>
            {/if}
          </div>
        </div>
        
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-status"
            >
              Status Sopir
            </label>
            <select
              id="grid-status"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              rows="4"
              bind:value={data.status}
            >
              <option>Silahkan Pilih Status Sopir</option>
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
            </select>
            {#if "status" in error}
              <p class="text-red-500 text-sm">{error.status}</p>
            {/if}
          </div>
        </div>

        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-sim"
            >
              SIM
            </label>
            <input
              id="grid-sim"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nomor SIM"
              name="sim"
              bind:value={data.sim}
            />
            {#if "sim" in error}
              <p class="text-red-500 text-sm">{error.sim}</p>
            {/if}
          </div>
        </div>

        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-nomor-hp"
            >
              Nomor HP
            </label>
            <input
              id="grid-nomor-hp"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nomor HP pengemudi"
              name="nomor-pengemudi"
              bind:value={data.nomor_hp}
            />
            {#if "nomor_hp" in error}
              <p class="text-red-500 text-sm">{error.nomor_hp}</p>
            {/if}
          </div>
        </div>

        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-tanggal-gabung"
            >
              Tanggal Bergabung
            </label>
            <input
              id="grid-tanggal-gabung"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan tanggal bergabung pengemudi"
              name="tanggal-bergabung"
              bind:value={data.tanggal_gabung}
            />
            {#if "tanggal_gabung" in error}
              <p class="text-red-500 text-sm">{error.tanggal_gabung}</p>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

