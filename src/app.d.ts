// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface Window {
    __ENV__?: {
      API_BASE?: string;
    };
  }
}

declare module "flowbite-svelte" {
  export * from "flowbite-svelte/dist/index";
}

export type Companion = {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  companion_name: string;
  gender: string;
  age: number;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
};

export type DevoteeeProfile = {
  devoteee_name: string;
  email: string;
  gender: string;
  dob: string;
  aadhar: string;
  location: string;
  companion: Companion[];
  phone: string;
};

export type Protocol = {
  name: string;
  protocol_name: string;
  description: string;
  protocol_level: number;

  //client
  fee: number;
};

export {};
