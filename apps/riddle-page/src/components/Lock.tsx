import Image from 'next/image';
import { useState } from 'react';
import PasswordModal from './PasswordModal';

declare interface LockProps {
    lockId: string;
    height: number;
    width: number;
    open: boolean;
}

export default function Lock({ lockId, height, width, open }: LockProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(open);

    const handleImageClick = () => {
        if (isUnlocked) return;
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (password: string) => {
        console.log(`Password entered for lock ${lockId}: ${password}`);

        try {
            const response = await fetch('/api/unlock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lockId,
                    password,
                }),
            });

            const result = await response.json();

            if (result.success) {
                console.log(`Lock ${lockId} unlocked!`);
                setIsUnlocked(true); // Unlock the lock
            } else {
                throw new Error(result.message || 'Incorrect password, please try again.');
            }
        } catch (error) {
            console.error('Error submitting password:', error);
            throw error; // Propagate the error to be caught in the PasswordModal
        }
    };

    return (
        <>
            <Image
                src={`/images/locks/lock-${lockId}.png`}
                alt={`Lock ${lockId}`}
                height={height}
                width={width}
                className={`h-full w-auto mx-auto cursor-pointer hover:scale-105 transition-all float-${lockId} ${isUnlocked ? 'opacity-30' : ''}`}
                onClick={handleImageClick}
            />
            <PasswordModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />
        </>
    );
}