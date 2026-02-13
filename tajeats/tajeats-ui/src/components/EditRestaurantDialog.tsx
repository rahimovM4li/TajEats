import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { Edit } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import type { Restaurant } from '@/types/domain';

interface EditRestaurantDialogProps {
    restaurant: Restaurant;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

const DAYS = [
    { key: 'openingMonday', label: 'Mon' },
    { key: 'openingTuesday', label: 'Tue' },
    { key: 'openingWednesday', label: 'Wed' },
    { key: 'openingThursday', label: 'Thu' },
    { key: 'openingFriday', label: 'Fri' },
    { key: 'openingSaturday', label: 'Sat' },
    { key: 'openingSunday', label: 'Sun' },
] as const;

const EditRestaurantDialog: React.FC<EditRestaurantDialogProps> = ({ restaurant, trigger, onSuccess }) => {
    const { updateRestaurant } = useData();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const buildFormData = (r: Restaurant) => ({
        name: r.name,
        description: r.description,
        category: r.category,
        image: r.image,
        deliveryTime: r.deliveryTime,
        deliveryFee: r.deliveryFee,
        minOrder: r.minOrder ?? 0,
        isOpen: r.isOpen,
        // Address
        street: r.street ?? '',
        houseNumber: r.houseNumber ?? '',
        postalCode: r.postalCode ?? '',
        city: r.city ?? '',
        // Contact
        phone: r.phone ?? '',
        email: r.email ?? '',
        website: r.website ?? '',
        // Delivery mode
        deliveryMode: r.deliveryMode ?? 'BOTH',
        // Opening hours
        openingMonday: r.openingMonday ?? '',
        openingTuesday: r.openingTuesday ?? '',
        openingWednesday: r.openingWednesday ?? '',
        openingThursday: r.openingThursday ?? '',
        openingFriday: r.openingFriday ?? '',
        openingSaturday: r.openingSaturday ?? '',
        openingSunday: r.openingSunday ?? '',
    });

    const [formData, setFormData] = useState(buildFormData(restaurant));

    useEffect(() => {
        if (open) {
            setFormData(buildFormData(restaurant));
        }
    }, [open, restaurant]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'deliveryFee' || name === 'minOrder' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateRestaurant(restaurant.id, {
                ...restaurant,
                ...formData,
                website: formData.website || undefined,
                deliveryMode: formData.deliveryMode as Restaurant['deliveryMode'],
                openingMonday: formData.openingMonday || undefined,
                openingTuesday: formData.openingTuesday || undefined,
                openingWednesday: formData.openingWednesday || undefined,
                openingThursday: formData.openingThursday || undefined,
                openingFriday: formData.openingFriday || undefined,
                openingSaturday: formData.openingSaturday || undefined,
                openingSunday: formData.openingSunday || undefined,
            });

            toast({
                title: 'Restaurant updated!',
                description: `${formData.name} has been successfully updated.`,
            });

            setOpen(false);
            onSuccess?.();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update restaurant',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Restaurant Profile</DialogTitle>
                    <DialogDescription>
                        Update restaurant details, address, contact info, and opening hours.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Basic Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Restaurant Name *</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                                    <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Traditional">Traditional</SelectItem>
                                        <SelectItem value="Fine Dining">Fine Dining</SelectItem>
                                        <SelectItem value="Fast Food">Fast Food</SelectItem>
                                        <SelectItem value="Cafe">Cafe</SelectItem>
                                        <SelectItem value="Bakery">Bakery</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={3} />
                        </div>

                        <ImageUpload
                            currentImageUrl={formData.image}
                            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            uploadType="restaurant"
                            entityId={Number(restaurant.id)}
                            label="Restaurant Image"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="street">Street *</Label>
                                <Input id="street" name="street" value={formData.street} onChange={handleInputChange} required placeholder="Rudaki Avenue" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="houseNumber">House Number *</Label>
                                <Input id="houseNumber" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} required placeholder="42" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">PLZ *</Label>
                                <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required placeholder="734000" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Dushanbe" />
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contact</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+992 XX XXX-XXXX" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-Mail *</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="info@restaurant.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website (optional)</Label>
                            <Input id="website" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://www.restaurant.com" />
                        </div>
                    </div>

                    {/* Delivery & Fees */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Delivery & Fees</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deliveryMode">Delivery Mode</Label>
                                <Select value={formData.deliveryMode} onValueChange={(v) => setFormData(prev => ({ ...prev, deliveryMode: v as 'DELIVERY' | 'PICKUP' | 'BOTH' }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DELIVERY">Delivery only</SelectItem>
                                        <SelectItem value="PICKUP">Pickup only</SelectItem>
                                        <SelectItem value="BOTH">Delivery & Pickup</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deliveryTime">Delivery Time</Label>
                                <Input id="deliveryTime" name="deliveryTime" value={formData.deliveryTime} onChange={handleInputChange} placeholder="30-45 min" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                                <Input id="deliveryFee" name="deliveryFee" type="number" step="0.01" value={formData.deliveryFee} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="w-1/3">
                            <div className="space-y-2">
                                <Label htmlFor="minOrder">Min Order ($)</Label>
                                <Input id="minOrder" name="minOrder" type="number" step="0.01" value={formData.minOrder} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Opening Hours</h3>
                        <p className="text-xs text-muted-foreground">Format: HH:MM-HH:MM. Leave empty for closed.</p>
                        <div className="grid grid-cols-2 gap-3">
                            {DAYS.map(({ key, label }) => (
                                <div key={key} className="flex items-center gap-2">
                                    <Label className="w-12 text-sm">{label}</Label>
                                    <Input
                                        name={key}
                                        value={(formData as any)[key]}
                                        onChange={handleInputChange}
                                        placeholder="09:00-22:00"
                                        className="flex-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="isOpen" checked={formData.isOpen} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOpen: checked }))} />
                        <Label htmlFor="isOpen">Restaurant is open</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditRestaurantDialog;
