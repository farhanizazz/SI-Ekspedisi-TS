<script>
  // @ts-nocheck
  
  import { notificationsStore, userStore } from "./stores/AdminStore.ts";
  import Transaksi from "../views/laporan/Order/Transaksi.svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import Toastify from "toastify-js";
  
  // components for this layout
  import AdminNavbar from "../notusComponents/Navbars/AdminNavbar.svelte";
  import Sidebar from "../notusComponents/Sidebar/Sidebar.svelte";
  import HeaderStats from "../notusComponents/Headers/HeaderStats.svelte";
  import FooterAdmin from "../notusComponents/Footers/FooterAdmin.svelte";
  
  // pages for this layout
  import Dashboard from "../views/admin/Dashboard.svelte";
	import Invoices from '../views/invoices/invoices.svelte';
  import Settings from "../views/admin/Settings.svelte";
  import Tables from "../views/admin/Tables.svelte";
  import Maps from "../views/admin/Maps.svelte";
  import Penyewa from "../views/admin/Penyewa.svelte";
  import Sopir from "../views/admin/Sopir.svelte";
  import Armada from "../views/admin/Armada.svelte";
  import Rekening from "../views/admin/Rekening/Rekening.svelte";
  import Subkon from "../views/admin/Subkon.svelte";
  import Invoice from "../views/laporan/Invoice/Invoice.svelte";
  import { onMount } from "svelte";
  import { mainUrl } from "../environment";
  import { getCookie } from "svelte-cookie";
  import Users from "../views/admin/Users.svelte";
  import Roles from "../views/admin/Roles.svelte";
  import Tambahan from "../views/admin/Tambahan.svelte";
  import { get } from "svelte/store";
  import ListInvoices from "../views/invoices/listInvoices.svelte";
  import HutangSopir from "../views/laporan/HutangSopir/HutangSopir.svelte";
  import PemasukanCv from "../views/laporan/PemasukanCV/PemasukanCV.svelte";
  import PemasukanKendaraan from "../views/laporan/PemasukanKendaraan/PemasukanKendaraan.svelte";
  import Pengeluaran from "../views/laporan/Pengeluaran/Pengeluaran.svelte";
  import LaporanHutangSopir from "../views/laporan/LaporanHutangSopir/LaporanRincianUangJalan.svelte";
  import HutangCustomer from "../views/laporan/HutangCustomer/HutangCustomer.svelte";
  import HutangSubkon from "../views/laporan/HutangSubkon/HutangSubkon.svelte";
  import LogPerubahan from "../views/log/perubahan/LogPerubahan.svelte";
  import KasHarian from "/src/views/laporan/KasHarian/KasHarian.svelte";
  import ThrSopir from "/src/views/laporan/ThrSopir/ThrSopir.svelte";
  import ArmadaRugiLaba from "/src/views/laporan/armadaRugiLaba/ArmadaRugiLaba.svelte";
  import BukuBesar from "/src/views/laporan/BukuBesar/BukuBesar.svelte";
  import ArmadaRugiLabaPajak from "/src/views/laporan/armadaRugiLabaPajak/ArmadaRugiLabaPajak.svelte";

  export let location;
  export let admin = "";

  const token = getCookie("token");
  let userData;
  let isMounted = false;

  onMount(async () => {
    if (!isMounted) {
      let res = await fetch(`${mainUrl}/api/getProfile`, {
        headers: {
          Authorization: `bearer ${token}`,
          Accept: "application/json",
        },
      });
      res = await res.json();
      // userData = await res.data;
      userStore.set(await res.data);
      if (res.status !== "success") {
        navigate("/auth/login");
      }

      if (get(notificationsStore).length == 0) {
        let notifications = await fetch(
          `${mainUrl}/api/notifikasi/getReminderPajak`,
          {
            headers: {
              Authorization: `bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        notificationsStore.set(await notifications.json());
        let notif = get(notificationsStore);

        notif.data.forEach((e) => {
          var toast = Toastify({
            text: e.message + " " + e.selisih,
            duration: -1,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: `${
                e.selisih.includes("terlewati") ? "#ef4444" : "#f59e0b"
              }`,
            },
            onClick: function () {
              toast.hideToast();
            },
          }).showToast();
        });
      }
      isMounted = true;
    }
  });
</script>

<div>
  <!-- <Sidebar {location} {userData}/> -->
  <HeaderStats {location} {userData} />
  <div class="relative bg-blueGray-100">
    <!-- <AdminNavbar /> -->
    <div class="px-4 mx-auto w-full -m-24">
      <Router url="admin">
        <Route path="dashboard" component={Dashboard} />
        <Route path="settings" component={Settings} />
        <Route path="tables" component={Tables} />
        <Route path="maps" component={Maps} />
        <Route path="penyewa/*penyewa" component={Penyewa} />
        <Route path="sopir/*sopir" component={Sopir} />
        <Route path="armada/*armada" component={Armada} />
        <Route path="rekening/*rekening" component={Rekening} />
        <Route path="subkon/*subkon" component={Subkon} />
        <Route path="users/*users" component={Users} />
        <Route path="roles/*roles" component={Roles} />
        <Route path="tambahan/*tambahan" component={Tambahan} />
        <Route path="log/*log" component={LogPerubahan} />
      </Router>
      <Router url="transaksi">
        <Route path="hutangSopir/*hutangSopir" component={HutangSopir} />
        <Route path="order/*order" component={Transaksi} />
        <Route path="tPengeluaran" component={Invoice}/>
      </Router>
      <Router url="laporan">
        <Route path="pemasukanCV/*pemasukanCV" component={PemasukanCv} />
        <Route path="lHutangSopir/*lHutangSopir" component={LaporanHutangSopir} />
        <Route path="pemasukanKendaraan/*pemasukanKendaraan" component={PemasukanKendaraan} />
        <Route path="pengeluaran/*pengeluaran" component={Pengeluaran} />
        <Route path="hutangSubkon/*hutangSubkon" component={HutangSubkon} />
        <Route path="hutangCustomer/*hutangCustomer" component={HutangCustomer} />
        <Route path="kasHarian/*kasHarian" component={KasHarian} />
        <Route path="thrSopir/*thrSopir" component={ThrSopir} />
        <Route path="armadaRugiLaba/*armadaRugiLaba" component={ArmadaRugiLaba} />
        <Route path="armadaRugiLabaPajak/*armadaRugiLabaPajak" component={ArmadaRugiLabaPajak} />
        <Route path="bukuBesar/*bukuBesar" component={BukuBesar} />
      </Router>
      <Router url="invoice">
        <Route path="invoice/buat" component={Invoices} />
        <Route path="invoice/lihat" component={ListInvoices} />
      </Router>
      <FooterAdmin />
    </div>
  </div>
</div>
