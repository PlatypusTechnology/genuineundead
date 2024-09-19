
import { Session, serverSide } from '@genuineundead/core';
import { cookies } from 'next/headers';
import Locks from '~/components/Locks';
export default async function HomePage() {


  const s = await Session.fromCookie(cookies());

  const user = await serverSide.server().fetch(`*[_type == 'user' && address == '${s.address}'][0]`)
  const { metadata } = user ?? {};

  // User metadata contains all sorts of info, we'll pick the lockInfo object that contains the information
  // About the locks usage, the time it was unlocked and the transactionId that gave the points.

  let lockData = {};
  if (metadata?.lockData) {
    lockData = metadata.lockData;
  }

  return <Locks lockData={lockData} />
}
