
import { cn } from "@genuineundead/core";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@genuineundead/ui/components/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { getComics } from "~/lib/comics";

export async function HeaderMenu() {
  const comics = await getComics({
    amount: 12,
    released: false,
  });

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Comics
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[700px] lg:grid-cols-[.75fr_1fr]">
              {comics && comics.length > 0 && comics[0] && (
                <li className="row-span-4">
                  <NavigationMenuLink asChild>
                    <article className="relative isolate flex flex-col justify-end overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-80 sm:pt-44 lg:pt-80">
                      <Image
                        src={'/api/comic/' + comics[0].slug.current + '/page/1'}
                        width={856}
                        height={1200}
                        alt={comics[0].name + ' cover'}
                        className="absolute inset-0 -z-10 h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                      <div className="absolute inset-0 -z-10 rounded-lg ring-1 ring-inset ring-gray-900/10" />

                      <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                        <span className="mr-8">Latest release</span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                        <Link href={`/reader/${comics[0].slug.current}`}>
                          <span className="absolute inset-0" />
                          {comics[0].name}
                        </Link>
                      </h3>
                    </article>
                  </NavigationMenuLink>
                </li>
              )}

              <div>
                {comics.slice(1, 5).map((comic) => (
                  <ListItem
                    key={comic.slug.current}
                    href={`/reader/${comic.slug.current}`}
                    title={comic.name}
                    disabled={!comic.releaseDate}
                  >
                    {comic.description}
                  </ListItem>
                ))}

                <Link href="/reader/mordor-s-grudge" className="block">
                  <div className="group flex w-full items-center rounded-md border border-transparent px-3 py-1 text-sm font-bold text-muted-foreground underline underline-offset-4">
                    View all comics
                  </div>
                </Link>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { disabled?: boolean }
>(({ className, title, children, disabled, ...props }, ref) => {
  const Element = disabled ? "span" : "a";

  return (
    <li>
      <NavigationMenuLink asChild>
        <Element
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
            disabled && "pointer-events-none opacity-50",
          )}
          {...(disabled ? undefined : props)}
        >
          <div className="text-base font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Element>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";