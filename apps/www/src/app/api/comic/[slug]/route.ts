/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { server } from "~/sanity/lib/server";

export const dynamic = "force-dynamic"
export async function GET(req : NextRequest, {params :{slug}} : {params: {slug: string}}) {
    const data = await server().fetch("*[_type == 'comic' && slug.current == '"+ slug+ "' ][0]{ name, slug, pages }") ;

    if(!data) return Response.error()

    const comicData = {
        name: data.name,
        slug: data.slug.current,
        pages: data.pages.map((p : any, idx : number) => ({
            page: idx + 1,
            gated: p.gated 
        }))
    }

    return NextResponse.json(comicData)
}