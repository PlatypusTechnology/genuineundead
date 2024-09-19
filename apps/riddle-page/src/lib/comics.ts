export const comics = [
  {
    id: "1",
    slug: "mordor-s-grudge",
    coverImage: "/images/comics/1.jpeg",
    title: "Desert Warrior",
    collection: "The Night Shift",
    description:
      "A journey of a lone warrior in the middle of the desert fighting for survival.",
    releaseDate: "2023-08-01",
  },
  {
    id: "2",
    slug: "mordor-s-grudge",
    coverImage: "/images/comics/1.jpeg",
    title: "City Noir",
    collection: "The Night Shift",
    description:
      "A thrilling saga of a detective solving crimes in the dark alleys of the city noir.",
    releaseDate: "2023-08-02",
  },
  {
    id: "3",
    slug: "mordor-s-grudge",
    coverImage: "/images/comics/1.jpeg",
    title: "Celestial Battle",
    collection: "The Night Shift",
    description:
      "An epic battle between celestial beings orchestrating the fate of the universe.",
    releaseDate: "2023-08-03",
  },
  {
    id: "4",
    slug: "mordor-s-grudge",
    coverImage: "/images/comics/1.jpeg",
    title: "Cybernetic Chaos",
    collection: "The Night Shift",
    description:
      "A peek into the future where man and machine become indistinguishable and struggle for dominance ensues.",
    releaseDate: "2023-08-04",
  },
  {
    id: "5",
    slug: "mordor-s-grudge",
    coverImage: "/images/comics/1.jpeg",
    title: "Primal Instincts",
    collection: "The Night Shift",
    description:
      "A thrilling tale of survival, where mankind must rely on primal instincts to survive in the wild.",
    releaseDate: "2023-08-05",
  },
  {
    id: "6",
    slug: "mordor-s-grudge",
    coverImage: "/images/comics/1.jpeg",
    title: "The Night Shift",
    collection: "The Night Shift",
    description:
      "Morbi in sem quis dui placerat ornare. Pellentesque odio nisi euismod in pharetra a ultricies in diam. Sed arcu. Cras consequat.",
    releaseDate: null,
  },
  {
    id: "7",
    slug: "mordor-s-grudge",
    coverImage: "/images/comics/1.jpeg",
    title: "The Night Shift",
    collection: "The Night Shift",
    description:
      "Morbi in sem quis dui placerat ornare. Pellentesque odio nisi euismod in pharetra a ultricies in diam. Sed arcu. Cras consequat.",
    releaseDate: null,
  },
] as const;
export type Comic = (typeof comics)[number];

export const getComics = ({
  amount = 10,
  released = true,
}: {
  amount?: number;
  released?: boolean;
}) => {
  const releasedComics = comics
    .filter((comic) => {
      if (released) {
        return comic.releaseDate;
      }
      return true;
    })
    .slice(0, amount);

  // Sort by release date
  releasedComics.sort((a, b) => {
    if (a.releaseDate && b.releaseDate) {
      return (
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );
    }
    return 0;
  });

  return releasedComics;
};
