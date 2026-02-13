'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Bike, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { restaurantService } from '@/services/restaurantService';
import { linkUserToRestaurant } from '@/services/userService';
import type { RestaurantDTO } from '@/types/api';

const RiderRegister: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [restaurants, setRestaurants] = useState<RestaurantDTO[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        restaurantId: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load restaurants for selection
    useEffect(() => {
        restaurantService.getAll().then(setRestaurants).catch(console.error);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validatePassword = (password: string): boolean => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return minLength && hasUppercase && hasLowercase && hasNumber;
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name ist erforderlich';
        if (!formData.email.trim()) {
            newErrors.email = 'E-Mail ist erforderlich';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'E-Mail ist ungültig';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Telefonnummer ist erforderlich';
        if (!formData.password) {
            newErrors.password = 'Passwort ist erforderlich';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Passwort muss mind. 8 Zeichen, 1 Großbuchst., 1 Kleinbuchst. und 1 Zahl haben';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
        }
        if (!formData.restaurantId) {
            newErrors.restaurantId = 'Bitte wählen Sie ein Restaurant';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Register as RIDER
            const response = await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: 'RIDER'
            });

            // Link rider to selected restaurant
            const userId = response.user?.id || (response as any).id;
            if (userId && formData.restaurantId) {
                await linkUserToRestaurant(userId, Number(formData.restaurantId));
            }

            toast({
                title: "Registrierung erfolgreich!",
                description: "Sie können sich jetzt als Fahrer anmelden.",
            });

            setTimeout(() => {
                navigate('/rider/login');
            }, 2000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
            toast({
                title: "Registrierung fehlgeschlagen",
                description: errorMessage,
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
                    <p className="text-muted-foreground mt-2">Fahrer-Registrierung</p>
                </div>

                <Card className="glass border-border/20">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bike className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Als Fahrer registrieren</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Vollständiger Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ihr Name"
                                    className="border-border/20"
                                />
                                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email">E-Mail *</Label>
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
                                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="phone">Telefonnummer *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="+992 XX XXX XXXX"
                                    className="border-border/20"
                                />
                                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <Label htmlFor="restaurantId">Restaurant *</Label>
                                <Select
                                    value={formData.restaurantId}
                                    onValueChange={(value) => setFormData({ ...formData, restaurantId: value })}
                                >
                                    <SelectTrigger className="border-border/20">
                                        <SelectValue placeholder="Restaurant auswählen..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {restaurants.map(r => (
                                            <SelectItem key={r.id} value={r.id.toString()}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.restaurantId && <p className="text-sm text-destructive mt-1">{errors.restaurantId}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password">Passwort *</Label>
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
                                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}

                                {/* Password requirements */}
                                <div className="mt-2 space-y-1">
                                    {[
                                        { check: formData.password.length >= 8, label: 'Mind. 8 Zeichen' },
                                        { check: /[A-Z]/.test(formData.password), label: '1 Großbuchstabe' },
                                        { check: /[a-z]/.test(formData.password), label: '1 Kleinbuchstabe' },
                                        { check: /[0-9]/.test(formData.password), label: '1 Zahl' },
                                    ].map((req, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <CheckCircle2 className={`w-3 h-3 ${req.check ? 'text-accent' : 'text-muted-foreground'}`} />
                                            <span className={req.check ? 'text-accent' : 'text-muted-foreground'}>{req.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="••••••••"
                                        className="border-border/20 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <Button type="submit" className="w-full btn-hero" disabled={isLoading}>
                                {isLoading ? 'Registrierung...' : 'Registrieren'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Bereits registriert?{' '}
                                <Link to="/rider/login" className="text-primary hover:underline font-medium">
                                    Anmelden
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

export default RiderRegister;
