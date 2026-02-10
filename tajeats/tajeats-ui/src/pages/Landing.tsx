import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import RestaurantCard from '@/components/RestaurantCard';
import { useData } from '@/contexts/DataContext';
import heroBanner from '@/assets/hero-banner.jpg';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
    const { restaurants } = useData();
    const featuredRestaurants = restaurants.slice(0, 6);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const floatVariants = {
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroBanner}
                        alt="Traditional Tajik cuisine"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
                </div>

                <motion.div
                    className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-6"
                        variants={itemVariants}
                    >
                        Order Food Fast in
                        <span className="block bg-gradient-hero bg-clip-text text-transparent">
                            Tajikistan
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl mb-8 text-white/90"
                        variants={itemVariants}
                    >
                        Discover authentic Tajik cuisine and have it delivered to your door in minutes
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        variants={itemVariants}
                    >
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="Enter your delivery address..."
                                className="pl-12 h-12 text-lg glass border-white/20 text-white placeholder:text-white/70"
                            />
                        </div>
                        <Button size="lg" className="h-12 px-8 btn-hero w-full sm:w-auto">
                            Find Food
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                    className="absolute top-24 left-10 hidden md:block"
                    variants={floatVariants}
                    animate="animate"
                    style={{ animationDelay: '0s' }}
                >
                    <div className="w-20 h-20 glass rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-glass">
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    </div>
                </motion.div>
                <motion.div
                    className="absolute bottom-32 right-10 hidden md:block"
                    variants={floatVariants}
                    animate="animate"
                    transition={{ delay: 1.5 }}
                >
                    <div className="w-16 h-16 glass rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-glass">
                        <Clock className="w-6 h-6 text-accent" />
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-br from-background to-muted/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold mb-4">Why Choose TajEats?</h2>
                        <p className="text-xl text-muted-foreground">Experience the best of Tajik hospitality and cuisine</p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <Card className="glass card-hover border-border/20 text-center p-8 h-full">
                                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Clock className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
                                <p className="text-muted-foreground">Get your food delivered in 30 minutes or less from the best restaurants in Tajikistan.</p>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="glass card-hover border-border/20 text-center p-8 h-full">
                                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Star className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">Quality Food</h3>
                                <p className="text-muted-foreground">Authentic Tajik dishes prepared by experienced chefs using traditional recipes and fresh ingredients.</p>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="glass card-hover border-border/20 text-center p-8 h-full">
                                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Truck className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">Easy Ordering</h3>
                                <p className="text-muted-foreground">Simple and intuitive ordering process with real-time tracking and multiple payment options.</p>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Restaurants */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold mb-4">Featured Restaurants</h2>
                            <p className="text-xl text-muted-foreground">Discover the most popular restaurants in your area</p>
                        </motion.div>
                        <Link to="/restaurants">
                            <Button variant="outline" size="lg" className="hidden md:flex">
                                View All Restaurants
                            </Button>
                        </Link>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        {featuredRestaurants.map((restaurant) => (
                            <motion.div
                                key={restaurant.id}
                                variants={itemVariants}
                            >
                                <RestaurantCard restaurant={restaurant} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-12 md:hidden">
                        <Link to="/restaurants">
                            <Button size="lg" className="btn-hero">
                                View All Restaurants
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Download App Section */}
            <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        className="max-w-3xl mx-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Get the TajEats App</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Download our mobile app for an even better experience. Order faster, track your delivery, and get exclusive offers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="btn-hero shadow-lg hover:shadow-xl transition-all">
                                Download for iOS
                            </Button>
                            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white shadow-lg">
                                Download for Android
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Landing;