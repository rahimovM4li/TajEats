'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const RiderLogin: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login, logout, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Redirect if already logged in as rider
    useEffect(() => {
        if (user && user.role === 'rider') {
            navigate('/rider/dashboard');
        }
    }, [user, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success && result.user) {
                // Check if user has rider role
                if (result.user.role !== 'rider') {
                    logout();
                    toast({
                        title: "Zugriff verweigert",
                        description: "Dieses Portal ist nur für Fahrer.",
                        variant: "destructive",
                    });
                    return;
                }

                toast({
                    title: "Anmeldung erfolgreich",
                    description: "Willkommen im Fahrer-Dashboard!",
                });
                navigate('/rider/dashboard');
            } else {
                toast({
                    title: "Anmeldung fehlgeschlagen",
                    description: result.message || "Bitte überprüfen Sie Ihre Anmeldedaten.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Anmeldung fehlgeschlagen",
                description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 py-12">
            <div className="w-full max-w-md mx-auto px-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">T</span>
                        </div>
                        <span className="text-2xl font-bold gradient-text">TajEats</span>
                    </Link>
                    <p className="text-muted-foreground mt-2">Fahrer-Portal</p>
                </div>

                <Card className="glass border-border/20">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bike className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Fahrer-Anmeldung</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">E-Mail</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="fahrer@beispiel.de"
                                    className="border-border/20"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Passwort</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="••••••••"
                                        className="border-border/20 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full btn-hero" disabled={isLoading}>
                                {isLoading ? 'Anmeldung...' : 'Anmelden'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Noch kein Fahrer?{' '}
                                <Link to="/rider/register" className="text-primary hover:underline font-medium">
                                    Jetzt registrieren
                                </Link>
                            </p>
                            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                                ← Zurück zur Startseite
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RiderLogin;
