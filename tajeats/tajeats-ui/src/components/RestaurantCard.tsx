import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Truck } from 'lucide-react';
import type { Restaurant } from '@/types/domain';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    return (
        <Link to={`/restaurant/${restaurant.id}`} className="block">
            <Card className="glass card-hover border-border/20 overflow-hidden">
                <div className="relative">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge
                            variant={restaurant.isOpen ? "default" : "destructive"}
                            className={restaurant.isOpen ? "bg-accent/90" : "bg-destructive/90"}
                        >
                            {restaurant.isOpen ? "Open" : "Closed"}
                        </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm font-semibold">{restaurant.rating}</span>
                        </div>
                    </div>
                </div>

                <CardContent className="p-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                            {restaurant.name}
                        </h3>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="capitalize">{restaurant.category}</span>
                            <span>({restaurant.reviewCount} reviews)</span>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {restaurant.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{restaurant.deliveryTime}</span>
                            </div>

                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Truck className="w-4 h-4" />
                                <span>${restaurant.deliveryFee}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default RestaurantCard;