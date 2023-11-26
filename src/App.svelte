<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  // Admin Layout
  import Admin from "./layouts/Admin.svelte";
  // Auth Layout
  import Auth from "./layouts/Auth.svelte";

  // No Layout Pages
  import Index from "./views/Index.svelte";
  import Landing from "./views/Landing.svelte";
  import Profile from "./views/Profile.svelte";

  export let url = "";

  // const queryClient = new QueryClient();
</script>

  <svelte:head>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
    />
  </svelte:head>
  <Router {url}>
    <!-- admin layout -->
    <Route path="admin/*admin" component={Admin} />
    <Route path="transaksi/*transaksi" component={Admin} />
    <!-- auth layout -->
    <Route path="auth/*auth" component={Auth} />
    <!-- no layout pages -->
    <Route path="landing" component={Landing} />
    <Route path="profile" component={Profile} />
    <Route path="/" component={Auth} />
  </Router>
