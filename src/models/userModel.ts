type Permission = {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
};

type Akses = {
    master_armada: Permission;
    master_penyewa: Permission;
    master_rekening: Permission;
    master_user: Permission;
    master_sopir: Permission;
};

type Role = {
    id: number;
    name: string;
    akses: Akses;
    created_at: string;
    updated_at: string;
};

type User = {
    id: number;
    name: string;
    username: string;
    m_role_id: number;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: Role;
};