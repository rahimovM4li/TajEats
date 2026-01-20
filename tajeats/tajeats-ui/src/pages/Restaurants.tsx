import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import RestaurantCard from '@/components/RestaurantCard';
import { useData } from '@/contexts/DataContext';
import { AlertCircle } from 'lucide-react';

const Restaurants: React.FC = () => {
    const { restaurants, isLoadingRestaurants, restaurantsError } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('rating');

    const categories = ['all', 'traditional', 'fine dining', 'fast food'];

    const filteredRestaurants = restaurants
        .filter(restaurant => {
            const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                restaurant.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' ||
                restaurant.category.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'delivery-time':
                    return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
                case 'delivery-fee':
                    return a.deliveryFee - b.deliveryFee;
                default:
                    return 0;
            }
        });

    return (
        <div className="min-h-screen pt-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">All Restaurants</h1>
                    <p className="text-xl text-muted-foreground">
                        Discover amazing restaurants in Tajikistan
                    </p>
                </div>

                {/* Error State */}
                {restaurantsError && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{restaurantsError}</AlertDescription>
                    </Alert>
                )}

                {/* Search and Filters */}
                <div className="glass p-6 rounded-xl border border-border/20 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search restaurants or cuisine..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-border/20"
                                disabled={isLoadingRestaurants}
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoadingRestaurants}>
                            <SelectTrigger className="border-border/20">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort By */}
                        <Select value={sortBy} onValueChange={setSortBy} disabled={isLoadingRestaurants}>
                            <SelectTrigger className="border-border/20">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="delivery-time">Fastest Delivery</SelectItem>
                                <SelectItem value="delivery-fee">Lowest Delivery Fee</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Active Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedCategory !== 'all' && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="ml-1 text-xs hover:text-destructive"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {searchTerm && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-1 text-xs hover:text-destructive"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Results Summary */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-muted-foreground">
                        {isLoadingRestaurants ? 'Loading...' : `${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? 's' : ''} found`}
                    </p>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={isLoadingRestaurants}>
                            <Filter className="w-4 h-4 mr-2" />
                            More Filters
                        </Button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoadingRestaurants ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="glass rounded-xl overflow-hidden border border-border/20">
                                <Skeleton className="w-full h-48" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {filteredRestaurants.map((restaurant, index) => (
                            <div
                                key={restaurant.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <RestaurantCard restaurant={restaurant} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
                        <p className="text-muted-foreground mb-4">
                            Try adjusting your search criteria or browse all restaurants.
                        </p>
                        <Button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            variant="outline"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Restaurants;