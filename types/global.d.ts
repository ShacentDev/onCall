import type * as Prisma from "@/app/generated/prisma/client";
declare global {
  export interface User extends Prisma.User {}
  export interface OnCall extends Prisma.OnCall {
    createdBy: {
    name: string;
    email: string;
    };
  }
  export interface PersonOnCall extends Prisma.PersonOnCall {
    person: {
      id: string;
      name: string;
      code: string;
      category: { id: string; name: string };
    };
  }
}
