/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client";

import Script from "next/script";
import { Icons } from "~/components/icons";



export default function ComicReaderPage({ params }: { params: { slug: string } }) {

    const loadWebGL = async () => {
        const data = await fetch('/api/comic/' + params.slug);
        const json: { name: string, slug: string, pages: { page: number, gated?: boolean }[] } = await data.json();
        const pages = json.pages.map(p => '/api/comic/' + params.slug + '/page/' + p.page);
        setTimeout(() => {

            if (typeof window === 'object') {
                // @ts-ignore
                window.initWebGL(pages, "webGL", -200);
            }
        }, 1000)
    }

    return (
        <>

            <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js" />

            <Script type="text/javascript" src='/js/Three_old.js' />
            <Script type="text/javascript" src='/js/Stats.min.js' />
            <Script type="text/javascript" src='/js/MOD3.js' />
            <Script type="text/javascript" src='/js/Detector.js' />
            <Script type="text/javascript" src="/js/RequestAnimationFrame.js" />
            <Script type="text/javascript" src='/js/BookReader3D.js' onLoad={loadWebGL} />

            <div id="webGL" className="h-[100vh] w-[100vw]" />
            <div className="absolute left-[50%] translate-x-[-50%] text-black bg-[rgba(255,255,255,0.5)] rounded-lg p-6 flex gap-3 bottom-14 font-mono transition-opacity opacity-0 backdrop-blur-sm" id="infos" >
                <span id="pageLeft" className="cursor-pointer">-</span>
                <span id="pageCount"></span>
                <span id="pageRight" className="cursor-pointer">+</span>
            </div>
            <div className="absolute w-screen h-screen top-0 left-0 bg-black transition-opacity duration-500 " id="loader" >
                <div className="absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] w-[300px] " >
                    <Icons.icon className="pulsate" />
                </div>
            </div>

        </>
    )
}