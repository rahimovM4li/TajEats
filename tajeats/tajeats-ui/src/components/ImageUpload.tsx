import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { imageService } from '@/services/imageService';

interface ImageUploadProps {
    currentImageUrl?: string;
    onImageUploaded: (imageUrl: string) => void;
    uploadType: 'restaurant' | 'dish' | 'restaurant-logo';
    entityId: number;
    label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImageUrl,
    onImageUploaded,
    uploadType,
    entityId,
    label = 'Upload Image',
}) => {
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = imageService.validateImageFile(file);
        if (!validation.valid) {
            toast({
                title: 'Invalid file',
                description: validation.error,
                variant: 'destructive',
            });
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setIsUploading(true);
        try {
            let result: { imageUrl?: string; logoUrl?: string };

            if (uploadType === 'restaurant') {
                result = await imageService.uploadRestaurantImage(entityId, file);
            } else if (uploadType === 'restaurant-logo') {
                result = await imageService.uploadRestaurantLogo(entityId, file);
            } else {
                result = await imageService.uploadDishImage(entityId, file);
            }

            const uploadedUrl = result.imageUrl || result.logoUrl || '';
            onImageUploaded(uploadedUrl);

            toast({
                title: 'Success',
                description: 'Image uploaded successfully',
            });
        } catch (error: any) {
            toast({
                title: 'Upload failed',
                description: error.message || 'Failed to upload image',
                variant: 'destructive',
            });
            setPreview(currentImageUrl);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium">{label}</label>
            
            <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="relative w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted">
                    {preview ? (
                        <>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={handleRemove}
                                className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80"
                                disabled={isUploading}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div className="flex flex-col gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? 'Uploading...' : 'Choose File'}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        JPEG, PNG, WebP (max 5MB)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
