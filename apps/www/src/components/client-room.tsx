"use client";

export default function ClientRoom() {
    return (
        <div className="relative">
            <div className="absolute top-0 inset-0 bg-gradient-to-b from-background to-transparent h-[50px] z-10"></div>
            <iframe src="/room" className="w-full aspect-video relative" />
            <div className="absolute top-[100%] translate-y-[-100%] inset-0 bg-gradient-to-t from-background to-transparent h-[50px] z-10"></div>
        </div>
    );
}