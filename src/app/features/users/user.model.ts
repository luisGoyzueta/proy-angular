
export type UserRole = 'Administrador' | 'Editor' | 'Usuario';
export type UserStatus = 'Activo' | 'Inactivo';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}

export type UserFormValue = Omit<User, 'id'>;
