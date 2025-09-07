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
            if (window.location.origin === "https://www.fatafatorder.shop") {
                return;
            }
            // TODO: make this smarter
            if (accountType === FREE_TRIAL && !window.location.pathname.includes('shop')) {
                navigate('/shop/dashboard');
                // TODO: load details of user...
                setTimeout(() => {
                    setHasLoaded(true);
                }, 500);
            } else {
                setHasLoaded(true);

                // navigate('/')
                // setTimeout(() => {
                //     setHasLoaded(true);
                // }, 500);
            }

        }, 1000);
    }, [accountType])

    if (window.location.origin === "https://www.fatafatorder.shop") {
        return <>
            <Logo className='animate-pulse' />
        </>
    }

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