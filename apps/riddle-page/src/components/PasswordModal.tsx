import { Button, Input } from "@genuineundead/ui";
import { useState } from 'react';
import Modal from './Modal';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string) => Promise<void>; // Expect onSubmit to be async
}

export default function PasswordModal({ isOpen, onClose, onSubmit }: PasswordModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleSubmit = async () => {
        try {
            setError(null); // Clear any previous error
            await onSubmit(password);
            setIsSuccessful(true); // Set success if no error
        } catch (err) {
            setError(err.message || 'Incorrect password, please try again.'); // Set error message
        }
    };

    const handleClose = () => {
        setPassword('');
        setError(null);
        setIsSuccessful(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            {isSuccessful ? (
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Success!</h2>
                    <p>The lock has been successfully unlocked.</p>
                    <Button onClick={handleClose} className="mt-4">
                        Close
                    </Button>
                </div>
            ) : (
                <div>
                    <Input
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleSubmit} className="w-full">
                            Submit
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}