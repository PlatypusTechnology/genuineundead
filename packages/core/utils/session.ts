import { sealData, unsealData } from "iron-session";
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { NextRequest, NextResponse } from "next/server";
import { appConfig } from "../config/app-config";


const SESSION_OPTIONS = {
  ttl: 60 * 60 * 24 * 30, // 30 days
  password: "3HIqvSRJvgY+1uUsclxd9ZCb9Wh52bJlFrDd+KEpQ1I=",
};

export interface ISession {
  nonce?: string;
  chainId?: number;
  address?: string;
}

class Session {
  nonce?: string;
  chainId?: number;
  address?: string;

  constructor(session?: ISession) {
    this.nonce = session?.nonce;
    this.chainId = session?.chainId;
    this.address = session?.address;
  }

  static async fromCookie(cookies: ReadonlyRequestCookies): Promise<Session> {

    const sessionCookie = cookies.get( appConfig.sessionCookie)?.value;

    if (!sessionCookie) return new Session();
    return new Session(
      await unsealData<ISession>(sessionCookie, SESSION_OPTIONS)
    );
  }
  
  static async fromRequest(req: NextRequest): Promise<Session> {
    const sessionCookie = req.cookies.get(appConfig.sessionCookie)?.value;

    if (!sessionCookie) return new Session();
    return new Session(
      await unsealData<ISession>(sessionCookie, SESSION_OPTIONS),
    );
  }

  clear(res: NextResponse): Promise<void> {
    this.nonce = undefined;
    this.chainId = undefined;
    this.address = undefined;

    return this.persist(res);
  }

  toJSON(): ISession {
    return { nonce: this.nonce, address: this.address, chainId: this.chainId };
  }

  async persist(res: NextResponse): Promise<void> {
    res.cookies.set(
      appConfig.sessionCookie,
      await sealData(this.toJSON(), SESSION_OPTIONS),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    );
  }
}

export default Session;