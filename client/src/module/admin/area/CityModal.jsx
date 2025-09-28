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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function CityModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    states = [],
    loading = false
}) {
    const [name, setName] = useState('');
    const [stateId, setStateId] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setStateId(initialData.state?.id || initialData.stateId || '');
        } else {
            setName('');
            setStateId('');
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'City name is required';
        } else if (name.trim().length > 100) {
            newErrors.name = 'City name cannot exceed 100 characters';
        }

        if (!stateId) {
            newErrors.stateId = 'Please select a state';
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
                stateId 
            });
            onClose();
        } catch (error) {
            // Error is handled by the parent component
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit City' : 'Add New City'}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? 'Update city details here.'
                            : 'Add a new city to the selected state.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">City Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter city name"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="state">State</Label>
                            <Select value={stateId} onValueChange={setStateId}>
                                <SelectTrigger className={errors.stateId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map((state) => (
                                        <SelectItem key={state.id || state._id} value={state.id || state._id}>
                                            {state.name} ({state.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.stateId && (
                                <p className="text-sm text-red-500">{errors.stateId}</p>
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
