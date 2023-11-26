<script>
  import Rekening from "./../../views/admin/Rekening.svelte";
  import { link, navigate } from "svelte-routing";
  import { library } from "@fortawesome/fontawesome-svg-core";
  import {
    faBars,
    faTimes,
    faTv,
    faTools,
    faTable,
    faFingerprint,
    faUserCircle,
    faClipboardList,
    faNewspaper,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon, FontAwesomeLayers } from "fontawesome-svelte";


  // core components
  import NotificationDropdown from "../../notusComponents/Dropdowns/NotificationDropdown.svelte";
  import UserDropdown from "../../notusComponents/Dropdowns/UserDropdown.svelte";
  import { deleteCookie } from "svelte-cookie";

  let collapseShow = "hidden";

  function toggleCollapseShow(classes) {
    collapseShow = classes;
  }

  library.add(
    faBars,
    faTimes,
    faTv,
    faTools,
    faTable,
    faFingerprint,
    faUserCircle,
    faClipboardList,
    faNewspaper
  );

  export let userData = {
        "id": '',
        "name": "",
        "username": "",
        "m_role_id": '',
        "email": "",
        "email_verified_at": null,
        "role": {
            "id": 0,
            "name": "",
            "akses": {
                "master_armada": {
                    "view": false,
                    "create": false,
                    "edit": false,
                    "delete": false
                },
                "master_penyewa": {
                    "view": false,
                    "create": false,
                    "edit": false,
                    "delete": true
                },
                "master_rekening": {
                    "view": false,
                    "create": false,
                    "edit": false,
                    "delete": false
                },
                "master_user": {
                    "view": false,
                    "create": false,
                    "edit": false,
                    "delete": false
                },
                "master_sopir": {
                    "view": false,
                    "create": false,
                    "edit": false,
                    "delete": false
                }
            },
        }
    };
  export let location;
</script>

<nav
  class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"
>
  <div
    class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"
  >
    <!-- Toggler -->
    <button
      class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
      type="button"
      on:click={() => toggleCollapseShow("bg-white m-2 py-3 px-6")}
    >
      <i class="fas fa-bars" />
    </button>
    <!-- Brand -->
    <a
      use:link
      class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
      href="/"
    >
      Notus Svelte
    </a>
    <!-- User -->
    <ul class="md:hidden items-center flex flex-wrap list-none">
      <li class="inline-block relative">
        <NotificationDropdown />
      </li>
      <li class="inline-block relative">
        <UserDropdown />
      </li>
    </ul>
    <!-- Collapse -->
    <div
      class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded {collapseShow}"
    >
      <!-- Collapse header -->
      <div
        class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200"
      >
        <div class="flex flex-wrap">
          <div class="w-6/12">
            <a
              use:link
              class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
              href="/"
            >
              Notus Svelte
            </a>
          </div>
          <div class="w-6/12 flex justify-end">
            <button
              type="button"
              class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
              on:click={() => toggleCollapseShow("hidden")}
            >
              <i class="fas fa-times" />
            </button>
          </div>
        </div>
      </div>
      <!-- Form -->
      <form class="mt-6 mb-4 md:hidden">
        <div class="mb-3 pt-0">
          <input
            type="text"
            placeholder="Search"
            class="border-0 px-3 py-2 h-12 border border-solid border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
          />
        </div>
      </form>

      <!-- Divider -->
      <hr class="my-4 md:min-w-full" />
      <!-- Heading -->
      <h6
        class="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline"
      >
        Master Data
      </h6>
      <!-- Navigation -->

      <ul class="md:flex-col md:min-w-full flex flex-col list-none">
        <li class="items-center">
          <a
            use:link
            href="/admin/dashboard"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/dashboard'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-tv mr-2 text-sm {location.href.indexOf(
                '/admin/dashboard'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Dashboard
          </a>
        </li>

        <li class="items-center">
          <a
            use:link
            href="/admin/settings"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/settings'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-tools mr-2 text-sm {location.href.indexOf(
                '/admin/settings'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Settings
          </a>
        </li>

        {#if userData.role.akses.master_penyewa.view === true}
        <li class="items-center">
          <a
            use:link
            href="/admin/penyewa"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/penyewa'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-tag mr-2 text-sm {location.href.indexOf(
                '/admin/penyewa'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Penyewa
          </a>
        </li>
        {/if}

        {#if userData.role.akses.master_sopir.view === true}
        <li class="items-center">
          <a
            use:link
            href="/admin/sopir"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/sopir'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-dharmachakra mr-2 text-sm {location.href.indexOf(
                '/admin/sopir'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Sopir
          </a>
        </li>
        {/if}

        {#if userData.role.akses.master_armada.view === true}
          <li class="items-center">
            <a
              use:link
              href="/admin/armada"
              class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
                '/admin/armada'
              ) !== -1
                ? 'text-red-500 hover:text-red-600'
                : 'text-blueGray-700 hover:text-blueGray-500'}"
            >
              <i
                class="fas fa-truck mr-2 text-sm {location.href.indexOf(
                  '/admin/armada'
                ) !== -1
                  ? 'opacity-75'
                  : 'text-blueGray-300'}"
              />
              Armada
            </a>
          </li>
        {/if}

        {#if userData.role.akses.master_rekening.view === true}
        <li class="items-center">
          <a
            use:link
            href="/admin/rekening"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/rekening'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-wallet mr-2 text-sm {location.href.indexOf(
                '/admin/rekening'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Rekening
          </a>
        </li>
        {/if}

        
        <li class="items-center">
          <a
            use:link
            href="/admin/subkon"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/subkon'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-wallet mr-2 text-sm {location.href.indexOf(
                '/admin/subkon'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Subkon
          </a>
        </li>

        {#if userData.role.akses.master_user.view === true}
        <li class="items-center">
          <a
            use:link
            href="/admin/users"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/users'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-wallet mr-2 text-sm {location.href.indexOf(
                '/admin/users'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Pegawai
          </a>
        </li>
        {/if}

        {#if userData.role.akses.master_user.view === true}
        <li class="items-center">
          <a
            use:link
            href="/admin/roles"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/roles'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-wallet mr-2 text-sm {location.href.indexOf(
                '/admin/roles'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Roles
          </a>
        </li>
        {/if}

        <li class="items-center">
          <a
            use:link
            href="/admin/tables"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/tables'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-table mr-2 text-sm {location.href.indexOf(
                '/admin/tables'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Tables
          </a>
        </li>

        <li class="items-center">
          <a
            use:link
            href="/admin/maps"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/maps'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-map-marked mr-2 text-sm {location.href.indexOf(
                '/admin/maps'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Maps
          </a>
        </li>
      </ul>

      <!-- Divider -->
      <hr class="my-4 md:min-w-full" />
      <!-- Heading -->
      <h6
        class="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline"
      >
        Data Transaksi
      </h6>
      <!-- Navigation -->

      <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
        <li class="items-center">
          <a
            use:link
            href="/transaksi/hutangSopir"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              'admin/transaksi/hutangSopir'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-wallet mr-2 text-sm {location.href.indexOf(
                '/transaksi/hutangSopir'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Data Hutang Sopir
          </a>
        </li>

        <li class="items-center">
          <a
            use:link
            href="/admin/transaksi/pengeluaran"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/transaksi/pengeluaran'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-wallet mr-2 text-sm {location.href.indexOf(
                '/admin/transaksi/pengeluaran'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Data Pengeluaran
          </a>
        </li>
        
        <li class="items-center">
          <a
            use:link
            href="/admin/transaksi/order"
            class="text-xs uppercase py-3 font-bold block {location.href.indexOf(
              '/admin/transaksi/order'
            ) !== -1
              ? 'text-red-500 hover:text-red-600'
              : 'text-blueGray-700 hover:text-blueGray-500'}"
          >
            <i
              class="fas fa-wallet mr-2 text-sm {location.href.indexOf(
                '/admin/transaksi/order'
              ) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'}"
            />
            Data Transaksi Order
          </a>
        </li>

        <li class="items-center">
          <a
            use:link
            class="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
            href="/auth/login"
          >
          <FontAwesomeLayers class="mr-2 text-sm text-blueGray-300">
            <FontAwesomeIcon icon={faFingerprint} />
          </FontAwesomeLayers>
            Login
          </a>
        </li>

        <li class="items-center">
          <a
            use:link
            class="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
            href="/auth/register"
          >
            <i class="fas fa-clipboard-list text-blueGray-300 mr-2 text-sm" />
            Register
          </a>
        </li>
      </ul>

      <!-- Divider -->
      <hr class="my-4 md:min-w-full" />
      <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
        <li class="items-center">
          <button
            use:link
            class="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block focus:outline-none"
            href="/auth/register"
            on:click={() => {
              document.cookie = "token" + "=; Path=/; Max-Age=-99999999;";
              navigate("/auth/login");
            }}
          >
            <i class="fas fa-clipboard-list text-blueGray-300 mr-2 text-sm" />
            Logout
          </button>
        </li>
      </ul>
      <!-- Heading -->
      <!-- <h6
        class="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline"
      >
        No Layout Pages
      </h6>
      Navigation

      <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
        <li class="items-center">
          <a
            use:link
            class="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
            href="/landing"
          >
            <i class="fas fa-newspaper text-blueGray-300 mr-2 text-sm"></i>
            Landing Page
          </a>
        </li>

        <li class="items-center">
          <a
            use:link
            class="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
            href="/profile"
          >
            <i class="fas fa-user-circle text-blueGray-300 mr-2 text-sm"></i>
            Profile Page
          </a>
        </li>
      </ul> -->
    </div>
  </div>
</nav>
