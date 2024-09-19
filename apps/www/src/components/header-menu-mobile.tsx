"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@genuineundead/ui/components/navigation-menu";

export function HeaderMenuMobile() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col items-start">
        <NavigationMenuItem>
          <Link href="/story" legacyBehavior passHref>
            <NavigationMenuLink className="p-0">Story</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
