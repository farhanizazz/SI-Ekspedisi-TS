<script>
  import { link } from "svelte-routing";
  // core components
  import TableDropdown from "../../notusComponents/Dropdowns/TableDropdown.svelte";
  import { onMount } from "svelte";
  import { getCookie } from "svelte-cookie";
  import { createEventDispatcher } from "svelte";
  import Modal from "../Modal/Modal.svelte";
  import axios from "axios";

  // can be one of light or dark
  export let color = "light";
  export let heading;
  export let tableHeading = [];
  export let data = [{}];
  export let href;
  export let afterHref = "";
  export let withEdit = true;
  export let withDelete = true;
  export let onLoad = () => {};
  export let addData = true;
  export let deleteApi;
  export let subtotal = "";
  let search = "";
  let dataSearch;
  let deleteModal = [];
  let confirmationModal = [];
  function toggleDeleteModal(index) {
    deleteModal[index] = !deleteModal[index];
    return true;
  }

  function toggleConfirmationModal(index) {
    confirmationModal[index] = !confirmationModal[index];
    return true;
  }

  $: deleteModal = Array(dataSearch.length).fill(false);
  $: confirmationModal = Array(dataSearch.length).fill(false);

  onLoad();

  // search for a specific data from the search variable, if the search variable is empty, return all data in svelte store
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
    // Dispatch the custom event with the index value
    dispatch("delete", { index });
  }
  let IDRFormatter = new Intl.NumberFormat("id-ID");
</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color ===
  'light'
    ? 'bg-white'
    : 'bg-red-800 text-white'}"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div
        class="relative w-full px-4 max-w-full flex-grow flex flex-1 justify-between items-center"
      >
        <h3
          class="font-semibold text-lg {color === 'light'
            ? 'text-blueGray-700'
            : 'text-white'}"
        >
          {heading}
        </h3>

        <div class="relative flex flex-wrap items-stretch">
          <span
            class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1"
          >
            <i class="fas fa-search" />
          </span>
          <input
            bind:value={search}
            type="text"
            placeholder="Cari"
            class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full pl-10"
          />
        </div>

        {#if addData === true}
          <a use:link href={`${href}/add/${afterHref}`}>
            <p
              class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              Tambah Data
            </p>
          </a>
        {:else}
          <div></div>
        {/if}
      </div>
    </div>
  </div>

  <div class="block w-full overflow-x-auto">
    <!-- Projects table -->
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          {#each tableHeading as data}
            <th
              class="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 font-semibold text-left {color ===
              'light'
                ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                : 'bg-red-700 text-red-200 border-red-600'}"
            >
              {data}
            </th>
          {/each}
          {#if withDelete || withEdit}
            <th
              class="px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 font-semibold text-left {color ===
              'light'
                ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                : 'bg-red-700 text-red-200 border-red-600'}"
            >
              Action
            </th>
          {/if}
        </tr>
      </thead>
      {#if data.length > 0}
        <tbody>
          {#each dataSearch as tableData, index}
            <Modal
              onReject={() => {
                toggleConfirmationModal(index);
              }}
              bind:showModal={confirmationModal[index]}
              isLoading={false}
              onAccept={() => {
                toggleConfirmationModal(index);
                if (deleteApi !== undefined) {
                  axios
                    .delete(deleteApi + `${tableData.id}?force=true`, {
                      headers: {
                        Authorization: `bearer ${getCookie("token")}`,
                      },
                    })
                    .then((res) => {
                      if (res.data.status != "error") {
                        onLoad();
                      }
                    });
                } else {
                  handleDelete(tableData.id);
                }
              }}
              saveText="Hapus"
            >
              <h1
                slot="header"
                class="font-semibold text-2xl {color === 'light'
                  ? 'text-blueGray-700'
                  : 'text-white'}"
              >
                Hapus Data
              </h1>
              <h3
                class="text-lg mt-5 {color === 'light'
                  ? 'text-blueGray-700'
                  : 'text-white'}"
              >
                Data ini dipakai di tabel lain, apakah anda yakin ingin
                menghapus data ini? (Ini berarti menghapus semua tabel dimana
                data ini tampil)
              </h3>
            </Modal>
            <Modal
              onReject={() => {
                toggleDeleteModal(index);
              }}
              bind:showModal={deleteModal[index]}
              isLoading={false}
              onAccept={() => {
                toggleDeleteModal(index);
                if (deleteApi !== undefined) {
                  axios
                    .delete(deleteApi + `${tableData.id}`, {
                      headers: {
                        Authorization: `bearer ${getCookie("token")}`,
                      },
                    })
                    .then((res) => {
                      if (res.data.status == "error") {
                        toggleConfirmationModal(index);
                      } else {
                        onLoad();
                      }
                    })
                    .finally(() => {});
                } else {
                  handleDelete(tableData.id);
                }
              }}
              saveText="Hapus"
            >
              <h1
                slot="header"
                class="font-semibold text-2xl {color === 'light'
                  ? 'text-blueGray-700'
                  : 'text-white'}"
              >
                Hapus Data
              </h1>
              <h3
                class="text-lg mt-5 {color === 'light'
                  ? 'text-blueGray-700'
                  : 'text-white'}"
              >
                Apakah anda yakin ingin menghapus data ini?
              </h3>
            </Modal>
            <tr>
              {#each Object.keys(data[0]) as header}
                {#if tableData[header] == "aktif"}
                  <td
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
                  >
                    <p
                      class="text-center bg-emerald-500 text-white text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                    >
                      {tableData[header]}
                    </p>
                  </td>
                {:else if tableData[header] == "nonaktif"}
                  <td
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
                  >
                    <p
                      class="text-center bg-red-500 text-white text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                    >
                      {tableData[header]}
                    </p>
                  </td>
                {:else}
                  <!-- The data for the table -->
                  <td
                    class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
                  >
                    {typeof tableData[header] == "number" &&
                    header != "id" &&
                    header != "m_rekening_id" && header != "m_tambahan_id" && header != "Nomor"
                      ? "Rp. " + IDRFormatter.format(tableData[header])
                      : tableData[header]}
                  </td>
                  <!-- End of The data for the table -->
                {/if}
              {/each}

              {#if withEdit || withDelete}
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
                >
                  {#if withEdit === true}
                    <a
                      use:link
                      href={`${href}/edit/${tableData.id}/${afterHref}`}
                    >
                      <p
                        class="text-center bg-emerald-500 text-white active:bg-emerald-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                      >
                        Edit
                      </p>
                    </a>
                  {/if}
                  {#if withDelete}
                    <button
                      on:click={() => {
                        toggleDeleteModal(index);
                      }}
                      class="w-full"
                    >
                      <p
                        class="text-center bg-red-500 text-white active:bg-red-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      >
                        Hapus Data
                      </p>
                    </button>
                  {/if}
                </td>
              {/if}
            </tr>
          {/each}
          {#if subtotal != ""}
            <tr>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4 text-en"
                colSpan={tableHeading.length - 2}
              />
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4 text-en font-bold"
              >
                Subtotal:
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4 text-en"
              >
                {"Rp. " +
                  IDRFormatter.format(
                    dataSearch.reduce(
                      (sum, item) => sum + item[`${subtotal}`],
                      0
                    )
                  )}
              </td>
            </tr>
          {/if}
        </tbody>
      {:else}
        <tbody>
          <td colspan={tableHeading.length + 1}>
            <h1 class="text-center py-5 text-blueGray-300">Data Kosong</h1>
          </td>
        </tbody>
      {/if}
    </table>
  </div>
</div>
