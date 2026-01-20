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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { Star, MessageSquare } from 'lucide-react';

interface AddReviewDialogProps {
    restaurantId: string;
    restaurantName: string;
    userName?: string;
    userAvatar?: string;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

const AddReviewDialog: React.FC<AddReviewDialogProps> = ({
    restaurantId,
    restaurantName,
    userName = 'Guest User',
    userAvatar = '',
    trigger,
    onSuccess,
}) => {
    const { addReview } = useData();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(userName);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name.trim().length < 2) {
            toast({
                title: 'Name required',
                description: 'Please enter your name (at least 2 characters).',
                variant: 'destructive',
            });
            return;
        }

        if (rating === 0) {
            toast({
                title: 'Rating required',
                description: 'Please select a rating before submitting your review.',
                variant: 'destructive',
            });
            return;
        }

        if (comment.trim().length < 10) {
            toast({
                title: 'Comment too short',
                description: 'Please write at least 10 characters in your review.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            await addReview({
                restaurantId,
                userName: name.trim(),
                userAvatar,
                rating,
                comment: comment.trim(),
                date: new Date().toISOString(),
            });

            toast({
                title: 'Review submitted!',
                description: `Thank you for reviewing ${restaurantName}.`,
            });

            setOpen(false);
            setName(userName);
            setRating(0);
            setComment('');
            onSuccess?.();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to submit review',
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
                    <Button className="btn-hero">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Write a Review
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with {restaurantName}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name or nickname"
                            minLength={2}
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Your Rating *</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            star <= (hoveredRating || rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-muted-foreground'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {rating === 5 && 'Excellent!'}
                                {rating === 4 && 'Very Good!'}
                                {rating === 3 && 'Good'}
                                {rating === 2 && 'Fair'}
                                {rating === 1 && 'Poor'}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Your Review *</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your experience..."
                            rows={5}
                            minLength={10}
                            maxLength={500}
                            required
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {comment.length}/500 characters
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddReviewDialog;
