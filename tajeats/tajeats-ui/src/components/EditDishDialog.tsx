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
import type { Dish } from '@/lib/mockData';

interface EditDishDialogProps {
    dish: Dish;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

const EditDishDialog: React.FC<EditDishDialogProps> = ({ dish, trigger, onSuccess }) => {
    const { updateDish } = useData();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: dish.name,
        description: dish.description,
        category: dish.category,
        price: dish.price,
        image: dish.image,
        isAvailable: dish.isAvailable,
        isPopular: dish.isPopular,
    });

    useEffect(() => {
        if (open) {
            setFormData({
                name: dish.name,
                description: dish.description,
                category: dish.category,
                price: dish.price,
                image: dish.image,
                isAvailable: dish.isAvailable,
                isPopular: dish.isPopular,
            });
        }
    }, [open, dish]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateDish(dish.id, {
                ...dish,
                ...formData,
            });

            toast({
                title: 'Dish updated!',
                description: `${formData.name} has been successfully updated.`,
            });

            setOpen(false);
            onSuccess?.();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update dish',
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
                    <DialogTitle>Edit Dish</DialogTitle>
                    <DialogDescription>
                        Update dish details and settings.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Dish Name *</Label>
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
                                    <SelectItem value="Appetizer">Appetizer</SelectItem>
                                    <SelectItem value="Main Course">Main Course</SelectItem>
                                    <SelectItem value="Dessert">Dessert</SelectItem>
                                    <SelectItem value="Beverage">Beverage</SelectItem>
                                    <SelectItem value="Side Dish">Side Dish</SelectItem>
                                    <SelectItem value="Soup">Soup</SelectItem>
                                    <SelectItem value="Salad">Salad</SelectItem>
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

                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($) *</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <ImageUpload
                        currentImageUrl={formData.image}
                        onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        uploadType="dish"
                        entityId={Number(dish.id)}
                        label="Dish Image"
                    />

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isAvailable"
                                checked={formData.isAvailable}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
                            />
                            <Label htmlFor="isAvailable">Available for order</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isPopular"
                                checked={formData.isPopular}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
                            />
                            <Label htmlFor="isPopular">Mark as popular dish</Label>
                        </div>
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

export default EditDishDialog;
