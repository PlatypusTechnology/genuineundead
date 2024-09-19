import { alchemyClient, networkFromId, Session, tap } from "@genuineundead/core";
import { ethers } from "ethers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateNonce, SiweErrorType, SiweMessage } from "siwe";
import { server } from "~/sanity/lib/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const session = await Session.fromRequest(req);

  return NextResponse.json(session.toJSON());
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const session = await Session.fromRequest(req);
  if (!session?.nonce) session.nonce = generateNonce();

  return tap(new NextResponse(session.nonce), (res) => session.persist(res));
};

export const POST = async (req: NextRequest) => {
  const { message, signature } = await req.json();
  const session = await Session.fromRequest(req);

  try {
    const siweMessage = new SiweMessage(message);
    const { data: fields } = await siweMessage.verify({
      signature,
      nonce: session.nonce,
    });

    if (fields.nonce !== session.nonce) {
      return tap(new NextResponse("Invalid nonce.", { status: 422 }), (res) =>
        session.clear(res),
      );
    }
    const network = networkFromId(fields.chainId);

    if (!network) {
      return tap(new NextResponse("Invalid network.", { status: 422 }), (res) =>
        session.clear(res),
      );
    }

    const provider = new ethers.AlchemyProvider(
      fields.chainId,
      alchemyClient.forNetwork(network).config.apiKey,
    );
    const ensName =
      fields.chainId !== 1
        ? undefined
        : await provider.lookupAddress(fields.address);
    const date = new Date().toISOString();

    const created = await server().createIfNotExists({
      _id: fields.address,
      _type: "user",
      firstLogin: date,
      lastLogin: date,
      username: ensName,
      address: fields.address,
    });
    await server().createIfNotExists({
      _id: fields.address + "_score",
      _type: "score",
      score: 0,
      user: {
        _type: "reference",
        _ref: fields.address,
      },
    });
    if (created.firstLogin !== date) {
      // Not the first connection => update last login
      await server()
        .patch(fields.address, {
          set: {
            lastLogin: date,
            username: ensName,
          },
        })
        .commit();
    }

    session.address = fields.address;
    session.chainId = fields.chainId;
  } catch (error) {
    console.error(error);
    switch (error) {
      case SiweErrorType.INVALID_NONCE:
      case SiweErrorType.INVALID_SIGNATURE:
        return tap(new NextResponse(String(error), { status: 422 }), (res) =>
          session.clear(res),
        );

      default:
        return tap(new NextResponse(String(error), { status: 400 }), (res) =>
          session.clear(res),
        );
    }
  }

  return tap(new NextResponse(""), (res) => session.persist(res));
};

export const DELETE = async (req: NextRequest) => {
  const session = await Session.fromRequest(req);

  return tap(new NextResponse(""), (res) => session.clear(res));
};
