import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
    const location = useLocation();

    // Don't show footer on admin or restaurant portals
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/restaurant')) {
        return null;
    }

    return (
        <footer className="bg-gradient-to-br from-primary/10 to-accent/10 border-t border-border/20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">T</span>
                            </div>
                            <span className="text-2xl font-bold gradient-text">TajEats</span>
                        </Link>
                        <p className="text-muted-foreground">
                            Order food fast in Tajikistan. Delivering delicious meals from your favorite restaurants right to your door.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                            <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/restaurants" className="text-muted-foreground hover:text-primary transition-colors">All Restaurants</Link></li>
                            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* For Partners */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">For Partners</h3>
                        <ul className="space-y-2">
                            <li><Link to="/restaurant/register" className="text-muted-foreground hover:text-primary transition-colors">Partner with Us</Link></li>
                            <li><Link to="/restaurant" className="text-muted-foreground hover:text-primary transition-colors">Restaurant Portal</Link></li>
                            <li><Link to="/become-rider" className="text-muted-foreground hover:text-primary transition-colors">Become a Rider</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">+992 (44) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">support@tajeats.tj</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Rudaki Avenue, Dushanbe, Tajikistan</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/20 mt-8 pt-8 text-center">
                    <p className="text-muted-foreground">
                        © 2024 TajEats. Made with ❤️ for Tajikistan. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;