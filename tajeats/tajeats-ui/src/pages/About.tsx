import React from 'react';
import { Shield, Heart, Star, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const About: React.FC = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-96 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url("/src/assets/hero-banner.jpg")'
                    }}
                />
                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                        About <span className="gradient-text-light">TajEats</span>
                    </h1>
                    <p className="text-xl opacity-90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Connecting Tajikistan with delicious food, one order at a time
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                {/* Mission Statement */}
                <section className="text-center mb-20">
                    <h2 className="text-4xl font-bold mb-8 gradient-text">Our Mission</h2>
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            TajEats is dedicated to bringing the rich culinary heritage of Tajikistan to your doorstep.
                            We connect food lovers with authentic local restaurants, supporting our community while
                            preserving traditional flavors and recipes that have been passed down through generations.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6 text-center">
                                    <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Authentic Cuisine</h3>
                                    <p className="text-muted-foreground">
                                        Preserving traditional Tajik recipes and cooking methods
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6 text-center">
                                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Community First</h3>
                                    <p className="text-muted-foreground">
                                        Supporting local restaurants and bringing communities together
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6 text-center">
                                    <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Quality Promise</h3>
                                    <p className="text-muted-foreground">
                                        Ensuring fresh, high-quality food delivered with care
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white font-bold text-2xl">1</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">Browse & Order</h3>
                            <p className="text-muted-foreground">
                                Explore restaurants in your area and choose from hundreds of delicious dishes.
                                Add your favorites to cart with just a few clicks.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white font-bold text-2xl">2</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">Restaurant Prepares</h3>
                            <p className="text-muted-foreground">
                                Our partner restaurants receive your order instantly and start preparing
                                your meal with fresh ingredients and traditional techniques.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white font-bold text-2xl">3</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
                            <p className="text-muted-foreground">
                                Our reliable delivery partners bring your hot, fresh meal right to your door.
                                Track your order in real-time from kitchen to doorstep.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team & Partners */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Our Partners</h2>
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <p className="text-xl text-muted-foreground">
                            We work with the finest restaurants across Tajikistan, from family-owned traditional kitchens
                            to modern establishments, all committed to serving authentic, high-quality food.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Traditional Restaurants", count: "25+", icon: Heart },
                            { name: "Happy Customers", count: "10K+", icon: Users },
                            { name: "Cities Served", count: "5", icon: Star },
                            { name: "Orders Delivered", count: "50K+", icon: CheckCircle }
                        ].map((stat, index) => (
                            <Card key={index} className="glass border-border/20 text-center hover-scale">
                                <CardContent className="p-6">
                                    <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <div className="text-3xl font-bold gradient-text mb-2">{stat.count}</div>
                                    <div className="text-muted-foreground">{stat.name}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section>
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4">
                            <AccordionItem value="item-1" className="glass border-border/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left">
                                    How long does delivery usually take?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Delivery times vary by restaurant and location, but most orders arrive within 25-45 minutes.
                                    You can see the estimated delivery time for each restaurant before ordering.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="glass border-border/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left">
                                    What payment methods do you accept?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Currently, we accept cash on delivery. We're working on adding card payments and mobile payment
                                    options to make ordering even more convenient.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="glass border-border/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left">
                                    How can restaurants partner with TajEats?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Restaurant owners can apply to join our platform by visiting our Partner Portal or contacting
                                    our team directly. We welcome all restaurants that meet our quality standards.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="glass border-border/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left">
                                    Is there a minimum order amount?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Minimum order amounts vary by restaurant, typically ranging from 20-30 TJS.
                                    The minimum order amount is displayed on each restaurant's page.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5" className="glass border-border/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left">
                                    What if I'm not satisfied with my order?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Customer satisfaction is our priority. If you're not happy with your order, please contact
                                    our support team within 24 hours and we'll work to resolve the issue promptly.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;