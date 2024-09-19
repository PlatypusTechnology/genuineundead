"use client";

import { cn } from "@genuineundead/core";
import { Button } from "@genuineundead/ui/components/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genuineundead/ui/components/form";
import { Input } from "@genuineundead/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateUser } from "~/actions/profile";

const profileFormSchema = z.object({
  username: z
    .string()
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
    .optional(),
  discordId: z
    .string()
    .max(32, {
      message: "Username must not be longer than 30 characters.",
    })
    .optional(),
  twitterId: z
    .string()

    .max(15, {
      message: "Twitter handle cannot be longer than 30 characters.",
    }).optional(),

  email: z
    .string({
      required_error: "Please enter your email.",
    })
    .email()
    .optional(),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {};

export interface ProfileFormProps {
  className?: string;
  address: string;
  user: any; // TODO: typesafe
}

export function ProfileForm({ className, address, user }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const updateUserWithId = updateUser.bind(null, address);

async function updateForm(formData: ProfileFormValues) {
  setLoading(true);
  await updateUserWithId(formData);
  setLoading(false)
}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(valid => updateForm(valid))}
        className={cn("space-y-8", className)}
      >
        <FormField
          control={form.control}
          name="username"
          defaultValue={user.username}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          defaultValue={user.email}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>

              <FormDescription>
                This is your private email. It will never be displayed publicly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discordId"
          defaultValue={user.discordId}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discord</FormLabel>
              <FormControl>
                <Input placeholder="Discord" {...field} />
              </FormControl>

              <FormDescription>Your Discord username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="twitterId"
          defaultValue={user.twitterId}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter</FormLabel>
              <FormControl>
                <Input placeholder="Twitter" {...field} />
              </FormControl>

              <FormDescription>Your Twitter username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} type="submit">{loading ? 'Updating' : 'Update profile'}</Button>
      </form>
    </Form>
  );
}