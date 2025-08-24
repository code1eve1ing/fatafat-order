import { FREE_TRIAL } from "@/lib/constants/user";
import authService from "@/services/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../common/Logo";

const InitialRouteHandler = ({ children }) => {

    const navigate = useNavigate();
    const accountType = authService.getAccountType();
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            // TODO: make this smarter
            if (accountType === FREE_TRIAL) {
                navigate('/shop/dashboard');
                // TODO: load details of user...
                setTimeout(() => {
                    setHasLoaded(true);
                }, 500);
            } else {
                navigate('/')
                setTimeout(() => {
                    setHasLoaded(true);
                }, 500);
            }
        }, 1000);
    }, [accountType])

    if (!hasLoaded) {
        return <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            <Logo className='animate-pulse' />
            <p>
                <span className="text-xs">ફટાફટ</span> Order
            </p>
        </div>
    }
    return <>{children}</>;
};

export default InitialRouteHandler;