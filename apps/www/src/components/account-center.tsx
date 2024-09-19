import Link from "next/link";
import { AccountAvatar } from "./account-avatar";

export default function AccountCenter() {


  return <>
    <Link href="/account">
      <span className="sr-only">Account</span>
      <AccountAvatar
        sizeClassName="h-10 w-10"
        fallbackIconClassName="h-5 w-5"
      />
    </Link>
  </>
}