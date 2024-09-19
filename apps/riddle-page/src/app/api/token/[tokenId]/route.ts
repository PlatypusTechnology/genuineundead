import { client } from "@genuineundead/core/sanity/lib/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic"
export async function GET(req : NextRequest, {params: {tokenId}} : {params: {tokenId: string}}) {
    const data = await client.fetch("*[_type == 'token' && tokenId.current == '"+ (Number(tokenId) > 1000 ?  parseInt(tokenId, 16) : Number(tokenId))+ "' ][0] { name, description, attributes[]{value, display_type, trait_type} }") ;

    if(!data) return Response.error()
    return NextResponse.json(data);


}