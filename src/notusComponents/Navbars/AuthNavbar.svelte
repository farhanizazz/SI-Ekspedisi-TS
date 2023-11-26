<script>
  import { link } from "svelte-routing";

  // core components
  import PagesDropdown from "../Dropdowns/PagesDropdown.svelte";

  let navbarOpen = false;

  function setNavbarOpen() {
    navbarOpen = !navbarOpen;
  }
</script>

<nav
  class="top-0 absolute z-50 w-full flex flex-wrap items-center justify-center px-2 py-3 navbar-expand-lg"
>
  <a
    use:link
    class="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
    href="/"
  >
    Sistem Informasi Pancurmas
  </a>
</nav>
