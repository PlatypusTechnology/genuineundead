import type { SanityAsset } from "@sanity/image-url/lib/types/types";
import type { Slug } from "sanity";

declare interface Attribute {
    trait_type: string;
    value: string;
    display_type: "boost_number" | "boost_percentage" | "string" | "number" | "date";
}

declare interface Token {
    name: string;
    tokenId: number;
    tokenImage: SanityAsset;
    attributes: Attribute[];
    description: string;
}

declare type Page = SanityAsset & {
    gated: boolean;
    tokens?: Token[];
}

declare interface Comic {
    name: string;
    slug: Slug
    description: string;
    releaseDate: string; // Assuming releaseDate is stored as a string
    pages: Page[];
}

declare interface User {
    address: string; // Wallet Address, read-only
    firstLogin: string; // First Login Date, read-only, assumed to be in string format
    lastLogin: string; // Last Login Date, read-only, assumed to be in string format
    username: string; // Username
    discordId: string; // Discord ID
    twitterId: string; // Twitter Handle
    email: string; // Email
}

declare interface Score {
    user: User;
    score: number;
}


