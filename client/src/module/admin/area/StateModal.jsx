import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StateModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    loading = false
}) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setCode(initialData.code || '');
        } else {
            setName('');
            setCode('');
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'State name is required';
        } else if (name.trim().length > 100) {
            newErrors.name = 'State name cannot exceed 100 characters';
        }

        if (!code.trim()) {
            newErrors.code = 'State code is required';
        } else if (code.trim().length > 10) {
            newErrors.code = 'State code cannot exceed 10 characters';
        } else if (!/^[A-Z0-9]+$/.test(code.trim().toUpperCase())) {
            newErrors.code = 'State code must contain only uppercase letters and numbers';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await onSubmit({ 
                name: name.trim(), 
                code: code.trim().toUpperCase() 
            });
            onClose();
        } catch (error) {
            // Error is handled by the parent component
        }
    };

    const handleCodeChange = (e) => {
        // Auto-convert to uppercase
        setCode(e.target.value.toUpperCase());
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit State' : 'Add New State'}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? 'Update state details here.'
                            : 'Add a new state to the system.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">State Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter state name"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="code">State Code</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={handleCodeChange}
                                placeholder="Enter state code (e.g., MH, GJ)"
                                className={errors.code ? 'border-red-500' : ''}
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">{errors.code}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
