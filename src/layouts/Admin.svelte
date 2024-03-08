<script>
// @ts-nocheck

  import { notificationsStore } from "./stores/AdminStore.js";
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
  import Settings from "../views/admin/Settings.svelte";
  import Tables from "../views/admin/Tables.svelte";
  import Maps from "../views/admin/Maps.svelte";
  import Penyewa from "../views/admin/Penyewa.svelte";
  import Sopir from "../views/admin/Sopir.svelte";
  import Armada from "../views/admin/Armada.svelte";
  import Rekening from "../views/admin/Rekening/Rekening.svelte";
  import Subkon from "../views/admin/Subkon.svelte";
  import HutangSopir from "../views/admin/HutangSopir.svelte";
  import Pengeluaran from "../views/laporan/Pengeluaran/Pengeluaran.svelte";
  import { onMount } from "svelte";
  import { mainUrl } from "../environment";
  import { getCookie } from "svelte-cookie";
  import Users from "../views/admin/Users.svelte";
  import Roles from "../views/admin/Roles.svelte";
  import Tambahan from "../views/admin/Tambahan.svelte";
  import { get } from "svelte/store";

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
      userData = await res.data;
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
          Toastify({
            text: e.message,
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
            onClick: function () {}, // Callback after click
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
      </Router>
      <Router url="transaksi">
        <Route path="pengeluaran/*pengeluaran" component={Pengeluaran} />
        <Route path="hutangSopir/*hutangSopir" component={HutangSopir} />
        <Route path="order/*order" component={Transaksi} />
      </Router>
      <FooterAdmin />
    </div>
  </div>
</div>
