import type * as Prisma from "@/app/generated/prisma/client";
declare global {
  export interface User extends Prisma.User {}
  export interface OnCall extends Prisma.OnCall {
    createdBy: {
    name: string;
    email: string;
    };
  }
}
