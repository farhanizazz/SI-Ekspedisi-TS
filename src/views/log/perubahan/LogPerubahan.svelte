<script>
    import CardTable from "../../../notusComponents/Cards/CardTable.svelte";
    // core components
    import { Router, Route } from "svelte-routing";
    import { getCookie } from "svelte-cookie";
    import { mainUrl } from "../../../environment";
    import CardInputRoles from "../../../notusComponents/Cards/CardInput/CardInputRoles.svelte";
    import CardEditRoles from "../../../notusComponents/Cards/CardInput/CardEdit/CardEditRoles.svelte";
    import Modal from "../../../notusComponents/Modal/Modal.svelte";
    import Pagination from "../../../notusComponents/Pagination/Pagination.svelte";
    import { writable } from "svelte/store";
    import axios from "axios";
    import { onMount } from "svelte";
    import Select from "svelte-select";
    import { IDRFormatter } from "../../../helper/idrFormatter";
    import CardTableLogPerubahan from "./CardTableLogPerubahan.svelte";
  
    let data = [];
    let total_hutang;
    const heading = [
      "Nama pengguna",
      "Data baru",
      "Lokasi Perubahan",
      "Aksi",
      "Tanggal perubahan"
    ];
    const today = new Date();
    let tglAwal = today.toISOString().substring(0, 10);
    let tglAkhir = today.toISOString().substring(0, 10);
    let debounceTimeout;
    let page;
    const currentPage = writable(0);
    let selectedPenyewa = [];
    let selectedStatus = "all";
    let jenis = "";
  
    function fetchData(tglAwal, tglAkhir, currentPage, armadaId, status) {
      console.log(armadaId);
      if (armadaId != null) {
        fetch(
          `${mainUrl}/api/log?tanggalAwal=${tglAwal}&tanggalAkhir=${tglAkhir}&page=${currentPage + 1}`,
          {
            headers: {
              Authorization: `bearer ${getCookie("token")}`,
            },
          }
        ).then((res) => {
          res.json().then((res) => {
            res.data.forEach((e) => {
              delete e.akses;
              if (e.nopol_subkon == null)
                e.nopol_subkon = "Tidak ada data subkon";
              if (e.sopir_subkon == null)
                e.sopir_subkon = "Tidak ada data subkon";
              if (e.armada != null) {
                e.armada = e.armada.nopol;
              } else {
                e.armada = "Tidak ada armada";
              }
              if (e.penyewa != null) {
                e.penyewa = e.penyewa.nama_perusahaan;
              } else {
                e.penyewa = "Tidak ada data penyewa";
              }
              if (e.subkon != null) {
                e.subkon = e.subkon.nama;
              } else {
                e.subkon = "Tidak ada data subkon";
              }
            });
            // page = res.data.meta.links.length;
            // console.log(page);
            data = res.data;
            console.log(data);
          });
        });
      } else {
        page = 0;
        data = [];
      }
    }
  
    let penyewaData = [];
  
    async function getPenyewa() {
      const response = await axios.get(`${mainUrl}/api/master/penyewa`, {
        headers: {
          Authorization: `bearer ${getCookie("token")}`,
        },
      });
      return response.data.data;
    }
  
    onMount(() => {
      getPenyewa().then((res) => {
        penyewaData = res;
      });
    });
  
    $: {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        fetchData(
          tglAwal,
          tglAkhir,
          $currentPage,
          selectedPenyewa,
          selectedStatus
        );
      }, 1000); // Adjust the delay as needed (500ms in this case)
    }
  </script>
  
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <!-- <div style="display: flex; justify-content: center; align-items: center;">
        <Pagination
          onLast={() => {
            fetchData(tglAwal, tglAkhir, $currentPage + 1);
          }}
          onFirst={() => {
            fetchData(tglAwal, tglAkhir, $currentPage + 1);
          }}
          {currentPage}
          pageCount={page}
          onNext={() => {
            currentPage.set($currentPage + 1);
          }}
          onPrev={() => {
            currentPage.set($currentPage - 1);
          }}
          onSeek={(page) => {
            currentPage.set(page);
          }}
        />
      </div>
      <div class="flex justify-between items-center">
        <div class="flex flex-row items-center gap-3 my-2 w-3/4">
          <h1>Tanggal Awal:</h1>
          <input
            bind:value={tglAwal}
            type="date"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
            placeholder="Tanggal Awal"
          />
          <h1>Tanggal Akhir:</h1>
          <input
            bind:value={tglAkhir}
            type="date"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
            placeholder="Tanggal Akhir"
          />
        </div>
      </div> -->
      {#if total_hutang != null}
        <div>
          <h1 class="px-7 pt-3 bg-white rounded">
            Total Hutang: Rp. {IDRFormatter.format(total_hutang)}
          </h1>
        </div>
      {/if}
      <Router route="log">
        <Route path="">
          <CardTableLogPerubahan
            tableHeading={heading}
            href="/admin/roles"
            addData={false}
            withEdit={false}
            heading="Data Log Perubahan"
            {data}
            withDelete={false}
            onLoad={fetchData}
            subtotal="sisa_tagihan"
          />
        </Route>
      </Router>
    </div>
  </div>
  