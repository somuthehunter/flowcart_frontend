import { UnionExp } from "@/lib/bool-utils";

import { UserRoles } from "./types";
import { UserScopes } from "./user-scopes";

export type RouteGuard =
    | {
          allowedRoles: UserRoles[];
          allowedScopes?: UnionExp<UserScopes> | UserScopes[];
      }
    | {
          exceptRoles: UserRoles[];
          allowedScopes?: UnionExp<UserScopes> | UserScopes[];
      }
    | { allowedScopes?: UnionExp<UserScopes> | UserScopes[] };
