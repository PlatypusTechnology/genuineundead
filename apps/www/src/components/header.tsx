

import { appConfig, cn } from "@genuineundead/core";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@genuineundead/ui";
import { Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { HeaderMenu } from "./header-menu";
import { HeaderMenuMobile } from "./header-menu-mobile";
import { Icons } from "./icons";
import ScrollAnimate from "./scroll-animate";

const HeaderLogo = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, ...props }, _) => {
  return (
    <Link href="/" className={cn("flex items-center", className)} {...props}>
      <Icons.icon className="mr-2 h-8 w-8" />
      <span className="font-mono text-sm font-extrabold uppercase">
        {appConfig.name}
      </span>
    </Link>
  );
});
HeaderLogo.displayName = "HeaderLogo";

function HeaderMobile() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-mx-4">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full p-4 sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            <span className="sr-only">Menu</span>
          </SheetTitle>
        </SheetHeader>

        <HeaderLogo className="absolute top-2" />
        {/*
        <AccountMenu />
         */}
        <div className="relative mt-8">
          <HeaderMenuMobile />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {


  return (
    <header className="supports-backdrop-blur:bg-background/60 absolute z-50 mt-10 w-full px-4">
      <ScrollAnimate opacity slideDown timing={{ delay: 200, duration: 600 }} threshold={0.5}>


        <div className="flex h-16 container items-center justify-between rounded-full border px-4 pr-8">
          <div className="flex items-center">
            <HeaderLogo className="mr-4 " />

            <div className="hidden lg:flex">
              <HeaderMenu />
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            {/*
            <AccountMenu />

            */}
            <div className="flex lg:hidden">
              <HeaderMobile />
            </div>
          </div>
        </div>
      </ScrollAnimate>
    </header>
  );
}