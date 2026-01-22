import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { UserDTO } from '@/types/api';
import { getToken, setToken as saveToken, removeToken, isTokenExpired } from '@/lib/tokenManager';

// Auth interfaces - mapped from backend
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'restaurant' | 'customer';
    restaurantId?: string;
    isApproved: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
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

interface AuthProviderProps {
    children: ReactNode;
}

// Convert backend UserDTO to frontend User
const convertUserFromDTO = (dto: UserDTO): User => {
    let role: 'admin' | 'restaurant' | 'customer';
    
    switch (dto.role) {
        case 'ADMIN':
            role = 'admin';
            break;
        case 'RESTAURANT_OWNER':
            role = 'restaurant';
            break;
        case 'CUSTOMER':
            role = 'customer';
            break;
        default:
            role = 'customer';
    }
    
    return {
        id: dto.id.toString(),
        email: dto.email,
        name: dto.name,
        role,
        restaurantId: dto.restaurantId?.toString(),
        isApproved: dto.isApproved,
    };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedToken = getToken();
                
                if (storedToken && !isTokenExpired(storedToken)) {
                    // Token exists and is valid - fetch user info
                    setTokenState(storedToken);
                    
                    try {
                        const userDTO = await authService.getCurrentUser();
                        const convertedUser = convertUserFromDTO(userDTO);
                        setUser(convertedUser);
                    } catch (error) {
                        console.error('Error loading user:', error);
                        removeToken();
                        setTokenState(null);
                    }
                } else if (storedToken) {
                    // Token expired
                    removeToken();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadUser();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> => {
        try {
            const response = await authService.login(email, password);
            
            // Check if account is pending approval (no token in response)
            if (!response.token && response.message) {
                return { success: false, message: response.message };
            }
            
            if (response.token && response.user) {
                // Save token
                saveToken(response.token);
                setTokenState(response.token);
                
                // Convert and save user
                const convertedUser = convertUserFromDTO(response.user);
                setUser(convertedUser);
                
                return { success: true, user: convertedUser };
            }
            
            return { success: false, message: 'Invalid response from server' };
        } catch (error: any) {
            // Handle specific error messages from backend
            if (error.response?.data?.error) {
                return { success: false, message: error.response.data.error };
            }
            return { success: false, message: 'Login failed. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        setTokenState(null);
        removeToken();
        authService.logout();
    };

    const isAuthenticated = !!user && !!token && !isTokenExpired(token) && user.isApproved;

    // Show loading state while initializing
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh',
                fontFamily: 'system-ui'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};