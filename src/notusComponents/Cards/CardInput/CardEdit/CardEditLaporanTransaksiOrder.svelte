<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../../environment";
  import { getCookie } from "svelte-cookie";

  export let id;
  export let onSuccess;
  let error = {};
  let data = {
    
    tanggal_awal: "",
    tanggal_akhir: "",
    status_kendaraan: "",
    status_kendaraan_sendiri: null,
    status_surat_jalan: "",
    m_penyewa_id: null,
    muatan: "",
    m_armada_id: null,
    m_sopir_id: null,
    asal: "",
    tujuan: "",
    harga_order: null,
    bayar_harga_order: null,
    status_harga_order: "",
    biaya_lain_harga_order: [],
    status_pajak: "",
    setor: null,
    uang_jalan: null,
    potongan_wajib: null,
    biaya_lain_uang_jalan: [],
    m_subkon_id: null,
    harga_jual: null,
    bayar_harga_jual: null,
    status_harga_jual: "",
    biaya_lain_harga_jual: [],
    keterangan: "",
  };

  let penyewas = [];
  let armadas = [];
  let sopirs = [];
  let rekenings = [];
  let subkons = [];

  onMount(async () => {
    fetch(`${mainUrl}/api/master/penyewa`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "GET",
    }).then((res) => {
      res.json().then((res) => {
        penyewas = res.data;
      });
    });

    fetch(`${mainUrl}/api/master/armada`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "GET",
    }).then((res) => {
      res.json().then((res) => {
        armadas = res.data;
      });
    });

    fetch(`${mainUrl}/api/master/subkon`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "GET",
    }).then((res) => {
      res.json().then((res) => {
        subkons = res.data;
      });
    });

    fetch(`${mainUrl}/api/master/sopir`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
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

    fetch(`${mainUrl}/api/master/rekening`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
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

    // fetch(`${mainUrl}/api/transaksi/order`, {
    //   headers: {
    //     Authorization: `bearer ${getCookie("token")}`,
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   method: "GET",
    // }).then((res) => {
    //   res.json().then((res) => {
    //     data = res.data[res.data.indexOf(res.data.find((e) => e.id == id))];
    //     if (data.biaya_lain_harga_order == null) {
    //       data.biaya_lain_harga_order = [];
    //     }
    //     if (data.biaya_lain_uang_jalan == null) {
    //       data.biaya_lain_uang_jalan = [];
    //     }
    //     if (data.biaya_lain_harga_jual == null) {
    //       data.biaya_lain_harga_jual = [];
    //     }
    //   });
    // });

    data = await JSON.parse(await localStorage.getItem("order")).data;
    data = data[data.indexOf(data.find((e) => e.id == id))];
  });

  function handleSubmit() {
    const response = fetch(`${mainUrl}/api/transaksi/order/${id}`, {
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
          onSuccess();
          navigate("/transaksi/order");
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
          Masukkan data Transaksi Order
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
        <div class="w-6/12 pr-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-tanggal-awal"
            >
              Tanggal Awal
            </label>
            <input
              id="grid-tanggal-awal"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Tanggal Transaksi"
              name="tanggal-awal"
              bind:value={data.tanggal_awal}
            />
            {#if "tanggal_awal" in error}
              <p class="text-red-500 text-sm">{error.tanggal_awal}</p>
            {/if}
          </div>
        </div>

        <div class="w-6/12 pl-8">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-supir"
            >
              Tanggal Akhir
            </label>
            <input
              id="grid-supir"
              type="date"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Tanggal Transaksi"
              name="nama-supir"
              bind:value={data.tanggal_akhir}
            />
            {#if "tanggal_akhir" in error}
              <p class="text-red-500 text-sm">{error.tanggal_akhir}</p>
            {/if}
          </div>
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-SJ"
          >
            Nomor SJ
          </label>
          <input
            id="grid-SJ"
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Masukkan Nomor SJ"
            name="SJ"
            bind:value={data.nomor_sj}
          />
          {#if "nomor_sj" in error}
            <p class="text-red-500 text-sm">{error.nomor_sj}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-PO"
          >
            Nomor PO
          </label>
          <input
            id="grid-PO"
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Masukkan Nomor PO"
            name="PO"
            bind:value={data.nomor_po}
          />
          {#if "nomor_po" in error}
            <p class="text-red-500 text-sm">{error.nomor_po}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-DO"
          >
            Nomor DO
          </label>
          <input
            id="grid-DO"
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Masukkan Nomor DO"
            name="DO"
            bind:value={data.nomor_do}
          />
          {#if "nomor_do" in error}
            <p class="text-red-500 text-sm">{error.nomor_do}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-about-me"
          >
            Status Surat Jalan
          </label>
          <select
            id="grid-about-me"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            bind:value={data.status_surat_jalan}
          >
            <option value="Sopir">Sopir</option>
            <option value="Kantor">Kantor</option>
            <option value="Selesai">Selesai</option>
          </select>
          {#if "status_surat_jalan" in error}
            <p class="text-red-500 text-sm">{error.status_surat_jalan}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-penyewa"
          >
            Penyewa
          </label>
          <select
            id="grid-penyewa"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            bind:value={data.m_penyewa_id}
          >
            <option>Silahkan Pilih Penyewa</option>
            {#each penyewas as penyewa}
              <option value={penyewa.id}>{penyewa.nama_perusahaan}</option>
            {/each}
          </select>
          {#if "m_penyewa_id" in error}
            <p class="text-red-500 text-sm">{error.m_penyewa_id}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-Muatan"
          >
            Muatan
          </label>
          <input
            id="grid-Muatan"
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Masukkan Muatan penyewa"
            name="Muatan"
            bind:value={data.muatan}
          />
          {#if "muatan" in error}
            <p class="text-red-500 text-sm">{error.muatan}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-Asal"
          >
            Asal
          </label>
          <input
            id="grid-Asal"
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Masukkan Asal penyewa"
            name="Asal"
            bind:value={data.asal}
          />
          {#if "asal" in error}
            <p class="text-red-500 text-sm">{error.asal}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-Tujuan"
          >
            Tujuan
          </label>
          <input
            id="grid-Tujuan"
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Masukkan Tujuan penyewa"
            name="Tujuan"
            bind:value={data.tujuan}
          />
          {#if "tujuan" in error}
            <p class="text-red-500 text-sm">{error.tujuan}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-Harga_Order"
          >
            Harga Order
          </label>
          <input
            id="grid-Harga_Order"
            type="number"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Masukkan Harga Order penyewa"
            name="Harga_Order"
            bind:value={data.harga_order}
          />
          {#if "harga_order" in error}
            <p class="text-red-500 text-sm">{error.harga_order}</p>
          {/if}
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-status_pajak"
          >
            Status Pajak
          </label>
          <select
            id="grid-status_pajak"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            bind:value={data.status_pajak}
          >
            <option>Silahkan Pilih Status Order</option>
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
          {#if "status_pajak" in error}
            <p class="text-red-500 text-sm">{error.status_pajak}</p>
          {/if}
        </div>

        {#if data.status_pajak == "ya"}
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-ppn"
            >
              Pajak (dalam %)
            </label>
            <input
              id="grid-ppn"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Jumlah Pajak dalam %"
              name="ppn"
              bind:value={data.ppn}
            />
            {#if "ppn" in error}
              <p class="text-red-500 text-sm">{error.ppn}</p>
            {/if}
          </div>
        {/if}

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-status-kendaraan"
          >
            Status Kendaraan
          </label>
          <select
            id="grid-status-kendaraan"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            bind:value={data.status_kendaraan}
          >
            <option>Silahkan Pilih Status Kendaraan</option>
            <option value="Subkon">Subkon</option>
            <option value="Sendiri">Sendiri</option>
          </select>
          {#if "status_kendaraan" in error}
            <p class="text-red-500 text-sm">{error.status_kendaraan}</p>
          {/if}
        </div>

        {#if data.status_kendaraan == "Sendiri"}
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-about-me"
            >
              Status Kendaraan Sendiri
            </label>
            <select
              disabled={data.status_kendaraan != "Sendiri"}
              id="grid-about-me"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              bind:value={data.status_kendaraan_sendiri}
            >
              <option>Silahkan Pilih Status Kendaraan Sendiri</option>
              <option value="Berangkat">Berangkat</option>
              <option value="Pulang">Pulang</option>
              <option value="Kontrak">Kontrak</option>
              <option value="Kota-Kota">Kota-Kota</option>
            </select>
            {#if "status_kendaraan_sendiri" in error}
              <p class="text-red-500 text-sm">
                {error.status_kendaraan_sendiri}
              </p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-about-me"
            >
              Armada
            </label>
            <select
              id="grid-about-me"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              bind:value={data.m_armada_id}
            >
              <option>Silahkan Pilih Armada</option>
              {#each armadas as armada}
                <option value={armada.id}>{armada.nopol}</option>
              {/each}
            </select>
            {#if "status_kendaraan" in error}
              <p class="text-red-500 text-sm">{error.status_kendaraan}</p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-about-me"
            >
              Sopir
            </label>
            <select
              id="grid-about-me"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              bind:value={data.m_sopir_id}
            >
              <option>Silahkan Pilih Sopir</option>
              {#each sopirs as sopir}
                <option value={sopir.id}>{sopir.nama}</option>
              {/each}
            </select>
            {#if "sopir" in error}
              <p class="text-red-500 text-sm">{error.sopir}</p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-uang_jalan"
            >
              Uang Jalan
            </label>
            <input
              id="grid-uang_jalan"
              disabled={data.status_kendaraan != "Sendiri"}
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Bayar Harga Order"
              name="uang_jalan"
              bind:value={data.uang_jalan}
            />
            {#if "uang_jalan" in error}
              <p class="text-red-500 text-sm">{error.uang_jalan}</p>
            {/if}
          </div>
        {/if}

        {#if data.status_kendaraan == "Subkon"}
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-about-me"
            >
              Subkon
            </label>
            <select
              id="grid-about-me"
              disabled={data.status_kendaraan != "Subkon"}
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              bind:value={data.m_subkon_id}
            >
              <option>Silahkan Pilih Subkon</option>
              {#each subkons as subkon}
                <option value={subkon.id}>{subkon.nama_perusahaan}</option>
              {/each}
            </select>
            {#if "m_subkon_id" in error}
              <p class="text-red-500 text-sm">{error.m_subkon_id}</p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-sopir-subkon"
            >
              Sopir
            </label>
            <input
              id="grid-sopir-subkon"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama sopir"
              name="sopir-subkon"
              bind:value={data.sopir_subkon}
            />
            {#if "sopir_subkon" in error}
              <p class="text-red-500 text-sm">{error.sopir_subkon}</p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-nopol-subkon"
            >
              Nopol
            </label>
            <input
              id="grid-nopol-subkon"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nopol subkon"
              name="nopol-subkon"
              bind:value={data.nopol_subkon}
            />
            {#if "nopol_subkon" in error}
              <p class="text-red-500 text-sm">{error.nopol_subkon}</p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-harga_jual"
            >
              Harga Jual
            </label>
            <input
              id="grid-harga_jual"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Harga Jual"
              name="harga_jual"
              bind:value={data.harga_jual}
            />
            {#if "harga_jual" in error}
              <p class="text-red-500 text-sm">{error.harga_jual}</p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-bayar_harga_jual"
            >
              Bayar Harga Jual
            </label>
            <input
              id="grid-bayar_harga_jual"
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Bayar Harga Jual"
              name="bayar_harga_jual"
              bind:value={data.bayar_harga_jual}
            />
            {#if "bayar_harga_jual" in error}
              <p class="text-red-500 text-sm">{error.bayar_harga_jual}</p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-status_harga_jual"
            >
              Status Harga Jual
            </label>
            <select
              id="grid-status_harga_jual"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              bind:value={data.status_harga_jual}
            >
              <option>Silahkan Pilih Status Order</option>
              <option value="Dp">DP</option>
              <option value="Pelunasan">Pelunasan</option>
            </select>
            {#if "status_harga_jual" in error}
              <p class="text-red-500 text-sm">{error.status_harga_jual}</p>
            {/if}
          </div>
        {/if}

        <!-- <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-status_harga_order"
            >
              Biaya Lain Harga Order
            </label>
            <select
              id="grid-biaya_lain_harga_order"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              rows="4"
              on:input={(e) => {
                if (data.biaya_lain_harga_order.includes(e.target.value)) {
                  data.biaya_lain_harga_order =
                    data.biaya_lain_harga_order.filter(
                      (el) => el != e.target.value
                    );
                }
                data.biaya_lain_harga_order.push(e.target.value);
                data.biaya_lain_harga_order = data.biaya_lain_harga_order;
                console.log(data.biaya_lain_harga_order);
              }}
            >
              <option>Silahkan Pilih Biaya Lain Harga Order</option>
              {#each rekenings as rekening}
                <option value={rekening.id}>{rekening.nama} | {rekening.nominal}</option>
              {/each}
            </select>
            {#if "biaya_lain_harga_order" in error}
              <p class="text-red-500 text-sm">{error.biaya_lain_harga_order}</p>
            {/if}
          </div>
          <div class="container mx-auto bg-gray-100 flex flex-row mb-2">
            {#each data.biaya_lain_harga_order as rekeningId}
              <div
                class="flex justify-center items-center m-1 mr-2 px-2 py-1 rounded-full bg-orange-200 text-base text-[#ea580c] font-medium"
              >
                <div
                  class="flex-initial max-w-full leading-none text-xs font-normal"
                >
                  {#each rekenings as rekening}
                    {#if rekening.id == rekeningId}
                      {rekening.nama}
                    {/if}
                  {/each}
                </div>
                <i
                  class="fa fa-times ml-2 cursor-pointer"
                  on:click={() => {
                    data.biaya_lain_harga_order =
                      data.biaya_lain_harga_order.filter(
                        (e) => e != rekeningId
                      );
                  }}
                />
              </div>
            {/each}
          </div>
        </div>


        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-biaya_lain_uang_jalan"
            >
              Biaya Lain Uang Jalan
            </label>
            <select
              id="grid-biaya_lain_uang_jalan"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              rows="4"
              on:input={(e) => {
                if (data.biaya_lain_uang_jalan.includes(e.target.value)) {
                  data.biaya_lain_uang_jalan =
                    data.biaya_lain_uang_jalan.filter(
                      (el) => el != e.target.value
                    );
                }
                data.biaya_lain_uang_jalan.push(e.target.value);
                data.biaya_lain_uang_jalan = data.biaya_lain_uang_jalan;
                console.log(data.biaya_lain_uang_jalan);
              }}
            >
              <option>Silahkan Pilih Biaya Lain Uang Jalan</option>
              {#each rekenings as rekening}
                <option value={rekening.id}>{rekening.nama} | {rekening.nominal}</option>
              {/each}
            </select>
            {#if "biaya_lain_uang_jalan" in error}
              <p class="text-red-500 text-sm">{error.biaya_lain_uang_jalan}</p>
            {/if}
          </div>
          <div class="container mx-auto bg-gray-100 flex flex-row mb-2">
            {#each data.biaya_lain_uang_jalan as rekeningId}
              <div
                class="flex justify-center items-center m-1 mr-2 px-2 py-1 rounded-full bg-orange-200 text-base text-[#ea580c] font-medium"
              >
                <div
                  class="flex-initial max-w-full leading-none text-xs font-normal"
                >
                  {#each rekenings as rekening}
                    {#if rekening.id == rekeningId}
                      {rekening.nama}
                    {/if}
                  {/each}
                </div>
                <i
                  class="fa fa-times ml-2 cursor-pointer"
                  on:click={() => {
                    data.biaya_lain_uang_jalan =
                      data.biaya_lain_uang_jalan.filter(
                        (e) => e != rekeningId
                      );
                  }}
                />
              </div>
            {/each}
          </div>
        </div>

        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-biaya_lain_harga_jual"
            >
              Biaya Lain Harga Jual
            </label>
            <select
              id="grid-biaya_lain_harga_jual"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              rows="4"
              on:input={(e) => {
                if (data.biaya_lain_harga_jual.includes(e.target.value)) {
                  data.biaya_lain_harga_jual =
                    data.biaya_lain_harga_jual.filter(
                      (el) => el != e.target.value
                    );
                }
                data.biaya_lain_harga_jual.push(e.target.value);
                data.biaya_lain_harga_jual = data.biaya_lain_harga_jual;
                console.log(data.biaya_lain_harga_jual);
              }}
            >
              <option>Silahkan Pilih Biaya Lain Uang Jalan</option>
              {#each rekenings as rekening}
                <option value={rekening.id}>{rekening.nama} | {rekening.nominal}</option>
              {/each}
            </select>
            {#if "biaya_lain_harga_jual" in error}
              <p class="text-red-500 text-sm">{error.biaya_lain_harga_jual}</p>
            {/if}
          </div>
          <div class="container mx-auto bg-gray-100 flex flex-row mb-2">
            {#each data.biaya_lain_harga_jual as rekeningId}
              <div
                class="flex justify-center items-center m-1 mr-2 px-2 py-1 rounded-full bg-orange-200 text-base text-[#ea580c] font-medium"
              >
                <div
                  class="flex-initial max-w-full leading-none text-xs font-normal"
                >
                  {#each rekenings as rekening}
                    {#if rekening.id == rekeningId}
                      {rekening.nama}
                    {/if}
                  {/each}
                </div>
                <i
                  class="fa fa-times ml-2 cursor-pointer"
                  on:click={() => {
                    data.biaya_lain_harga_jual =
                      data.biaya_lain_harga_jual.filter(
                        (e) => e != rekeningId
                      );
                  }}
                />
              </div>
            {/each}
          </div>
        </div> -->

        {#if data.status_kendaraan == "Sendiri"}
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-setor"
            >
              Setor
            </label>
            <input
              id="grid-setor"
              type="number"
              disabled={data.status_kendaraan != "Sendiri"}
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Bayar Harga Order"
              name="setor"
              bind:value={data.setor}
            />
            {#if "setor" in error}
              <p class="text-red-500 text-sm">{error.setor}</p>
            {/if}
          </div>

          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-potongan_wajib"
            >
              Potongan Wajib
            </label>
            <input
              id="grid-potongan_wajib"
              disabled={data.status_kendaraan != "Sendiri"}
              type="number"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Bayar Harga Order"
              name="potongan_wajib"
              bind:value={data.potongan_wajib}
            />
            {#if "potongan_wajib" in error}
              <p class="text-red-500 text-sm">{error.potongan_wajib}</p>
            {/if}
          </div>
        {/if}

        <div class="relative w-full mb-3">
          <label
            class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            for="grid-keterangan"
          >
            Keterangan
          </label>
          <textarea
            id="grid-keterangan"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            bind:value={data.ket_trans}
          />
          {#if "ket_trans" in error}
            <p class="text-red-500 text-sm">{error.ket_trans}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</form>
