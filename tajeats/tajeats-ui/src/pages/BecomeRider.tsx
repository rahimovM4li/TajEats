import React, { useState } from 'react';
import { Bike, CheckCircle, Upload, Star, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const BecomeRider: React.FC = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        vehicleType: '',
        experience: '',
        availability: '',
        licenseFile: null as File | null,
        agreeTerms: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({
            ...formData,
            licenseFile: file
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: integrate with backend API
        try {
            // Validate required fields
            if (!formData.name || !formData.phone || !formData.city || !formData.vehicleType || !formData.agreeTerms) {
                throw new Error('Please fill in all required fields and accept the terms.');
            }

            // Mock form submission
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSubmitted(true);
            toast({
                title: "Application submitted successfully!",
                description: "We'll review your application and contact you within 2-3 business days.",
            });
        } catch (error) {
            toast({
                title: "Error submitting application",
                description: error instanceof Error ? error.message : "Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center">
                <div className="container mx-auto px-4 py-16">
                    <Card className="glass border-border/20 max-w-2xl mx-auto text-center">
                        <CardContent className="p-12">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                Thank you for your interest in becoming a TajEats delivery rider.
                                We've received your application and will review it carefully.
                            </p>
                            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span>Application received and logged</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>Review within 2-3 business days</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Star className="w-5 h-5 text-primary" />
                                    <span>Background check and verification</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Bike className="w-5 h-5 text-primary" />
                                    <span>Onboarding and training setup</span>
                                </div>
                            </div>
                            <Button
                                onClick={() => window.location.href = '/'}
                                className="btn-hero"
                            >
                                Return to Home
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bike className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4 gradient-text">Become a Rider</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join the TajEats delivery team and earn money on your own schedule while serving your community.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Benefits Section */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Why Join TajEats?</h2>
                            <p className="text-muted-foreground mb-8">
                                Be part of Tajikistan's growing food delivery network and enjoy the flexibility
                                of being your own boss while earning competitive rates.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Competitive Earnings</h3>
                                            <p className="text-muted-foreground">Earn up to 150 TJS per day with tips and bonuses</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Flexible Schedule</h3>
                                            <p className="text-muted-foreground">Work when you want, as much as you want</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass border-border/20 hover-scale">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                                            <Star className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Full Support</h3>
                                            <p className="text-muted-foreground">24/7 rider support and training provided</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="glass border-border/20">
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Must be 18+ years old</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Valid driver's license or ID</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Own vehicle (bike, scooter, or car)</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Smartphone with data plan</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Good knowledge of local area</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Application Form */}
                    <div>
                        <Card className="glass border-border/20">
                            <CardHeader>
                                <CardTitle className="text-2xl">Rider Application</CardTitle>
                                <p className="text-muted-foreground">
                                    Fill out the form below to start your journey with TajEats.
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
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+992 XX XXX XXXX"
                                                required
                                                className="border-border/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your.email@example.com"
                                            className="border-border/20"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City *</Label>
                                            <Select onValueChange={(value) => handleSelectChange('city', value)}>
                                                <SelectTrigger className="border-border/20">
                                                    <SelectValue placeholder="Select your city" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dushanbe">Dushanbe</SelectItem>
                                                    <SelectItem value="khujand">Khujand</SelectItem>
                                                    <SelectItem value="kulob">Kulob</SelectItem>
                                                    <SelectItem value="qurghonteppa">Qurghonteppa</SelectItem>
                                                    <SelectItem value="isfara">Isfara</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="vehicleType">Vehicle Type *</Label>
                                            <Select onValueChange={(value) => handleSelectChange('vehicleType', value)}>
                                                <SelectTrigger className="border-border/20">
                                                    <SelectValue placeholder="Select vehicle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bicycle">Bicycle</SelectItem>
                                                    <SelectItem value="scooter">Scooter</SelectItem>
                                                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                                                    <SelectItem value="car">Car</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="experience">Delivery Experience</Label>
                                        <Textarea
                                            id="experience"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about any previous delivery or driving experience..."
                                            rows={3}
                                            className="border-border/20 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="availability">Preferred Working Hours</Label>
                                        <Textarea
                                            id="availability"
                                            name="availability"
                                            value={formData.availability}
                                            onChange={handleInputChange}
                                            placeholder="When are you usually available to work? (e.g., weekdays 9-5, weekends, evenings)"
                                            rows={2}
                                            className="border-border/20 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="license">Driver's License / ID *</Label>
                                        <div className="mt-2">
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="license" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border/20 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/80 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                                        <p className="mb-2 text-sm text-muted-foreground">
                                                            <span className="font-semibold">Click to upload</span> your license
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 5MB)</p>
                                                        {formData.licenseFile && (
                                                            <p className="text-xs text-primary mt-2">
                                                                File selected: {formData.licenseFile.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <input
                                                        id="license"
                                                        type="file"
                                                        className="hidden"
                                                        accept=".png,.jpg,.jpeg,.pdf"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="terms"
                                            checked={formData.agreeTerms}
                                            onCheckedChange={(checked) =>
                                                setFormData({ ...formData, agreeTerms: checked as boolean })
                                            }
                                        />
                                        <Label htmlFor="terms" className="text-sm">
                                            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and
                                            <a href="#" className="text-primary hover:underline ml-1">Privacy Policy</a> *
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full btn-hero"
                                        disabled={isSubmitting || !formData.agreeTerms}
                                    >
                                        {isSubmitting ? (
                                            <>Submitting Application...</>
                                        ) : (
                                            <>
                                                <Bike className="w-4 h-4 mr-2" />
                                                Submit Application
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeRider;