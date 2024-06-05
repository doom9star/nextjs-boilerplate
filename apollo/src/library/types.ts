import { Socket } from "socket.io";

export type AuthPayload = { id: string };
export type AuthIORequest = Socket & { handshake: { user?: AuthPayload } };
