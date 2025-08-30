import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import * as z from "zod"
import { FormGenerator } from "@/components/common/FormGenerator";
import shopkeeperService from "@/services/shopkeeperService";
import useShopkeeperStore from "@/store/shopkeeper";

/**
 * 
 * Pattern
 * Create-update update localstorage using service -> store
 * Component initialize read from localstorage using service -> store
 */

export function AddProductModal({ variant = "default", linkText, data, isEdit, handler }) {

    const category = 'FOOD_STORE'
    const [isOpen, setIsOpen] = useState(null);
    const [defaultValues, setDefaultValues] = useState({});
    const [isCreateMenuSection, setIsCreateMenuSection] = useState(false);
    const { addProduct, addSection, getMenuSections, updateProduct } = useShopkeeperStore();
    const [_, set_] = useState({})
    const sections = getMenuSections();



    const productSchema = z.object({
        name: z.string().min(1, "Product name is required"),
        section: z.string().min(1, "Section is required"),
        price: z.coerce.number().min(1, "Price must be greater than ₹0"),
        description: z.string().optional(),
    })

    const formFields = _?.FORM ? [
        { name: "name", label: _.FORM.NAME_FIELD_LABEL, type: "text", placeholder: _.FORM.NAME_FIELD_PLACEHOLDER, required: true, colSpan: 2 },
        { name: "section", label: _.FORM.CATEGORY_FIELD_LABEL, type: "select", options: [...(sections.map(s => ({ value: s._id, label: s.name }))), { value: "+ Create New", onClick: () => { setIsCreateMenuSection(true) } }], required: true },
        { name: "price", label: _.FORM.PRICE_FIELD_LABEL, type: "number", placeholder: "0.00", required: true },
        { name: "description", label: _.FORM.DESCRIPTION_FIELD_LABEL, type: "textarea", placeholder: "Optional", colSpan: 2 },
    ] : []
    // TODO: add add-ons (oil, butter, cheese)

    const getFormContext = () => {
        const formContext = {
            'FOOD_STORE': {
                'add': {
                    'BUTTON_TEXT': "Add Menu Item",
                    'DIALOG_TITLE': "New Menu Item",
                    'DIALOG_DESCRIPTION': "Fill in the details below to add a new menu item to your shop",
                    'FORM': {
                        NAME_FIELD_LABEL: "Item Name",
                        NAME_FIELD_PLACEHOLDER: "e.g., Double Cheese Pizza",
                        CATEGORY_FIELD_LABEL: "Menu Section",
                        PRICE_FIELD_LABEL: "Price (₹)",
                        DESCRIPTION_FIELD_LABEL: "Description",
                        IS_WEIGHT_BASED_FIELD_LABEL: "Sold by weight?",
                    }
                },
                'edit': {
                    'BUTTON_TEXT': "Update Menu Item",
                    'DIALOG_TITLE': "Edit Menu Item",
                    'DIALOG_DESCRIPTION': "Fill in the details below to edit a menu item in your shop",
                    'FORM': {
                        NAME_FIELD_LABEL: "Item Name",
                        NAME_FIELD_PLACEHOLDER: "e.g., Double Cheese Pizza",
                        CATEGORY_FIELD_LABEL: "Menu Section",
                        PRICE_FIELD_LABEL: "Price (₹)",
                        DESCRIPTION_FIELD_LABEL: "Description",
                        IS_WEIGHT_BASED_FIELD_LABEL: "Sold by weight?",
                    }
                }
            }
        }
        return formContext[category][isEdit ? 'edit' : 'add']
    }

    const getSubmissionHandler = () => {
        const productId = data?._id
        const submissionHandlers = {
            'FOOD_STORE': {
                'add': (data) => {
                    shopkeeperService.addProduct(data, (product) => {
                        addProduct(product);
                        setIsOpen(false)
                    })
                },
                'edit': (data) => {
                    const updatedProduct = { _id: productId, ...data }
                    shopkeeperService.updateProduct(updatedProduct, (product) => {
                        updateProduct(updatedProduct);
                        setIsOpen(false)
                    })
                }
            }
        }
        return submissionHandlers[category][isEdit ? 'edit' : 'add']
    }

    const handleFormSubmit = (data) => {
        getSubmissionHandler()(data)
    }

    const handleCreateMenuFormSubmit = (data) => {
        shopkeeperService.saveSection(data, (section) => {
            addSection(section);
            setIsCreateMenuSection(false)
        })
    }

    // Used to control modal from external component
    useEffect(() => {
        if (handler?.isOpen) {
            setIsOpen(true)
        }
    }, [handler])

    // Cleanup process for external component
    useEffect(() => {
        if (isOpen === false && handler?.onClose) {
            handler?.onClose()
        }
    }, [isOpen])

    // Populate variables
    useEffect(() => {
        if (data) {
            setDefaultValues(data)
        } else {
            const defaultValuesMappins = {
                'FOOD_STORE': { name: "", section: "", price: 0 }
            }
            setDefaultValues(defaultValuesMappins[category])
        }

        const _ = getFormContext()
        set_(_)

    }, [data])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {variant === 'hidden' ? null : variant === "link" ? (
                    <span className="flex items-center gap-2"> {linkText || _.BUTTON_TEXT}</span>
                ) : (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> <span className="hidden md:inline">{_.BUTTON_TEXT}</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
                <div className="sticky top-0 bg-white z-10 border-b p-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{_.DIALOG_TITLE}</DialogTitle>
                        <DialogDescription>
                            {_.DIALOG_DESCRIPTION}
                        </DialogDescription>
                    </DialogHeader>
                    <FormGenerator
                        fields={formFields}
                        schema={productSchema}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsOpen(false)}
                        defaultValues={defaultValues}
                        columns={2}
                    />
                    <Dialog open={isCreateMenuSection} onOpenChange={setIsCreateMenuSection}>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
                            <div className="sticky top-0 bg-white z-10 border-b p-4">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">New Menu Section</DialogTitle>
                                    <DialogDescription>
                                        {"This will help you to group similar items together"}
                                    </DialogDescription>
                                </DialogHeader>
                                <FormGenerator
                                    fields={[{ name: "name", label: "Section", type: "text", placeholder: "e.g., Pizza, Cold Drinks", required: true, colSpan: 2 }]}
                                    schema={z.object({ name: z.string().min(1, "This field is required") })}
                                    onSubmit={handleCreateMenuFormSubmit}
                                    onCancel={() => setIsCreateMenuSection(false)}
                                    defaultValues={{ name: "" }}
                                    columns={2}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </DialogContent>
        </Dialog>
    );
}