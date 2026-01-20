import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: integrate with backend API
        try {
            // Mock form submission
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Message sent successfully!",
                description: "We'll get back to you within 24 hours.",
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast({
                title: "Error sending message",
                description: "Please try again or contact us directly.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent("Здравствуйте! Хочу сделать заказ.");
        const whatsappURL = `https://wa.me/992441234567?text=${message}`;
        window.open(whatsappURL, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 gradient-text">Contact Us</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions or need help? We're here to assist you. Reach out to us anytime.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                            <p className="text-muted-foreground mb-8">
                                We're always happy to help! Whether you have questions about your order,
                                need technical support, or want to partner with us, don't hesitate to reach out.
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="space-y-6">
                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Phone Support</h3>
                                            <p className="text-muted-foreground">+992 (44) 123-4567</p>
                                            <p className="text-sm text-muted-foreground">Available 9 AM - 11 PM daily</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Email Support</h3>
                                            <p className="text-muted-foreground">support@tajeats.tj</p>
                                            <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Office Address</h3>
                                            <p className="text-muted-foreground">Rudaki Avenue 45</p>
                                            <p className="text-muted-foreground">Dushanbe, Tajikistan</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">WhatsApp Support</h3>
                                            <p className="text-muted-foreground mb-2">Fast and convenient messaging</p>
                                            <Button
                                                onClick={handleWhatsApp}
                                                className="bg-green-500 hover:bg-green-600 text-white"
                                                size="sm"
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Chat on WhatsApp
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Business Hours */}
                        <Card className="glass border-border/20">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>Business Hours</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="text-muted-foreground">9:00 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="text-muted-foreground">10:00 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="text-muted-foreground">10:00 AM - 10:00 PM</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <Card className="glass border-border/20">
                            <CardHeader>
                                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                                <p className="text-muted-foreground">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Your full name"
                                                required
                                                className="border-border/20"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+992 XX XXX XXXX"
                                                className="border-border/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your.email@example.com"
                                            required
                                            className="border-border/20"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="What is your message about?"
                                            required
                                            className="border-border/20"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Please describe your inquiry in detail..."
                                            required
                                            rows={6}
                                            className="border-border/20 resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full btn-hero"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>Sending...</>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Map Placeholder */}
                        <Card className="glass border-border/20 mt-8">
                            <CardContent className="p-0">
                                <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">Find Us Here</h3>
                                        <p className="text-muted-foreground">
                                            Rudaki Avenue 45, Dushanbe<br />
                                            Tajikistan
                                        </p>
                                        {/* TODO: integrate with Google Maps */}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;