import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { server } from "~/sanity/lib/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params: { tokenId } }: { params: { tokenId: string } }) {
    const numericTokenId = parseInt(tokenId, 16);
    const data = await server().fetch(
        `*[_type == 'token' && tokenId == ${numericTokenId}][0]{name, description, attributes[]{value, display_type, trait_type}, "image": tokenImage.asset->url}`
    );

    if (!data) return NextResponse.error();

    // Remove null or undefined keys from the data object
    const cleanData = JSON.parse(JSON.stringify(data, (key, value) => (value === null ? undefined : value)));

    return NextResponse.json(cleanData);
}