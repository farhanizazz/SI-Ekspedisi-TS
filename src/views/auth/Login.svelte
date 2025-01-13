<script>
  import { isLoading } from "./store/stores.ts";
  import { mainUrl } from "./../../environment.js";
  import { link, navigate } from "svelte-routing";
  import { setCookie } from "svelte-cookie";
  import { onDestroy } from "svelte";
  // core components
  export let location;
  let error = [];
  let loadingState;

  const unsubscribe = isLoading.subscribe((value) => {
    loadingState = value;
  });

  let data = {
    username: "",
    password: "",
  };

  onDestroy(() => {
    unsubscribe();
  });

  async function handleSubmit() {
    isLoading.set(true);
    const res = await fetch(`${mainUrl}/api/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((res) => {
        if (res.status != "error") {
          setCookie("token", res.data.access_token, res.data.expires_in, true);
          navigate("/admin/dashboard");
          isLoading.set(false);
        } else {
          isLoading.set(false);
          error = res.message;
        }
      });
    });
  }
</script>

<div class="container mx-auto px-4 h-full">
  <div class="flex content-center items-center justify-center h-full">
    <div class="w-full lg:w-4/12 px-4">
      <div
        class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
      >
        <div class="flex-auto px-4 lg:px-10 py-10">
          <form on:submit|preventDefault={handleSubmit}>
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-email"
              >
                Username
              </label>
              <input
                id="grid-email"
                type=""
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Username"
                bind:value={data.username}
              />
              {#if typeof error == "object" && "username" in error}
                <div class="text-center mt-6">
                  <p class="text-red-500 text-sm">{error.username}</p>
                </div>
              {/if}
            </div>

            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-password"
              >
                Password
              </label>
              <input
                id="grid-password"
                type="password"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Password"
                bind:value={data.password}
              />
              {#if typeof error == "object" && "password" in error}
                <div class="text-center mt-6">
                  <p class="text-red-500 text-sm">{error.password}</p>
                </div>
              {/if}
            </div>
            <div>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  id="customCheckLogin"
                  type="checkbox"
                  class="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                />
                <span class="ml-2 text-sm font-semibold text-blueGray-600">
                  Remember me
                </span>
              </label>
            </div>

            {#if typeof error === "string"}
              <div class="text-center mt-6">
                <p class="text-red-500 text-sm">{error}</p>
              </div>
            {/if}

            <div class="text-center mt-6">
              <button
                class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
              >
                {#if loadingState}
                  <i
                    class="fa-solid fa-spinner fa-spin-pulse {loadingState
                      ? 'hidden'
                      : ''}"
                  ></i>
                {:else}
                  Sign In
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="flex flex-wrap mt-6 relative">
        <div class="w-1/2">
          <a
            href="#"
            on:click={(e) => e.preventDefault()}
            class="text-blueGray-200"
          >
            <small>Forgot password?</small>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
