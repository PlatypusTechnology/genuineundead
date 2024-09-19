import type { Comic } from "types";
import { server } from "~/sanity/lib/server";



export const getComics = async ({
  amount = 10,
  released = true
}: {
  amount?: number;
  released?: boolean;
} = {}) => {
  if (amount < 1) amount = 1;
  return await server().fetch<Comic[]>(`*[_type == 'comic' ${released ? (` && releaseDate < now()`) : ''}] | order(releaseDate desc)[0..${amount - 1}]`);;
};
