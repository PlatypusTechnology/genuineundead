import { Highlighter, HighlighterItem } from "@genuineundead/ui";
import { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode; // Allows passing any content to the modal
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
            setTimeout(() => {
                document.getElementById('modal-bg')?.classList.remove('opacity-0');
                document.getElementById('modal-bg')?.classList.add('opacity-100');
                document.getElementById('modal-content')?.classList.remove('opacity-0', 'translate-y-4');
                document.getElementById('modal-content')?.classList.add('opacity-100', 'translate-y-0');
            }, 10); // A short delay to trigger the transition
        } else {
            document.getElementById('modal-bg')?.classList.add('opacity-0');
            document.getElementById('modal-bg')?.classList.remove('opacity-100');
            document.getElementById('modal-content')?.classList.add('opacity-0', 'translate-y-4');
            document.getElementById('modal-content')?.classList.remove('opacity-100', 'translate-y-0');
            setTimeout(() => setShowModal(false), 300); // Duration should match the transition time
        }
    }, [isOpen]);

    if (!showModal) return null;

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            id="modal-bg"
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 opacity-0 transition-opacity duration-300"
            onClick={handleBackgroundClick} // Handle background click
        >
            <Highlighter>
                <div
                    id="modal-content"
                    className="relative z-20 h-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()} // Prevent propagation to the background
                >
                    <HighlighterItem>
                        <div className="rounded-[inherit] bg-slate-900 p-8">
                            {/* Radial gradient */}
                            <div
                                className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
                                aria-hidden="true"
                            >
                                <div className="translate-z-0 absolute inset-0 rounded-full bg-slate-800 blur-[80px]" />
                            </div>
                            {children}
                        </div>
                    </HighlighterItem>
                </div>
            </Highlighter>
        </div>
    );
}