import { FREE_TRIAL, SHOPKEEPER } from "@/lib/constants/user";
import authService from "@/services/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import useAuth from "@/hooks/useAuth";

const InitialRouteHandler = ({ children }) => {

    const navigate = useNavigate();
    const accountType = authService.getAccountType();
    const [hasLoaded, setHasLoaded] = useState(false);
    const { getCurrentUser, loading } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            if (window.location.origin === "https://www.fatafatorder.shop") {
                return;
            }
            // TODO: make this smarter
            if (accountType === FREE_TRIAL && !window.location.pathname.includes('shop')) {
                // navigate('/shop/dashboard');
                // // TODO: load details of user...
                // setTimeout(() => {
                //     setHasLoaded(true);
                // }, 500);
            } else {
                setHasLoaded(true);
            }

        }, 1000);
    }, [accountType])


    const getUserDetails = async () => {
        const callback = (user) => {
            if (user?.role === SHOPKEEPER && !window.location.pathname.includes('shop')) {
                navigate('/shop/dashboard');
            }

            // If user is null in response from backend
            // it's either on FREE_TRIAL(show dashbaord) or new user(landing page)
            if (!user) {
                if (accountType === FREE_TRIAL) {
                    // Prevent internal navigation in CMS for shopkeeper
                    // not used && because it navigated to else block in strict mode
                    if (!window.location.pathname.includes('shop')) {
                        navigate('/shop/dashboard');
                    }
                } else {
                    // navigate('/');
                }
            }
        }
        await getCurrentUser(callback);
    }

    useEffect(() => {
        getUserDetails();
    }, [])


    if (window.location.origin === "https://www.fatafatorder.shop") {
        return <>
            <Logo className='animate-pulse' />
        </>
    }


    if (loading) {
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