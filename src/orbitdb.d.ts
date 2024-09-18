declare module "@orbitdb/core" {
  import { IPFS } from "ipfs";
  import { Database } from "orbit-db";

  export function createOrbitDB(options: { ipfs: IPFS }): Promise<OrbitDB>;

  export interface OrbitDB {
    open(address: string): Promise<Database>;
    keyvalue(name: string): Promise<Database>;
    stop(): Promise<void>;
  }

  export interface Database {
    address: {
      toString(): string;
    };
    put(key: string, value: any): Promise<void>;
    get(key: string): any;
    add(value: any): Promise<void>;
    all(): Promise<any[]>;
    close(): Promise<void>;
  }
}
