<script lang="ts">
  import Select from "svelte-select";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../../environment";
  import { getCookie } from "svelte-cookie";
  import axios from "axios";

  export let id: number;
  console.log("ID: ", id);

  let error = {};
  let data = {
    servis_id: id,
    master_rekening_id: "",
    nominal: 0,
    keterangan: "",
  };
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
      isDataValid = true;
    } else {
      //otherwise fetch data from api then save the data in localstorage
      fetchData()
        .then((res) => {
          var json = { data: res, cachetime: Date.now() / 1000 };
          localStorage.setItem("armada", JSON.stringify(json));
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

    const response_rekening = await axios.get(
      `${mainUrl}/api/master/rekening`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    );

    const data = {
      rekening: response_rekening.data.data,
    };

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
    console.log("tes pengeluaran");

    const detailServis = await axios.get(
      `${mainUrl}/api/master/laporan/servis/${id}`,
      {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      }
    );
    if (detailServis.data.data.total < 0) {
      data.nominal = -data.nominal;
    }
    
    const response = fetch(`${mainUrl}/api/master/laporan/servis/mutasi`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${getCookie("token")}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((res) => {
        console.log(res);
        if (res.status != "error") {
          navigate("/transaksi/tPengeluaran");
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
          Masukkan data pembayaran baru
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
                Pilih Rekening
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
                items={rekenings.map((rekening) => ({
                  value: rekening.id,
                  label:
                    rekening.nama_bank +
                    " - " +
                    rekening.nomor_rekening +
                    " - " +
                    rekening.atas_nama,
                }))}
                bind:justValue={data.master_rekening_id}
                label="label"
                searchable={true}
              />

              <!-- {#if "master_rekening_id" in error}
                <p class="text-red-500 text-sm">{error.master_rekening_id}</p>
              {/if} -->
            </div>
          </div>
        </div>

        <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Nominal
            </label>
            <input
              id="grid-alamat"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nominal"
              name="alamat"
              bind:value={data.nominal}
            />
            {#if "nominal" in error}
              <p class="text-red-500 text-sm">{error.nominal}</p>
            {/if}
          </div>
        </div>

        <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Keterangan
            </label>
            <textarea
              id="grid-alamat"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Keterangan"
              name="alamat"
              bind:value={data.keterangan}
            />
            {#if "keterangan" in error}
              <p class="text-red-500 text-sm">{error.keterangan}</p>
            {/if}
          </div>
        </div>
        <!-- <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Nomor Nota
            </label>
            <input
              id="grid-alamat"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nominal hutang"
              name="alamat"
              bind:value={data.nomor_nota}
            />
            {#if "nama_toko" in error}
              <p class="text-red-500 text-sm">{error.nomor_nota}</p>
            {/if}
          </div>
        </div> -->

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
      </div>
    </div>
  </div>
</form>
