import React, { useState } from 'react';
import { Store, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const DAYS = [
    { key: 'openingMonday', label: 'Mon' },
    { key: 'openingTuesday', label: 'Tue' },
    { key: 'openingWednesday', label: 'Wed' },
    { key: 'openingThursday', label: 'Thu' },
    { key: 'openingFriday', label: 'Fri' },
    { key: 'openingSaturday', label: 'Sat' },
    { key: 'openingSunday', label: 'Sun' },
] as const;

const RestaurantSetup: React.FC = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const { addRestaurant } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [logoPreview, setLogoPreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        deliveryTime: '30-40 min',
        deliveryFee: 2.99,
        minOrder: 10,
        image: '',
        logo: '',
        // Address
        street: '',
        houseNumber: '',
        postalCode: '',
        city: '',
        // Contact
        phone: '',
        email: '',
        website: '',
        // Delivery mode
        deliveryMode: 'BOTH' as 'DELIVERY' | 'PICKUP' | 'BOTH',
        // Opening hours
        openingMonday: '09:00-22:00',
        openingTuesday: '09:00-22:00',
        openingWednesday: '09:00-22:00',
        openingThursday: '09:00-22:00',
        openingFriday: '09:00-23:00',
        openingSaturday: '10:00-23:00',
        openingSunday: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'deliveryFee' || name === 'minOrder' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData(prev => ({ ...prev, image: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogoPreview(result);
                setFormData(prev => ({ ...prev, logo: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.category || !formData.description) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const newRestaurant = await addRestaurant({
                ...formData,
                rating: 0,
                reviewCount: 0,
                isOpen: true,
                website: formData.website || undefined,
                openingMonday: formData.openingMonday || undefined,
                openingTuesday: formData.openingTuesday || undefined,
                openingWednesday: formData.openingWednesday || undefined,
                openingThursday: formData.openingThursday || undefined,
                openingFriday: formData.openingFriday || undefined,
                openingSaturday: formData.openingSaturday || undefined,
                openingSunday: formData.openingSunday || undefined,
            });

            // Update user's restaurantId in backend
            await fetch(`http://localhost:8080/api/users/${user?.id}/restaurant/${newRestaurant.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tajeats_jwt_token')}`,
                },
            });

            toast({
                title: "Restaurant created!",
                description: "Your restaurant has been successfully set up. Redirecting to dashboard...",
            });

            // Navigate to restaurant dashboard instead of reloading
            setTimeout(() => {
                window.location.href = '/restaurant/dashboard';
            }, 500);
        } catch (error) {
            toast({
                title: "Failed to create restaurant",
                description: "Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Card className="glass border-border/20">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl">Set Up Your Restaurant</CardTitle>
                        <p className="text-muted-foreground mt-2">
                            Welcome! Let's create your restaurant profile to get started.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">Basic Information</h3>
                                <div>
                                    <Label htmlFor="name">Restaurant Name *</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Bella Italia" required className="border-border/20" />
                                </div>
                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <Input id="category" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., Italian, Asian, Fast Food" required className="border-border/20" />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell customers about your restaurant..." rows={4} required className="border-border/20" />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="street">Street *</Label>
                                        <Input id="street" name="street" value={formData.street} onChange={handleInputChange} placeholder="Rudaki Avenue" required className="border-border/20" />
                                    </div>
                                    <div>
                                        <Label htmlFor="houseNumber">House Number *</Label>
                                        <Input id="houseNumber" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} placeholder="42" required className="border-border/20" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="postalCode">PLZ *</Label>
                                        <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="734000" required className="border-border/20" />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Dushanbe" required className="border-border/20" />
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone">Phone *</Label>
                                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+992 XX XXX-XXXX" required className="border-border/20" />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">E-Mail *</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="info@restaurant.com" required className="border-border/20" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="website">Website (optional)</Label>
                                    <Input id="website" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://www.restaurant.com" className="border-border/20" />
                                </div>
                            </div>

                            {/* Delivery & Fees */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">Delivery & Fees</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="deliveryMode">Delivery Mode *</Label>
                                        <Select value={formData.deliveryMode} onValueChange={(v) => setFormData(prev => ({ ...prev, deliveryMode: v as any }))}>
                                            <SelectTrigger className="border-border/20"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DELIVERY">Delivery only</SelectItem>
                                                <SelectItem value="PICKUP">Pickup only</SelectItem>
                                                <SelectItem value="BOTH">Delivery & Pickup</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="deliveryTime">Delivery Time</Label>
                                        <Input id="deliveryTime" name="deliveryTime" value={formData.deliveryTime} onChange={handleInputChange} placeholder="30-40 min" className="border-border/20" />
                                    </div>
                                    <div>
                                        <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                                        <Input id="deliveryFee" name="deliveryFee" type="number" step="0.01" value={formData.deliveryFee} onChange={handleInputChange} className="border-border/20" />
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="minOrder">Min Order ($)</Label>
                                    <Input id="minOrder" name="minOrder" type="number" step="0.01" value={formData.minOrder} onChange={handleInputChange} className="border-border/20" />
                                </div>
                            </div>

                            {/* Opening Hours */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">Opening Hours</h3>
                                <p className="text-xs text-muted-foreground">Format: HH:MM-HH:MM (e.g. 09:00-22:00). Leave empty for closed.</p>
                                <div className="space-y-2">
                                    {DAYS.map(({ key, label }) => (
                                        <div key={key} className="flex items-center gap-3">
                                            <Label className="w-12 text-sm font-medium">{label}</Label>
                                            <Input
                                                name={key}
                                                value={(formData as any)[key]}
                                                onChange={handleInputChange}
                                                placeholder="09:00-22:00"
                                                className="flex-1 border-border/20"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Restaurant Image */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">Images</h3>
                                <div>
                                    <Label>Restaurant Image</Label>
                                    <p className="text-sm text-muted-foreground mb-2">Upload a banner image for your restaurant</p>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-border/40 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Restaurant Preview" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <Label>Restaurant Logo (Optional)</Label>
                                    <p className="text-sm text-muted-foreground mb-2">Upload your restaurant logo</p>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border/40 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain rounded-lg p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full btn-hero" disabled={isLoading}>
                                {isLoading ? 'Creating Restaurant...' : 'Create Restaurant'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RestaurantSetup;
