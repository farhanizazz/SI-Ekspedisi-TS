<script lang="ts">
  import Invoices from "../../views/invoices/invoices.svelte";
  import { userStore } from "../../layouts/stores/AdminStore.ts";
  import { link, navigate } from "svelte-routing";
  // core components
  import CardStats from "../Cards/CardStats.svelte";
  import { onDestroy, onMount } from "svelte";
  import { getCookie } from "svelte-cookie";
  import { mainUrl } from "../../environment";
  import { selectedStore } from "./HeaderStore/Store.js";
  import { derived, writable } from "svelte/store";
  import { deleteCookie } from "../../helper/deleteCookie.js";
  import Modal from "../Modal/Modal.svelte";
  import axios from "axios";

  export let location;
  let userData;

  const unsubscribeUserData = userStore.subscribe((value) => {
    userData = value;
  });
  let data;
  fetch(`${mainUrl}/api/master/rekening/total`, {
    headers: {
      Authorization: `bearer ${getCookie("token")}`,
    },
  }).then((res) => {
    res.json().then((res) => {
      if (res.data === null) data = 0;
      else data = res.data;
    });
  });

  let selected: any;
  const unsubscribe = selectedStore.subscribe((value) => {
    selected = value;
  });

  function selectTab(index) {
    selectedStore.set(index);
  }

  onDestroy(() => {
    unsubscribe;
    unsubscribeUserData;
  });

  let alertModal = false;
  let errorRes = {};
</script>

<!-- Header -->
<div class="relative bg-red-500 md:pt-12 pb-32 pt-12">
  <div class="px-4 md:px-10 mx-auto w-full">
    <div class="px-4">
      <!-- Card stats -->
      <ul class="flex flex-col md:flex-row">
        <a use:link href="/admin/dashboard">
          <li
            class="px-6 py-3 {location.href.indexOf('/admin/dashboard') !== -1
              ? 'active'
              : ''}"
            on:click={() => {
              selectTab(1);
            }}
          >
            Dashboard
          </li>
        </a>
        <li
          class={`${selected == 2 ? "active" : ""} px-6 py-3`}
          on:click={() => {
            selectTab(2);
          }}
        >
          Master
        </li>
        <li
          class={`${selected == 3 ? "active" : ""} px-6 py-3`}
          on:click={() => {
            selectTab(3);
          }}
        >
          Transaksi
        </li>
        <a use:link href="/transaksi/invoice/buat">
          <li
            class={`${selected == 4 ? "active" : ""} px-6 py-3`}
            on:click={() => {
              selectTab(4);
            }}
          >
            Invoices
          </li>
        </a>
        <li
          class={`${selected == 6 ? "active" : ""} px-6 py-3`}
          on:click={() => {
            selectTab(6);
          }}
        >
          Laporan
        </li>
        <a use:link href="/admin/log">
          <li
            class={`${selected == 7 ? "active" : ""} px-6 py-3`}
            on:click={() => {
              selectTab(7);
            }}
          >
            Log Perubahan
          </li>
        </a>
        <li
          class={`px-6 py-3`}
          on:click={async () => {
            try {
              const res = await axios.post(
                `${mainUrl}/api/logout`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                }
              );
              if (res.data.status == "success") {
                navigate("/auth/login");
              }
            } catch (error) {
              errorRes = error;
              alertModal = true;
              console.log(errorRes);
            }
          }}
        >
          Logout
        </li>
      </ul>
      {#if alertModal}
      <Modal
      onReject={() => {
        alertModal = false;
      }}
      bind:showModal={alertModal}
      isLoading={false}
    >
      <h1 slot="header" class="font-semibold text-2xl">
        ERROR: {errorRes.code}
      </h1>
      <h3 class="text-lg mt-5">
        {errorRes.message}
        {errorRes.response.data.exception}
      </h3>
    </Modal>
      {/if}
      
      {#if selected == 2}
        <ul class="flex text-center">
          {#if userData.role.akses.master_sopir.view == true}
            <a use:link href="/admin/sopir">
              <li
                class="px-6 py-3 {location.href.indexOf('/admin/sopir') !== -1
                  ? 'active'
                  : ''}"
              >
                Master Sopir
              </li>
            </a>
          {/if}

          {#if userData.role.akses.master_penyewa.view == true}
            <a use:link href="/admin/penyewa">
              <li
                class="px-6 py-3 {location.href.indexOf('/admin/penyewa') !== -1
                  ? 'active'
                  : ''}"
              >
                Master Penyewa
              </li>
            </a>
          {/if}

          {#if userData.role.akses.master_armada.view == true}
            <a use:link href="/admin/armada">
              <li
                class="px-6 py-3 {location.href.indexOf('/admin/armada') !== -1
                  ? 'active'
                  : ''}"
              >
                Master Armada
              </li>
            </a>
          {/if}

          {#if userData.role.akses.master_rekening.view == true}
            <a use:link href="/admin/rekening">
              <li
                class="px-6 py-3 {location.href.indexOf('/admin/rekening') !==
                -1
                  ? 'active'
                  : ''}"
              >
                Master Rekening
              </li>
            </a>
          {/if}

          <a use:link href="/admin/tambahan">
            <li
              class="px-6 py-3 {location.href.indexOf('/admin/tambahan') !== -1
                ? 'active'
                : ''}"
            >
              Master Tambahan
            </li>
          </a>

          <a use:link href="/admin/subkon">
            <li
              class="px-6 py-3 {location.href.indexOf('/admin/subkon') !== -1
                ? 'active'
                : ''}"
            >
              Master Subkon
            </li>
          </a>
        </ul>
        <ul class="flex text-center">
          {#if userData.role.akses.master_user.view == true}
            <a use:link href="/admin/users">
              <li
                class="px-6 py-3 {location.href.indexOf('/admin/users') !== -1
                  ? 'active'
                  : ''}"
              >
                Master Pegawai
              </li>
            </a>
          {/if}

          <a use:link href="/admin/roles">
            <li
              class="px-6 py-3 {location.href.indexOf('/admin/roles') !== -1
                ? 'active'
                : ''}"
            >
              Master Akses
            </li>
          </a>
        </ul>
      {/if}

      {#if selected == 3}
        <ul class="flex">
          <a use:link href="/transaksi/order">
            <li
              class="px-6 py-3 {location.href.indexOf('/transaksi/order') !== -1
                ? 'active'
                : ''}"
            >
              Transaksi Transaksi Order
            </li></a
          >
          <a use:link href="/transaksi/hutangSopir">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/transaksi/hutangSopir'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Transaksi Hutang Sopir
            </li>
          </a>
          <a use:link href="/transaksi/tPengeluaran">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/transaksi/tPengeluaran'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Transaksi Pengeluaran
            </li>
          </a>
        </ul>
      {/if}
      {#if selected == 6}
        <ul class="flex">
          <a use:link href="/laporan/pemasukanCV">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/pemasukanCV'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan Pemasukan CV
            </li></a
          >
          <a use:link href="/laporan/pemasukanKendaraan">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/pemasukanKendaraan'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan Pemasukan Kendaraan
            </li>
          </a>
          <a use:link href="/laporan/pengeluaran">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/pengeluaran'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan Pengeluaran
            </li>
          </a>
          <a use:link href="/laporan/lHutangSopir">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/lHutangSopir'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan Rincian Uang Jalan
            </li>
          </a>
          <a use:link href="/laporan/hutangCustomer">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/hutangCustomer'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan Hutang Customer
            </li>
          </a>
          <a use:link href="/laporan/hutangSubkon">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/hutangSubkon'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan Hutang Subkon
            </li>
          </a>
          <a use:link href="/laporan/kasHarian">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/kasHarian'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan Kas Harian
            </li>
          </a>
        </ul>
        <ul class="flex">
          <a use:link href="/laporan/thrSopir">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/thrSopir'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan THR Wajib Sopir
            </li>
          </a>
          <a use:link href="/laporan/armadaRugiLaba">
            <li
              class="px-6 py-3 {location.pathname === '/laporan/armadaRugiLaba' ? 'active' : ''}"
            >
              Laporan Rugi Laba
            </li>
          </a>
          <a use:link href="/laporan/bukuBesar">
            <li
              class="px-6 py-3 {location.href.indexOf(
                '/laporan/bukuBesar'
              ) !== -1
                ? 'active'
                : ''}"
            >
              Laporan Buku Besar
            </li>
          </a>
          <a use:link href="/laporan/armadaRugiLabaPajak">
            <li
              class="px-6 py-3 {location.pathname === '/laporan/armadaRugiLabaPajak' ? 'active' : ''}"
            >
              Laporan Laba Rugi Pajak
            </li>
          </a>
        </ul>
      {/if}
      <!-- <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="TOTAL REKENING"
            statTitle={data}
            statArrow="up"
            statPercent="3.48"
            statPercentColor="text-emerald-500"
            statDescripiron="Since last month"
            statIconName="fas fa-money-check-alt"
            statIconColor="bg-red-500"
          />
        </div>
        <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="NEW USERS"
            statTitle="2,356"
            statArrow="down"
            statPercent="3.48"
            statPercentColor="text-red-500"
            statDescripiron="Since last week"
            statIconName="fas fa-chart-pie"
            statIconColor="bg-orange-500"
          />
        </div>
        <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="SALES"
            statTitle="924"
            statArrow="down"
            statPercent="1.10"
            statPercentColor="text-orange-500"
            statDescripiron="Since yesterday"
            statIconName="fas fa-users"
            statIconColor="bg-pink-500"
          />
        </div>
        <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
          <CardStats
            statSubtitle="PERFORMANCE"
            statTitle="49,65%"
            statArrow="up"
            statPercent="12"
            statPercentColor="text-emerald-500"
            statDescripiron="Since last month"
            statIconName="fas fa-percent"
            statIconColor="bg-emerald-500"
          />
        </div> -->
    </div>
  </div>
</div>

<style>
  li {
    padding-left: 1.5rem /* 24px */;
    padding-right: 1.5rem /* 24px */;
    padding-top: 0.75rem /* 12px */;
    padding-bottom: 0.75rem /* 12px */;
    border-radius: 0.375rem /* 6px */;
    color: #fff;
    cursor: pointer;
  }

  li:hover {
    background-color: #00000042;
    border-radius: 0.375rem /* 6px */;
  }

  .active {
    background-color: #fff;
    border-radius: 0.375rem /* 6px */;
    cursor: default;
    color: #000;
  }

  .active:hover {
    background-color: #fff;
    border-radius: 0.375rem /* 6px */;
  }
</style>
