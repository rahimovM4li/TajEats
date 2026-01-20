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

interface AddDishDialogProps {
    restaurantId: string;
    trigger?: React.ReactNode;
}

const AddDishDialog: React.FC<AddDishDialogProps> = ({ restaurantId, trigger }) => {
    const { addDish } = useData();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createdDishId, setCreatedDishId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Main Course',
        price: 0,
        image: '',
        isAvailable: true,
        isPopular: false,
    });

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
            const created = await addDish({
                restaurantId,
                name: formData.name,
                description: formData.description,
                category: formData.category,
                price: formData.price,
                image: formData.image || 'https://via.placeholder.com/400x300',
                isAvailable: formData.isAvailable,
                isPopular: formData.isPopular,
            });

            setCreatedDishId(Number(created.id));

            toast({
                title: 'Dish created!',
                description: `${formData.name} has been successfully added. You can now upload an image.`,
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                category: 'Main Course',
                price: 0,
                image: '',
                isAvailable: true,
                isPopular: false,
            });
            setOpen(false);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create dish',
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
                        Add Dish
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Dish</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new dish to your menu.
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
                                placeholder="Enter dish name"
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
                            placeholder="Describe the dish"
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
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/dish-image.jpg"
                        />
                    </div>

                    {/* Image Upload - Only show after dish is created */}
                    {createdDishId && (
                        <ImageUpload
                            currentImageUrl={formData.image}
                            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            uploadType="dish"
                            entityId={createdDishId}
                            label="Dish Image"
                        />
                    )}

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
                        <Button type="button" variant="outline" onClick={() => {
                            setOpen(false);
                            setCreatedDishId(null);
                        }}>
                            {createdDishId ? 'Close' : 'Cancel'}
                        </Button>
                        {!createdDishId && (
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Dish'}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddDishDialog;
