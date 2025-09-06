import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"


export function FormGenerator({
    fields,
    schema,
    onSubmit,
    defaultValues,
    submitText = "Submit",
    cancelText = "Cancel",
    onCancel,
    columns = 1,
}) {

    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
    }

    const colSpans = {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
    }
    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onSubmit",
        defaultValues,
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
                <div className={`grid ${gridCols[columns]} gap-4`}>
                    {fields.map((field) => (
                        <div
                            key={field.name}
                            className={field.className ?? (field.colSpan ? colSpans[field.colSpan] : "") + " relative"}
                        >
                            <FormField
                                control={form.control}
                                name={field.name}
                                render={({ field: rhfField }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {field.label}
                                        </FormLabel>

                                        {/* Always only 1 child inside FormControl */}
                                        {field.type === "text" && (
                                            <FormControl>
                                                <Input placeholder={field.placeholder} {...rhfField} />
                                            </FormControl>
                                        )}

                                        {field.type === "number" && (
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder={field.placeholder}
                                                    {...rhfField}
                                                    value={rhfField.value ?? ""}
                                                />
                                            </FormControl>
                                        )}

                                        {field.type === "textarea" && (
                                            <FormControl>
                                                <Textarea
                                                    placeholder={field.placeholder}
                                                    className="resize-none"
                                                    {...rhfField}
                                                />
                                            </FormControl>
                                        )}

                                        {field.type === "select" && (
                                            <Select
                                                onValueChange={(value) => {
                                                    // Check if the selected option has an onClick handler
                                                    const selectedOption = field.options?.find(opt =>
                                                        typeof opt === 'object' && opt.value === value
                                                    );

                                                    if (selectedOption?.onClick) {
                                                        selectedOption.onClick();
                                                        // Don't update the value if it's a special action
                                                        return;
                                                    }
                                                    rhfField.onChange(value);
                                                }}
                                                value={rhfField.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={field.placeholder} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                {
                                                    !rhfField.value && !form.formState.errors[field.name] ? (
                                                        <span className="absolute left-3.5 bottom-4 text-sm text-gray-500 pointer-events-none">Select ...</span>
                                                    ) : null
                                                }
                                                <SelectContent className="w-full">
                                                    {field.options?.map((opt) => (
                                                        typeof opt === "object" ? (
                                                            <SelectItem
                                                                key={opt.value}
                                                                value={String(opt.value)}
                                                            >
                                                                {opt.label || opt.value}
                                                            </SelectItem>
                                                        ) : (
                                                            <SelectItem key={opt} value={String(opt)}>
                                                                {opt}
                                                            </SelectItem>
                                                        )
                                                    ))}
                                                </SelectContent>
                                                <span className="text-xs text-muted-foreground">{field.helpText}</span>
                                            </Select>
                                        )}

                                        {field.type === "switch" && (
                                            <FormControl>
                                                <Switch
                                                    checked={!!rhfField.value}
                                                    onCheckedChange={rhfField.onChange}
                                                />
                                            </FormControl>
                                        )}

                                        {field.description && (
                                            <FormDescription>{field.description}</FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-2 border-t pt-4">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {cancelText}
                        </Button>
                    )}
                    <Button type="submit">{submitText}</Button>
                </div>
            </form>
        </Form>
    )
}
