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

const EditRestaurantDialog: React.FC<EditRestaurantDialogProps> = ({ restaurant, trigger, onSuccess }) => {
    const { updateRestaurant } = useData();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: restaurant.name,
        description: restaurant.description,
        category: restaurant.category,
        image: restaurant.image,
        deliveryTime: restaurant.deliveryTime,
        deliveryFee: restaurant.deliveryFee,
        isOpen: restaurant.isOpen,
    });

    useEffect(() => {
        if (open) {
            setFormData({
                name: restaurant.name,
                description: restaurant.description,
                category: restaurant.category,
                image: restaurant.image,
                deliveryTime: restaurant.deliveryTime,
                deliveryFee: restaurant.deliveryFee,
                isOpen: restaurant.isOpen,
            });
        }
    }, [open, restaurant]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'deliveryFee' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateRestaurant(restaurant.id, {
                ...restaurant,
                ...formData,
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Restaurant</DialogTitle>
                    <DialogDescription>
                        Update restaurant details and settings.
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
                            rows={3}
                        />
                    </div>

                    <ImageUpload
                        currentImageUrl={formData.image}
                        onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        uploadType="restaurant"
                        entityId={Number(restaurant.id)}
                        label="Restaurant Image"
                    />

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isOpen"
                            checked={formData.isOpen}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOpen: checked }))}
                        />
                        <Label htmlFor="isOpen">Restaurant is open</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditRestaurantDialog;
