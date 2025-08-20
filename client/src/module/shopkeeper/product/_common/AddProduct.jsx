import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Weight, Package, X, ScanBarcode, Hash } from "lucide-react";

// Define product schema with Zod for validation
const productFormSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    category: z.string({
        required_error: "Please select a category.",
    }),
    price: z.coerce.number().min(1, {
        message: "Price must be greater than ₹0.",
    }),
    costPrice: z.coerce.number().min(0).optional().or(z.literal('')),
    stock: z.coerce.number().min(0, {
        message: "Stock cannot be negative.",
    }),
    minStock: z.coerce.number().min(0, {
        message: "Minimum stock cannot be negative.",
    }),
    description: z.string().optional(),
    isWeightBased: z.boolean().default(false),
    weight: z.coerce.number().min(1, {
        message: "Weight must be greater than 0",
    }).or(z.literal(undefined)),
    weightUnit: z.string().optional(),
    packetSize: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
});


// Define product categories and units
const PRODUCT_CATEGORIES = [
    "Dairy & Eggs",
    "Flour & Grains",
    "Beverages",
    "Vegetables",
    "Snacks & Chips",
    "Condiments & Sauces",
    "Frozen Foods",
    "Personal Care",
    "Household Items",
    "Other"
];

const WEIGHT_UNITS = ["g", "kg", "ml", "li"];
const FLOUR_WEIGHTS = ["100", "250", "500", "1000"];

// Default form values
const defaultValues = {
    name: "",
    category: "",
    price: 0,
    costPrice: undefined,
    stock: 0,
    minStock: 5,
    description: "",
    isWeightBased: false,
    weight: undefined,
    weightUnit: "g",
    packetSize: "",
    sku: "",
    barcode: "",
};

export function AddProductModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [prevSelectedWeightUnit, setPrevSelectedWeightUnit] = useState(null);

    const form = useForm({
        resolver: zodResolver(productFormSchema),
        defaultValues,
        mode: "onSubmit",
    });

    const watchIsWeightBased = form.watch("isWeightBased");
    const weightUnit = form.watch('weightUnit')
    const selectedWeightOrVolumeValue = form.watch('weight')

    const onSubmit = (data) => {
        setIsOpen(false);
        form.reset();
    };

    const handleQuickWeightOrVolumeSelect = (weight) => {
        form.setValue("weight", parseFloat(weight));
    };

    // const generateSku = () => {
    //     const categoryPrefix = watchCategory.slice(0, 3).toUpperCase();
    //     const randomNum = Math.floor(1000 + Math.random() * 9000);
    //     const sku = `${categoryPrefix}-${randomNum}`;
    //     form.setValue("sku", sku);
    // };

    // const generateBarcode = () => {
    //     const barcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    //     form.setValue("barcode", barcode);
    // };


    useEffect(() => {
        const smallUnits = ['g', 'ml']
        const bigUnits = ['kg', 'li']
        if (prevSelectedWeightUnit && selectedWeightOrVolumeValue) {
            if (smallUnits.includes(prevSelectedWeightUnit) && bigUnits.includes(weightUnit)) {
                form.setValue('weight', selectedWeightOrVolumeValue / 100)
            }
            if (bigUnits.includes(prevSelectedWeightUnit) && smallUnits.includes(weightUnit)) {
                form.setValue('weight', selectedWeightOrVolumeValue * 100)
            }
        }
        if (weightUnit) {
            setPrevSelectedWeightUnit(weightUnit)
        }
    }, [weightUnit, selectedWeightOrVolumeValue, prevSelectedWeightUnit])

    useEffect(() => {
        form.setValue("weight", watchIsWeightBased ? 0 : undefined);
    }, [watchIsWeightBased])


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
                <div className="sticky top-0 bg-white z-10 border-b p-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Add New Product</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new product to your inventory
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Milk, Flour, Potatoes"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category *</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedCategory(value);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {PRODUCT_CATEGORIES.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling Price (₹) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="costPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cost Price (₹)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                value={field.value === undefined ? '' : field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Stock *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minStock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Low Stock Alert</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="5"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isWeightBased"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormDescription className='italic'>
                                            Enable if product is sold by weight/volume
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {watchIsWeightBased && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="weightUnit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {WEIGHT_UNITS.map((unit) => (
                                                            <SelectItem key={unit} value={unit}>
                                                                {unit}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{["Volume", "Weight"][['ml', 'li'].includes(form.watch('weightUnit')) ? 0 : 1]}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0"
                                                        {...field}
                                                        value={field.value === undefined ? '' : field.value}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div>
                                    <p className="italic text-xs">Quick Select</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {FLOUR_WEIGHTS.map((weight) => {
                                            if (['li', 'kg'].includes(form.watch('weightUnit'))) {
                                                return Number(weight) / 100;
                                            }
                                            return weight;
                                        }).map((weight) => (
                                            <Button
                                                key={weight}
                                                type="button"
                                                size="sm"
                                                className={`${selectedWeightOrVolumeValue === parseFloat(weight) ? 'bg-primary/80' : 'bg-primary/50'} flex-1 text-primary-foreground`}
                                                onClick={() => handleQuickWeightOrVolumeSelect(weight)}
                                            >
                                                {weight}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                            </>
                        )}

                        {/* SKU & Barcode */}
                        {/* <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    placeholder="Optional"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={generateSku}
                                                disabled={!watchCategory}
                                            >
                                                <Hash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormDescription>
                                            Unique identifier for your product
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="barcode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Barcode</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    placeholder="Optional"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={generateBarcode}
                                            >
                                                <ScanBarcode className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormDescription>
                                            Product barcode for scanning
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div> */}

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Product details, features, etc."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 -mb-4 flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Add Product</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}