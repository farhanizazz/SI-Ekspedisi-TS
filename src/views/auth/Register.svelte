<script>
  import { isLoading } from "./store/stores.ts";
  import { mainUrl } from "./../../environment.js";
  import { link, navigate } from "svelte-routing";
  import { onDestroy } from "svelte";
  // core components
  const github = "../assets/img/github.svg";
  const google = "../assets/img/google.svg";
  export let location;
  let loadingState;

  const unsubscribe = isLoading.subscribe((value) => {
    loadingState = value;
  });
  let error = {};

  let data = {
    username: "",
    email: "",
    name: "",
    password: "",
  };

  async function handleSubmit() {
    const res = fetch(`${mainUrl}/api/register`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((res) => {
        if (res.status != "error") {
          navigate("/auth/login");
        } else {
          error = res.message;
        }
      });
    });
  }

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="container mx-auto px-4 h-full">
  <div class="flex content-center items-center justify-center h-full">
    <div class="w-full lg:w-6/12 px-4">
      <div
        class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
      >
        <div class="flex-auto px-4 lg:px-10 py-10">
          <div class="text-blueGray-400 text-center mb-3 font-bold" />
          <form on:submit|preventDefault={handleSubmit}>
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-name"
              >
                Nama Pengguna
              </label>
              <input
                id="grid-name"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Nama pengguna"
                bind:value={data.name}
              />
              {#if "name" in error}
                <p class="text-red-500 text-sm">{error.name}</p>
              {/if}
            </div>

            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-name"
              >
                Username
              </label>
              <input
                id="grid-name"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Username"
                bind:value={data.username}
              />

              {#if "username" in error}
                <p class="text-red-500 text-sm">{error.username}</p>
              {/if}
            </div>

            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-email"
              >
                Email
              </label>
              <input
                id="grid-email"
                type="email"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Email"
                bind:value={data.email}
              />

              {#if "email" in error}
                <p class="text-red-500 text-sm">{error.email}</p>
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
              {#if "password" in error}
                <p class="text-red-500 text-sm">{error.password}</p>
              {/if}
            </div>

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
                  Create Account
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
        <div class="w-1/2 text-right">
          <a use:link href="/auth/login" class="text-blueGray-200">
            <small>Login to existing account</small>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
