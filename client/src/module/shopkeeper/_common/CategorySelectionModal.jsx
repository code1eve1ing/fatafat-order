import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/common/Button";
import { useState, useEffect } from "react";
import { Store, Tag, Check } from "lucide-react";

const CategorySelectionModal = ({
    isOpen,
    onClose,
    categories = [],
    onCategorySelect
}) => {
    const [selectedCategory, setSelectedCategory] = useState("");

    // Reset selection when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSelectedCategory("");
        }
    }, [isOpen]);

    const handleSelect = () => {
        if (selectedCategory && onCategorySelect) {
            onCategorySelect(selectedCategory);
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        Choose Shop Category
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Select a category that best describes your shop. This helps customers find your products more easily.
                    </p>

                    <div className="grid gap-3 max-h-80 overflow-y-auto p-1">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedCategory === category._id
                                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-accent/50"
                                    }`}
                                onClick={() => setSelectedCategory(category._id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${selectedCategory === category._id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                            }`}>
                                            <Tag className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">{category.name}</span>
                                    </div>

                                    {selectedCategory === category._id && (
                                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No categories available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSelect}
                        disabled={!selectedCategory}
                        className="gap-2"
                    >
                        <Check className="h-4 w-4" />
                        Confirm Selection
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CategorySelectionModal;