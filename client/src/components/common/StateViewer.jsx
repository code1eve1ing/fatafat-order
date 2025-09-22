import { useEffect, useState } from 'react';

// TODO: use shadcn dialog later
import { Modal } from '../ui/modal';
import useAuthStore from '@/store/auth';
import useShopStore from '@/store/shop';
import useCustomerStore from '@/store/customer';

const StateViewer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const authState = useAuthStore();
    const shopState = useShopStore();
    const customerState = useCustomerStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'i' && import.meta.env.VITE_ENVIRONMENT === 'dev') {
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (import.meta.env.VITE_ENVIRONMENT !== 'dev') return null;

    const renderStore = (title, store) => (
        <div key={title} className="mb-6">
            <h3 className="font-medium text-lg mb-2">{title}</h3>
            <div className="bg-gray-50 rounded-md p-4 overflow-auto max-h-60">
                {Object.entries(store).map(([key, value]) => (
                    typeof value === 'function' ? null : (
                        <div key={key} className="mb-2 last:mb-0">
                            <div className="font-mono text-sm">
                                <span className="text-purple-600">{key}:</span>{' '}
                                <span className="text-gray-800">
                                    {typeof value === 'object' ? (
                                        <pre className="mt-1 ml-4">{JSON.stringify(value, null, 2)}</pre>
                                    ) : (
                                        String(value)
                                    )}
                                </span>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Application State"
        >
            <div className="space-y-4">
                {renderStore('Auth Store', authState)}
                {renderStore('Shop Store', shopState)}
                {renderStore('Customer Store', customerState)}
            </div>
        </Modal>
    );
};

export default StateViewer;