import { useState, useRef } from "react";
import { uploadEmployeePhoto, deleteEmployeePhoto } from "../../services/photoService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2, Trash2 } from "lucide-react";

export const EmployeePhotoUpload = ({ employeeId, currentPhoto, onPhotoUpdated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef(null);
    const { toast } = useToast();

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please select a JPEG, JPG, or PNG image.",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "Please select an image smaller than 5MB.",
                variant: "destructive",
            });
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const result = await uploadEmployeePhoto(employeeId, selectedFile);
            toast({
                title: "Success",
                description: "Photo uploaded successfully!",
            });
            setIsOpen(false);
            setSelectedFile(null);
            setPreview(null);
            if (onPhotoUpdated) {
                onPhotoUpdated(result.data.photo);
            }
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: error.response?.data?.message || "Failed to upload photo. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteEmployeePhoto(employeeId);
            toast({
                title: "Success",
                description: "Photo deleted successfully!",
            });
            setIsOpen(false);
            if (onPhotoUpdated) {
                onPhotoUpdated(null);
            }
        } catch (error) {
            toast({
                title: "Delete Failed",
                description: error.response?.data?.message || "Failed to delete photo. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreview(null);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="relative group">
                    {currentPhoto ? (
                        <div className="relative">
                            <img
                                src={currentPhoto}
                                alt="Employee"
                                className="h-10 w-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-blue-400 transition-colors"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all flex items-center justify-center">
                                <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-slate-200 group-hover:border-blue-400 transition-colors flex items-center justify-center">
                            <Camera className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                    )}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Employee Photo</DialogTitle>
                    <DialogDescription>
                        Upload or update the employee's profile photo. Max size: 5MB.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current or Preview Photo */}
                    <div className="flex justify-center">
                        {preview ? (
                            <div className="relative">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                                />
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreview(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : currentPhoto ? (
                            <img
                                src={currentPhoto}
                                alt="Current"
                                className="h-32 w-32 rounded-full object-cover border-4 border-slate-100"
                            />
                        ) : (
                            <div className="h-32 w-32 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center">
                                <Camera className="w-12 h-12 text-slate-400" />
                            </div>
                        )}
                    </div>

                    {/* File Input */}
                    <div className="flex justify-center">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="photo-upload"
                        />
                        <label
                            htmlFor="photo-upload"
                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Choose Photo
                        </label>
                    </div>

                    {selectedFile && (
                        <p className="text-sm text-center text-slate-600">
                            Selected: {selectedFile.name}
                        </p>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <div>
                        {currentPhoto && (
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting || isUploading}
                                className="gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancel} disabled={isUploading || isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading || isDeleting}
                            className="gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
