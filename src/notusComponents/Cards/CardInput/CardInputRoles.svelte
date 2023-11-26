<script>
  import { getCookie } from "svelte-cookie";
  import { navigate } from "svelte-routing";
  import { mainUrl } from "../../../environment";

  let error = {};
  let data = {
    name: "",
    akses: {
      master_armada: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      master_penyewa: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      master_rekening: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      master_user: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      master_sopir: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    },
  };

  $: console.log(data.akses.master_armada.view);
  function handleSubmit() {
    const response = fetch(`${mainUrl}/api/master/roles`, {
      headers: {
        Authorization: `bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((res) => {
        console.log(res);
        if (res.status != "error") {
          navigate("/admin/roles");
        } else {
          error = res.message;
        }
      });
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">Masukkan data akses</h6>
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
        <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-supir"
            >
              Nama Akses
            </label>
            <input
              id="grid-supir"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Masukkan nama perusahaan"
              name="nama-supir"
              bind:value={data.name}
            />
            {#if "name" in error}
              <p class="text-red-500 text-sm">{error.name}</p>
            {/if}
          </div>
        </div>

        <div class="relative w-full mb-3">
          <label
            class="block text-blueGray-600 text-xl font-bold mb-2"
            for="akses-armada"
          >
            Akses
          </label>
        </div>
        <div class="w-full lg:w-3/12 px-4">
          <div
            class="uppercase text-blueGray-600 text-xs font-bold mb-2 flex flex-col"
          >
            <div class="justify-between flex mb-2">
              <label for="read-armada" class="text-xs"> Armada </label>
              <input
                id="read-armada"
                type="checkbox"
                class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                placeholder="Masukkan nama perusahaan"
                name="nama-supir"
                bind:checked={data.akses.master_armada.view}
              />
            </div>
            {#if data.akses.master_armada.view}
              <div class="justify-between flex mb-2">
                <label for="create-armada" class="text-xs">
                  Tambahkan Armada
                </label>
                <input
                  id="create-armada"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_armada.create}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="delete-armada" class="text-xs">
                  Hapus Armada
                </label>
                <input
                  id="delete-armada"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_armada.delete}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="edit-armada" class="text-xs"> Edit Armada </label>
                <input
                  id="edit-armada"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_armada.edit}
                />
              </div>
            {/if}
          </div>
        </div>

        <!-- Data Penyewa -->
        <div class="w-full lg:w-3/12 px-4">
          <div
            class="uppercase text-blueGray-600 text-xs font-bold mb-2 flex flex-col"
          >
            <div class="justify-between flex mb-2">
              <label for="read-penyewa" class="text-xs"> Penyewa </label>
              <input
                id="read-penyewa"
                type="checkbox"
                class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                placeholder="Masukkan nama perusahaan"
                name="nama-supir"
                bind:checked={data.akses.master_penyewa.view}
              />
            </div>
            {#if data.akses.master_penyewa.view}
              <div class="justify-between flex mb-2">
                <label for="create-penyewa" class="text-xs">
                  Tambahkan Penyewa
                </label>
                <input
                  id="create-penyewa"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_penyewa.create}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="delete-penyewa" class="text-xs"> Hapus Penyewa </label>
                <input
                  id="delete-penyewa"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_penyewa.delete}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="edit-penyewa" class="text-xs"> Edit Penyewa </label>
                <input
                  id="edit-penyewa"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_penyewa.edit}
                />
              </div>
            {/if}
          </div>
        </div>

        <!-- Data Rekening -->
        <div class="w-full lg:w-3/12 px-4">
          <div
            class="uppercase text-blueGray-600 text-xs font-bold mb-2 flex flex-col"
          >
            <div class="justify-between flex mb-2">
              <label for="read-rekening" class="text-xs"> Rekening </label>
              <input
                id="read-rekening"
                type="checkbox"
                class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                placeholder="Masukkan nama perusahaan"
                name="nama-supir"
                bind:checked={data.akses.master_rekening.view}
              />
            </div>
            {#if data.akses.master_rekening.view}
              <div class="justify-between flex mb-2">
                <label for="create-rekening" class="text-xs">
                  Tambahkan Rekening
                </label>
                <input
                  id="create-rekening"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_rekening.create}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="delete-rekening" class="text-xs"> Hapus Rekening </label>
                <input
                  id="delete-rekening"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_rekening.delete}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="edit-rekening" class="text-xs"> Edit Rekening </label>
                <input
                  id="edit-rekening"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_rekening.edit}
                />
              </div>
            {/if}
          </div>
        </div>

        <!-- Data Users -->
        <div class="w-full lg:w-3/12 px-4">
          <div
            class="uppercase text-blueGray-600 text-xs font-bold mb-2 flex flex-col"
          >
            <div class="justify-between flex mb-2">
              <label for="read-user" class="text-xs"> User </label>
              <input
                id="read-user"
                type="checkbox"
                class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                placeholder="Masukkan nama perusahaan"
                name="nama-supir"
                bind:checked={data.akses.master_user.view}
              />
            </div>
            {#if data.akses.master_user.view}
              <div class="justify-between flex mb-2">
                <label for="create-user" class="text-xs">
                  Tambahkan User
                </label>
                <input
                  id="create-user"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_user.create}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="delete-user" class="text-xs"> Hapus User </label>
                <input
                  id="delete-user"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_user.delete}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="edit-user" class="text-xs"> Edit User </label>
                <input
                  id="edit-user"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_user.edit}
                />
              </div>
            {/if}
          </div>
        </div>

        <!-- Data Sopir -->
        <div class="w-full lg:w-3/12 px-4">
          <div
            class="uppercase text-blueGray-600 text-xs font-bold mb-2 flex flex-col"
          >
            <div class="justify-between flex mb-2">
              <label for="read-sopir" class="text-xs"> Sopir </label>
              <input
                id="read-sopir"
                type="checkbox"
                class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                placeholder="Masukkan nama perusahaan"
                name="nama-supir"
                bind:checked={data.akses.master_sopir.view}
              />
            </div>
            {#if data.akses.master_sopir.view}
              <div class="justify-between flex mb-2">
                <label for="create-sopir" class="text-xs">
                  Tambahkan Sopir
                </label>
                <input
                  id="create-sopir"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_sopir.create}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="delete-sopir" class="text-xs"> Hapus Sopir </label>
                <input
                  id="delete-sopir"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_sopir.delete}
                />
              </div>
              <div class="justify-between flex mb-2">
                <label for="edit-sopir" class="text-xs"> Edit Sopir </label>
                <input
                  id="edit-sopir"
                  type="checkbox"
                  class="shadow form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  placeholder="Masukkan nama perusahaan"
                  name="nama-supir"
                  bind:checked={data.akses.master_sopir.edit}
                />
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</form>
