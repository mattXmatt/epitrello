"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, login as apiLogin, logout as apiLogout, getMe, register as apiRegister } from '@/app/services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getMe();
                setUser(user);
            } catch (error) {
                // Not an error if the user is not logged in
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials: any) => {
        const { result } = await apiLogin(credentials);
        const user = await getMe();
        setUser(user);
    };

    const register = async (userData: any) => {
        await apiRegister(userData);
        const { result } = await apiLogin({ email: userData.email, password: userData.password });
        const user = await getMe();
        setUser(user);
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
