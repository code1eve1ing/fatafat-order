import { Loader2 } from "lucide-react"
import { Button as UiButton } from "../ui/button"

const Button = ({ loading, children, ...props }) => {
    return (
        <UiButton disabled={loading} {...props}>
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : <>
                {children}
            </>}
        </UiButton>
    )
}

export default Button;