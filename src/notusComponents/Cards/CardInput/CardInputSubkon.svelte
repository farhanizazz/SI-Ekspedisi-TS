<script>
  import { getCookie } from "svelte-cookie";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../environment";

  let error = {
    nama_perusahaan: "",
    alamat: "",
    ket: "",
    penanggung_jawab: "",
  };
  let data = {
    nama_perusahaan: "",
    alamat: "",
    ket: "",
    penanggung_jawab: "",
  };

  function handleSubmit() {
    const response = fetch(`${mainUrl}/api/master/subkon`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`,
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
          navigate("/admin/subkon");
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
              Nama Perusahaan
            </label>
            <input
              id="grid-supir"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama perusahaan"
              name="nama-supir"
              bind:value={data.nama_perusahaan}
            />
            {#if "nama_perusahaan" in error}
              <p class="text-red-500 text-sm">{error.nama_perusahaan}</p>
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
              placeholder="Masukkan Merk Truck"
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
              Penanggung Jawab
            </label>
            <input
              id="grid-ktp"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama penanggung jawab"
              name="ktp"
              bind:value={data.penanggung_jawab}
            />
            {#if "penanggung_jawab" in error}
              <p class="text-red-500 text-sm">{error.penanggung_jawab}</p>
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
                Keterangan
              </label>
              <textarea
                id="grid-about-me"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                rows="4"
                bind:value={data.ket}
              />
              {#if "ket" in error}
                <p class="text-red-500 text-sm">{error.ket}</p>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>
