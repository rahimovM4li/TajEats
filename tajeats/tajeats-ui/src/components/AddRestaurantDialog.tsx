import React, { useState } from 'react';
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
import { Plus } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface AddRestaurantDialogProps {
    trigger?: React.ReactNode;
}

const DAYS = [
    { key: 'openingMonday', label: 'Monday' },
    { key: 'openingTuesday', label: 'Tuesday' },
    { key: 'openingWednesday', label: 'Wednesday' },
    { key: 'openingThursday', label: 'Thursday' },
    { key: 'openingFriday', label: 'Friday' },
    { key: 'openingSaturday', label: 'Saturday' },
    { key: 'openingSunday', label: 'Sunday' },
] as const;

const defaultFormData = {
    name: '',
    description: '',
    category: 'Traditional',
    image: '',
    deliveryTime: '30-45 min',
    deliveryFee: 5,
    minOrder: 15,
    isOpen: true,
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
};

const AddRestaurantDialog: React.FC<AddRestaurantDialogProps> = ({ trigger }) => {
    const { addRestaurant } = useData();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createdRestaurantId, setCreatedRestaurantId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ ...defaultFormData });

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
            const created = await addRestaurant({
                name: formData.name,
                description: formData.description,
                category: formData.category,
                image: formData.image || 'https://via.placeholder.com/400x300',
                rating: 0,
                reviewCount: 0,
                deliveryTime: formData.deliveryTime,
                deliveryFee: formData.deliveryFee,
                minOrder: formData.minOrder,
                isOpen: formData.isOpen,
                street: formData.street,
                houseNumber: formData.houseNumber,
                postalCode: formData.postalCode,
                city: formData.city,
                phone: formData.phone,
                email: formData.email,
                website: formData.website || undefined,
                deliveryMode: formData.deliveryMode,
                openingMonday: formData.openingMonday || undefined,
                openingTuesday: formData.openingTuesday || undefined,
                openingWednesday: formData.openingWednesday || undefined,
                openingThursday: formData.openingThursday || undefined,
                openingFriday: formData.openingFriday || undefined,
                openingSaturday: formData.openingSaturday || undefined,
                openingSunday: formData.openingSunday || undefined,
            });

            setCreatedRestaurantId(Number(created.id));

            toast({
                title: 'Restaurant created!',
                description: `${formData.name} has been successfully added. You can now upload an image.`,
            });

            setFormData({ ...defaultFormData });
            setOpen(false);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create restaurant',
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
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Restaurant
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Restaurant</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new restaurant to the platform.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Basic Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Restaurant Name *</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter restaurant name" />
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
                            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required placeholder="Describe the restaurant" rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input id="image" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                        </div>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deliveryMode">Delivery Mode *</Label>
                                <Select value={formData.deliveryMode} onValueChange={(v) => setFormData(prev => ({ ...prev, deliveryMode: v as any }))}>
                                    <SelectTrigger id="deliveryMode"><SelectValue /></SelectTrigger>
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                                <Input id="deliveryFee" name="deliveryFee" type="number" step="0.01" value={formData.deliveryFee} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minOrder">Min Order ($)</Label>
                                <Input id="minOrder" name="minOrder" type="number" step="0.01" value={formData.minOrder} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Opening Hours</h3>
                        <p className="text-xs text-muted-foreground">Format: HH:MM-HH:MM (e.g. 09:00-22:00). Leave empty for closed.</p>
                        <div className="grid grid-cols-2 gap-3">
                            {DAYS.map(({ key, label }) => (
                                <div key={key} className="flex items-center gap-2">
                                    <Label className="w-28 text-sm">{label}</Label>
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

                    {/* Image Upload */}
                    {createdRestaurantId && (
                        <ImageUpload
                            currentImageUrl={formData.image}
                            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            uploadType="restaurant"
                            entityId={createdRestaurantId}
                            label="Restaurant Image"
                        />
                    )}

                    <div className="flex items-center space-x-2">
                        <Switch id="isOpen" checked={formData.isOpen} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOpen: checked }))} />
                        <Label htmlFor="isOpen">Restaurant is open</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => { setOpen(false); setCreatedRestaurantId(null); }}>
                            {createdRestaurantId ? 'Close' : 'Cancel'}
                        </Button>
                        {!createdRestaurantId && (
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Restaurant'}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddRestaurantDialog;
