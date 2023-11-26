<script>
	import { getCookie } from 'svelte-cookie';
  import { Router, Route, navigate } from "svelte-routing";

  // components for this layout
  import AuthNavbar from "../notusComponents/Navbars/AuthNavbar.svelte";
  import FooterSmall from "../notusComponents/Footers/FooterSmall.svelte";

  // pages for this layout
  import Login from './../../src/views/auth/Login.svelte';
	import Register from './../../src/views/auth/Register.svelte';
  import { mainUrl } from '../environment';
  import { onMount } from 'svelte';

  const registerBg2 = "../assets/img/register_bg_2.png";
  export let location;
  export let auth = "";

  const token = getCookie("token");
  
  onMount(async () => {
    let res = await fetch(`${mainUrl}/api/getProfile`, {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: 'application/json'
      }
    })
    res = await res.json();
    if(res.status === 'success') {
      navigate('/admin/dashboard');
    }
  })
</script>

<div>
  <AuthNavbar />
  <main>
    <section class="relative w-full h-full py-40 min-h-screen">
      <div
        class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
        style="background-image: url({registerBg2});"
      ></div>
      <Router url="auth">
        <Route path="login" component="{Login}" />
        <Route path="register" component="{Register}" />
      </Router>
      <Router url="">
        <Route path="/" component="{Login}" />
        <!-- <Route path="register" component="{Register}" /> -->
      </Router>
      <!-- <FooterSmall absolute="true" /> -->
    </section>
  </main>
</div>
