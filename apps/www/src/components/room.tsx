"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

export default function ComicReaderPage({ nfts }: { nfts: any[] }) {
    const [volume, setVolume] = useState(false);
    const [clicked, setClicked] = useState(false);
    const musicRef = useRef<HTMLAudioElement>(null);

    const blurStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        boxShadow: 'inset 0 0 50px 25px black',
        pointerEvents: 'none',
    };

    useEffect(() => {
        if (musicRef.current) {
            if (volume) {
                musicRef.current.play();
                musicRef.current.volume = 0.3;
            } else {
                musicRef.current.pause();
                musicRef.current.volume = 0;
            }
        }
    }, [volume]);

    const play = () => {
        if (!clicked) {
            setClicked(true);
            setVolume(true);
        }
    };

    return (
        <div className={`bg-black relative overflow-hidden w-screen h-screen ${clicked ? 'touch-none' : ''}`} onMouseUp={play} onTouchEnd={play}>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
            <audio src="/gal_lev-empty_rooms.webm" className="hidden" id="music" ref={musicRef} loop />

            {/* Inject NFTs as JSON in a script tag */}
            <script
                dangerouslySetInnerHTML={{
                    __html: 'window.nfts =' + JSON.stringify(nfts),
                }}
            />
            <canvas id="c" className="relative z-0"></canvas>
            <video id="loadingVideo" className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-56 transition-all" autoPlay loop muted>
                <source src="/videos/spiral.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div onClick={() => setVolume(!volume)} className="h-8 w-8 cursor-pointer absolute z-10 right-10 bottom-10">
                {volume ? (
                    <svg className="stroke-white" width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0004 9.00009C16.6281 9.83575 17 10.8745 17 12.0001C17 13.1257 16.6281 14.1644 16.0004 15.0001M18 5.29177C19.8412 6.93973 21 9.33459 21 12.0001C21 14.6656 19.8412 17.0604 18 18.7084M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg className="stroke-white" width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 9.50009L21 14.5001M21 9.50009L16 14.5001M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <script type="module" src="js/roomRefactored.js"></script>
            <img src="/images/noise_light.webp" className="absolute min-w-[100vw] top-0 left-0 z-20 min-h-[100vh] opacity-60 pointer-events-none" />
            <div style={blurStyle}></div>
        </div>
    );
}