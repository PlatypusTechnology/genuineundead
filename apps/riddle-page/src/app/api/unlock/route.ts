/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { serverSide, Session } from '@genuineundead/core';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Initialize the rate limiter using Vercel KV
const ratelimit = new Ratelimit({
  redis: kv,
  // 10 requests per 10 minutes per user
  limiter: Ratelimit.slidingWindow(10, '10 m'),
});

export async function POST(request: NextRequest) {
    const crypts: Record<number, string> = {
        1: '1987892',
        2: '5678903',
        3: '1234567',
        4: '097654321'
    };

    const body = await request.json();
    const { lockId, password } = body;

    const s = await Session.fromRequest(request);
    if (!s || !s.address) return NextResponse.json({ error: 'Unauthorized User' }, { status: 401 });

    // Apply rate limiting based on the user session
    const rateLimitKey = `rate-limit:${s.address}`;
    const { success } = await ratelimit.limit(rateLimitKey);

    if (!success) {
        return NextResponse.json({ success: false, message: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    let user = await serverSide.server().fetch(`*[_type == 'user' && address == '${s.address}'][0]`);
    if (!user) {
        user = await serverSide.server().create({
            '_type': 'user', 'address': s.address });
    }

    let { metadata } = user;

    // Check if user has lockData and if they already unlocked this lock
    if (metadata?.lockData?.["lock"+lockId]) {
        return NextResponse.json({ success: false, message: `Lock ${lockId} already unlocked at ${metadata.lockData[lockId].unlockedAt}` }, { status: 400 });
    }

    if (!crypts[lockId]) {
        return NextResponse.json({ success: false, message: 'Invalid lockId' }, { status: 400 });
    }

    if (!metadata) metadata = {};
    if (password === crypts[lockId]) {

        if (!metadata.lockData) metadata.lockData = {};

        // Fetch all users who have unlocked this lock to determine points
        const usersWithLock = await serverSide.server().fetch(`*[_type == 'user' && metadata.lockData.lock${lockId} != null] | order(metadata.lockData.lock${lockId}.unlockedAt asc)`);
        const unlockOrder = usersWithLock.length + 1;

        // Calculate points based on the order of unlocking
        let points = Math.max(100 - (unlockOrder - 1) * 10, 10);

        const unlockTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
        metadata.lockData['lock'+lockId] = { unlockedAt: unlockTime, transactionId: randomUUID(), points };
        if(!metadata.points) metadata.points = 0;
        metadata.points += points;

        // Save the updated user data to the database
        await serverSide.server().patch(user._id, {
            set: {
                metadata
            }
        }).commit();

        return NextResponse.json({ success: true, message: 'Password is correct', points }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 });
    }
}