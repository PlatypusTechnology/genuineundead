"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@genuineundead/ui/components/select";

interface SelectMintEditionProps {
  value: string;
  className?: string;
  editions: {
    slug: string;
    label: string;
  }[];
}

export function SelectMintEdition({
  value,
  className,
  editions,
}: SelectMintEditionProps) {
  const router = useRouter();

  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={(value) => {
          router.push(`/mint/${value}`);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Editions" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Editions</SelectLabel>

            {editions.map(({ slug, label }) => (
              <SelectItem key={slug} value={slug}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
