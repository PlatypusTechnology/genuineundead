'use server'

import type { ProfileFormValues } from "~/components/profile-form";
import { server } from "~/sanity/lib/server";

 
export async function updateUser(userId : string, formData : ProfileFormValues) {
    await server().patch(userId, {
        set: formData
    }).commit();
}