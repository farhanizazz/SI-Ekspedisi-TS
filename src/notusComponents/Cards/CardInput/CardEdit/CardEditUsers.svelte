<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../../environment";
  import { getCookie } from "svelte-cookie";

  export let id;
  let error = {};
  let data = {
    name: "",
    username: "",
    email: "",
    role_name: "",
    m_role_id: ''
  };

  let confirmPassword = '';

  let roles = [];

  onMount(async () => {
    const res = await fetch(`${mainUrl}/api/master/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${getCookie("token")}`,
      },
    });
    res.json().then((res) => {
      data = res.data;
      data.role_name = res.data.role.name;
    });

    fetch(`${mainUrl}/api/master/roles`, {
      headers: {
        Authorization: `bearer ${getCookie('token')}`
      }
    }).then((res) => {
      res.json().then((res) => {
        roles = res.data
      })
    })
  });

  async function handleSubmit() {
    fetch(`${mainUrl}/api/master/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${getCookie("token")}`,
      },
      method: "PUT",
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then((res) => {
        console.log(res)
        if (res.status != "error") {
          navigate("/admin/users");
        } else {
          error = res.message;
        }

      })
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">
          Masukkan data subkon
        </h6>
        <button
          class="bg-red-400 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="submit"
        >
          Tambahkan
        </button>
      </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10">
      <div class="flex flex-wrap">
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-supir"
            >
              Nama Pegawai
            </label>
            <input
              id="grid-supir"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama pegawai"
              name="nama-pegawai"
              bind:value={data.name}
            />
            {#if "name" in error}
              <p class="text-red-500 text-sm">{error.name}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-alamat"
            >
              Username
            </label>
            <input
              id="grid-alamat"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan Username Pegawai"
              name="Username"
              bind:value={data.username}
            />
            {#if "username" in error}
              <p class="text-red-500 text-sm">{error.username}</p>
            {/if}
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-email"
            >
              Email
            </label>
            <input
              id="grid-email"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama penanggung jawab"
              name="email"
              bind:value={data.email}
            />
            {#if "email" in error}
              <p class="text-red-500 text-sm">{error.email}</p>
            {/if}
          </div>
        </div>

        <div class="flex flex-wrap flex-grow">
          <div class="w-full w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-role"
              >
                Hak Akses
              </label>
              <select
                id="grid-about-me"
                type="number"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                rows="4"
                bind:value={data.m_role_id}
              >
              <option value="null">Silahkan Pilih Hak Akses</option>
                {#each roles as role}
                  <option value={role.id}>{`${role.name}`}</option>
                {/each}
              </select>
              {#if "role_name" in error}
                <p class="text-red-500 text-sm">{error.role_name}</p>
              {/if}
            </div>
          </div>
        </div>

        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-email"
            >
              Password
            </label>
            <input
              id="grid-email"
              type="password"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama penanggung jawab"
              name="email"
              bind:value={data.password}
            />
            {#if "password" in error}
              <p class="text-red-500 text-sm">{error.password}</p>
            {/if}
          </div>
        </div>

        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-email"
            >
              Ulangi password
            </label>
            <input
              id="grid-email"
              type="password"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama penanggung jawab"
              name="email"
              bind:value={confirmPassword}
            />
            {#if "confirm_password" in error}
              <p class="text-red-500 text-sm">{error.confirm_password}</p>
            {/if}
          </div>
      </div>
    </div>
  </div>
</form>
