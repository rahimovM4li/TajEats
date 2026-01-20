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

const AddRestaurantDialog: React.FC<AddRestaurantDialogProps> = ({ trigger }) => {
    const { addRestaurant } = useData();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createdRestaurantId, setCreatedRestaurantId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Traditional',
        image: '',
        deliveryTime: '30-45 min',
        deliveryFee: 5,
        minOrder: 15,
        address: '',
        phone: '',
        isOpen: true,
    });

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
                isOpen: formData.isOpen,
            });

            setCreatedRestaurantId(Number(created.id));

            toast({
                title: 'Restaurant created!',
                description: `${formData.name} has been successfully added. You can now upload an image.`,
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                category: 'Traditional',
                image: '',
                deliveryTime: '30-45 min',
                deliveryFee: 5,
                minOrder: 15,
                address: '',
                phone: '',
                isOpen: true,
            });
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Restaurant</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new restaurant to the platform.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Restaurant Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter restaurant name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue />
                                </SelectTrigger>
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
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Describe the restaurant"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Address *</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                placeholder="Restaurant address"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="+992 XX XXX-XXXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="deliveryTime">Delivery Time</Label>
                            <Input
                                id="deliveryTime"
                                name="deliveryTime"
                                value={formData.deliveryTime}
                                onChange={handleInputChange}
                                placeholder="30-45 min"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                            <Input
                                id="deliveryFee"
                                name="deliveryFee"
                                type="number"
                                step="0.01"
                                value={formData.deliveryFee}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minOrder">Min Order ($)</Label>
                            <Input
                                id="minOrder"
                                name="minOrder"
                                type="number"
                                step="0.01"
                                value={formData.minOrder}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Image Upload - Only show after restaurant is created */}
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
                        <Switch
                            id="isOpen"
                            checked={formData.isOpen}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOpen: checked }))}
                        />
                        <Label htmlFor="isOpen">Restaurant is open</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => {
                            setOpen(false);
                            setCreatedRestaurantId(null);
                        }}>
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
