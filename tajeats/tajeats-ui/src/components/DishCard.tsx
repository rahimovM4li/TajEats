import React from 'react';
import { Plus, Star } from 'lucide-react';
import type { Dish } from '@/types/domain';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface DishCardProps {
    dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = () => {
        if (!dish.isAvailable) return;

        addToCart(dish);
        toast({
            title: "Added to cart",
            description: `${dish.name} has been added to your cart.`,
        });
    };

    return (
        <Card className="glass card-hover border-border/20 overflow-hidden">
            <div className="relative">
                <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-40 object-cover"
                />
                {dish.isPopular && (
                    <div className="absolute top-2 left-2">
                        <Badge className="bg-accent/90 text-accent-foreground">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Popular
                        </Badge>
                    </div>
                )}
                {!dish.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Not Available</Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-4">
                <div className="space-y-3">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                            {dish.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {dish.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary">
                            ${dish.price}
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            disabled={!dish.isAvailable}
                            size="sm"
                            className="bg-gradient-primary hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DishCard;