import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const RestaurantSetup: React.FC = () => {
    const navigate = useNavigate();
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
        image: '',
        logo: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'deliveryFee' ? parseFloat(value) || 0 : value
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
                isOpen: true
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
                description: "Your restaurant has been successfully set up.",
            });

            // Reload page to refresh user data
            window.location.reload();
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Restaurant Name */}
                            <div>
                                <Label htmlFor="name">Restaurant Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Bella Italia"
                                    required
                                    className="border-border/20"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <Label htmlFor="category">Category *</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Italian, Asian, Fast Food"
                                    required
                                    className="border-border/20"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Tell customers about your restaurant..."
                                    rows={4}
                                    required
                                    className="border-border/20"
                                />
                            </div>

                            {/* Delivery Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                                    <Input
                                        id="deliveryTime"
                                        name="deliveryTime"
                                        value={formData.deliveryTime}
                                        onChange={handleInputChange}
                                        placeholder="30-40 min"
                                        className="border-border/20"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                                    <Input
                                        id="deliveryFee"
                                        name="deliveryFee"
                                        type="number"
                                        step="0.01"
                                        value={formData.deliveryFee}
                                        onChange={handleInputChange}
                                        className="border-border/20"
                                    />
                                </div>
                            </div>

                            {/* Restaurant Image */}
                            <div>
                                <Label>Restaurant Image</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Upload a banner image for your restaurant
                                </p>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-border/40 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Restaurant Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Logo */}
                            <div>
                                <Label>Restaurant Logo (Optional)</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Upload your restaurant logo
                                </p>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border/40 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Logo Preview"
                                                className="w-full h-full object-contain rounded-lg p-2"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="font-semibold">Click to upload</span>
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full btn-hero"
                                disabled={isLoading}
                            >
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
