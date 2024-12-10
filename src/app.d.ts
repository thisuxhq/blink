// See https://svelte.dev/docs/kit/types#app

import type { TypedPocketBase } from "$lib/types";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      pb: TypedPocketBase
      user: import("pocketbase").default["authStore"]["model"];
      cmsPb: TypedPocketBase;
      cmsUser: import("pocketbase").default["authStore"]["model"];
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
