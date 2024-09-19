"use client";

import { poweredBy } from "@genuineundead/core";
import { Web3Provider } from "@genuineundead/ui";
import * as React from "react";


export function Providers(props: {
  children: React.ReactNode;
  headers?: Headers;
}) {
  // console log only once
  React.useEffect(() => {
    poweredBy();
  }, []);

  return  <Web3Provider>
            {props.children}
          </Web3Provider>
}