<script>
  import { link } from "svelte-routing";
  // core components
  import { onMount } from "svelte";
  import { getCookie } from "svelte-cookie";
  import { createEventDispatcher } from "svelte";
  import Modal from "../../../notusComponents/Modal/Modal.svelte";
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
  let modals = [];
  function toggleModal(index) {
    modals[index] = !modals[index];
    return true;
  }

  $: modals = Array(dataSearch.length).fill(false);

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

  function formatDate(isoString) {
    const date = new Date(isoString);

    // Extract the day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const dispatch = createEventDispatcher();
  function handleDelete(index) {
    // Dispatch the custom event with the index value
    dispatch("delete", { index });
  }
  let IDRFormatter = new Intl.NumberFormat("id-ID");

  function formatJsonToString(
    jsonString,
    maxLength = 50,
    addLineBreaks = false
  ) {
    try {
      // Parse the JSON string into an object
      const data = JSON.parse(jsonString);

      // Convert the object to a formatted string
      let formattedString = Object.entries(data)
        .filter(([key]) => key !== "user")
        .map(([key, value]) => `${key}: ${value}`)
        .join(addLineBreaks ? ",<br>" : ", ");

      // Trim the final formatted string if it exceeds maxLength
      if (formattedString.length > maxLength) {
        formattedString = `${formattedString.slice(0, maxLength)}...`;
      }

      return formattedString;
    } catch (error) {
      return "Invalid JSON string";
    }
  }

  function convertApiToTitle(apiPath) {
    // Extract the relevant part of the path
    const segments = apiPath.split("/");

    // Determine the prefix (Master or Transaksi) based on the path
    let prefix = "";
    if (segments[0] === "api") {
      if (segments[1] === "master") prefix = "Master";
      else if (segments[1] === "transaksi") prefix = "Transaksi";
    }

    // Format the relevant part after the prefix
    const category = segments[2] || segments[1];
    let formattedCategory = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    if (formattedCategory == "User") formattedCategory = "Pegawai";
    return prefix ? `${prefix} ${formattedCategory}` : formattedCategory;
  }
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
              {@html data.replace(/\n/g, "<br>")}
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
            <tr>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
                >{#if tableData.path == "api/logout"}
                  <div
                    class="bg-red-500 w-28 text-center rounded font-medium text-white"
                  >
                    USER LOGOUT
                  </div>
                {:else}
                  {tableData.user.username}
                {/if}
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
              >
                {#if tableData.method == "DELETE" || tableData.path == "api/logout"}
                  <div
                    class="w-28 rounded font-medium text-white justify-center flex bg-red-500"
                  >
                    Data Dihapus
                  </div>
                {:else if tableData.path == "api/login"}
                  <div
                    class="w-28 rounded font-medium text-white justify-center flex bg-blue-500"
                  >
                    User Login
                  </div>
                {:else}
                  {formatJsonToString(tableData.response)}
                  <br />
                  <button
                    class="border p-1 rounded-md"
                    on:click={() => {
                      toggleModal(index);
                    }}
                  >
                    Lihat Selengkapnya
                  </button>
                {/if}
                <Modal
                  onReject={() => {
                    toggleModal(index);
                  }}
                  bind:showModal={modals[index]}
                  isLoading={false}
                  onAccept={() => {
                    toggleModal(index);
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
                  saveText=""
                >
                  <h3
                    class="text-lg mt-5 {color === 'light'
                      ? 'text-blueGray-700'
                      : 'text-white'}"
                  >
                    {@html formatJsonToString(tableData.response, 999, true)}
                  </h3>
                </Modal>
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
              >
                {convertApiToTitle(tableData.path)}
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
              >
                {#if tableData.method == "PUT"}
                  <div
                    class="bg-green-500 w-10 text-center rounded font-medium text-white"
                  >
                    EDIT
                  </div>
                {:else if tableData.method == "DELETE"}
                  <div
                    class="bg-red-500 w-15 text-center rounded font-medium text-white"
                  >
                    HAPUS
                  </div>
                {:else if tableData.path == "api/logout"}
                  <div
                    class="bg-red-500 w-28 text-center rounded font-medium text-white"
                  >
                    USER LOGOUT
                  </div>
                {:else if tableData.method == "POST"}
                  {#if tableData.path == "api/login"}
                    <div
                      class="bg-orange-500 w-28 text-center rounded font-medium text-white"
                    >
                      USER LOGIN
                    </div>
                  {:else}
                    <div
                      class="bg-blue-500 w-28 text-center rounded font-medium text-white"
                    >
                      TAMBAH DATA
                    </div>
                  {/if}
                {/if}
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4"
              >
                {formatDate(tableData.created_at)}
              </td>
            </tr>
          {/each}
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
