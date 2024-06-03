<script>
  import { onMount } from "svelte";
  import { link } from "svelte-routing";
  import { getCookie } from "svelte-cookie";
  import { createEventDispatcher } from "svelte";

  export let color = "light";
  export let heading = "Invoice Table";
  export let href;
  export let withEdit = true;
  export let addData = true;
  export let deleteApi;
  export let onLoad = () => {};

  let search = "";
  let dataSearch;

  export let data;

  onLoad();

  $: dataSearch = search
    ? data.filter((item) =>
        Object.keys(item).some(
          (key) =>
            String(item[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
        )
      )
    : data;

  const dispatch = createEventDispatcher();

  function handleDelete(index) {
    dispatch("delete", { index });
  }

  console.log(data);

  let IDRFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" });
</script>

<div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color === 'light' ? 'bg-white' : 'bg-red-800 text-white'}">
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex flex-1 justify-between items-center">
        <h3 class="font-semibold text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}">
          {heading}
        </h3>
        <div class="relative flex flex-wrap items-stretch">
          <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1">
            <i class="fas fa-search" />
          </span>
          <input bind:value={search} type="text" placeholder="Cari" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10" />
        </div>
        {#if addData === true}
          <a use:link href={`${href}/add`}>
            <p class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
              Tambah Data
            </p>
          </a>
        {/if}
      </div>
    </div>
  </div>

  <div class="block w-full overflow-x-auto">
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}">
            Tgl
          </th>
          <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}">
            Nopol
          </th>
          <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}">
            No nota Toko/bengkel
          </th>
          <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}">
            Keterangan/nama brg
          </th>
          <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}">
            Harga
          </th>
          <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}">
            Jumlah/satuan
          </th>
          <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}">
            Sub total
          </th>
          <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}">
            Action
          </th>
        </tr>
      </thead>
      {#if data.length > 0}
        <tbody>
          {#each data as tableData, index}
            {#each tableData.nota_beli_items as item, itemIndex}
              <tr>
                {#if itemIndex === 0}
                  <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowspan={tableData.nota_beli_items.length}>{tableData.tanggal_servis}</td>
                  <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowspan={tableData.nota_beli_items.length}>{tableData.master_armada.nopol}</td>
                  <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowspan={tableData.nota_beli_items.length}>{tableData.nama_toko}</td>
                {/if}
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.nama_barang}</td>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{IDRFormatter.format(item.harga)}</td>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.jumlah}</td>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{IDRFormatter.format(item.harga * item.jumlah)}</td>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {#if withEdit === true}
                    <a use:link href={`${href}/edit/${tableData.id}`}>
                      <p class="text-center bg-emerald-500 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150">
                        Edit
                      </p>
                    </a>
                  {/if}
                  <button on:click={() => {if (deleteApi !== undefined) {fetch(deleteApi + `${tableData.id}`, {method: "delete", headers: {Authorization: `bearer ${getCookie("token")}`},}).then(() => {onLoad();});} else {handleDelete(tableData.id);}}} class="w-full">
                    <p class="text-center bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150">
                      Delete
                    </p>
                  </button>
                </td>
              </tr>
            {/each}
            <tr>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 border" colspan="6"></td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 border font-semibold">{IDRFormatter.format(tableData.total)}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 border font-semibold">{tableData.kategori_servis === 'servis' ? 'LUNAS' : 'BELUM LUNAS'}</td>
            </tr>
          {/each}
        </tbody>
      {/if}
    </table>
  </div>
</div>
