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

export function DistrictModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    cities = [],
    loading = false
}) {
    const [name, setName] = useState('');
    const [cityId, setCityId] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setCityId(initialData.city?.id || initialData.cityId || '');
        } else {
            setName('');
            setCityId('');
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'District name is required';
        } else if (name.trim().length > 100) {
            newErrors.name = 'District name cannot exceed 100 characters';
        }

        if (!cityId) {
            newErrors.cityId = 'Please select a city';
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
                cityId 
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
                        {initialData ? 'Edit District' : 'Add New District'}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? 'Update district details here.'
                            : 'Add a new district to the selected city.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">District Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter district name"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Select value={cityId} onValueChange={setCityId}>
                                <SelectTrigger className={errors.cityId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id || city._id} value={city.id || city._id}>
                                            {city.name} ({city.stateId?.name || city.state?.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.cityId && (
                                <p className="text-sm text-red-500">{errors.cityId}</p>
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
