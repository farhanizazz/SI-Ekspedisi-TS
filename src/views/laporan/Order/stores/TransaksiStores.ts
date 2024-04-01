import { writable } from "svelte/store";
import { getCookie } from "svelte-cookie";
import { mainUrl } from "../../../../environment";


export const transaksi = writable([]);
export const isDataValid = writable(false);
export const currentPage = writable(0);
export const search = writable("");

let metaData = { links: [] };

async function fetchData(url = `${mainUrl}/api/transaksi/order`) {
  const res = await fetch(url, {
    headers: {
      Authorization: `bearer ${getCookie("token")}`,
    },
  });

  const json = (await res.json()).data;
  json.list.forEach((e) => {
    if (e.biaya_lain_harga_jual == null) e.biaya_lain_harga_jual = [];
    if (e.biaya_lain_uang_jalan == null) e.biaya_lain_uang_jalan = [];
    if (e.biaya_lain_harga_order == null) e.biaya_lain_harga_order = [];
  });
  json.list.sort(
    (a, b) =>
      new Date(b.tanggal_awal).getTime() / 1000 -
      new Date(a.tanggal_awal).getTime() / 1000
  );
  return json;
}

const getdata = async (url?) => {
  // set cache lifetime in seconds
  var cachelife = 5000;
  //get cached data from local storage
  var localStorageData = localStorage.getItem("order");
  var cacheddata = await JSON.parse(localStorageData);
  if (cacheddata) {
    var expired = Date.now() / 1000 - cacheddata.cachetime > cachelife;
  }
  //If cached data available and not expired return them.
  isDataValid.subscribe((value) => {
    if (cacheddata && !expired && value) {
      transaksi.set(cacheddata.data);
    } else {
      //otherwise fetch data from api then save the data in localstorage
      fetchData(url).then((res) => {
        var json = { data: res.list, cachetime: Date.now() / 1000 };
        localStorage.setItem("order", JSON.stringify(json));
        transaksi.set(res.list);
        metaData = res.meta;
      });
    }
  });
};
