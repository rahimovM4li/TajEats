import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Auth interfaces
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'restaurant' | 'customer';
    restaurantId?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: 'admin' | 'restaurant') => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Mock users for demo
const DEMO_USERS: User[] = [
    {
        id: 'admin-1',
        email: 'admin@tajeats.tj',
        name: 'Admin User',
        role: 'admin'
    },
    {
        id: 'restaurant-1',
        email: 'kitchen@tajeats.tj',
        name: 'Tajik Traditional Kitchen',
        role: 'restaurant',
        restaurantId: '1'
    },
    {
        id: 'restaurant-2',
        email: 'pamir@tajeats.tj',
        name: 'Pamir Palace',
        role: 'restaurant',
        restaurantId: '2'
    }
];

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('tajeats_auth_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('tajeats_auth_user');
            }
        }
    }, []);

    const login = async (email: string, password: string, role: 'admin' | 'restaurant'): Promise<boolean> => {
        // TODO: Replace with actual API authentication

        // Mock authentication - any password works for demo
        const foundUser = DEMO_USERS.find(u => u.email === email && u.role === role);

        if (foundUser && password) {
            setUser(foundUser);
            localStorage.setItem('tajeats_auth_user', JSON.stringify(foundUser));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tajeats_auth_user');
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};