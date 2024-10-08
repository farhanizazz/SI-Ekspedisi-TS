export interface MasterArmada {
  id: number;
  nopol: string;
}

export interface NotaBeliItem {
  id: number;
  nama_barang: string;
  harga: number;
  jumlah: number;
  created_at: string;
  updated_at: string;
  servis_id: number;
}

export interface LaporanServis {
  id: number;
  tanggal_servis: string;
  nomor_nota: string;
  nama_toko: string;
  kategori_servis: string;
  nota_beli_id?: number;
  master_armada_id: number;
  created_at: string;
  updated_at: string;
  master_armada: MasterArmada;
  nota_beli_items: NotaBeliItem[];
}

export interface LaporanLain extends LaporanServis {
  nama_tujuan_lain?: string;
  keterangan_lain?: string;
  nominal_lain?: number;
  jumlah_lain?: number;
  total_lain?: number;
}
