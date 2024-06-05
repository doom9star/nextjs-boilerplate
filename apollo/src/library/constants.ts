import { Socket } from "socket.io";

export const QUEUE = "alpha";

export const sockets: Map<number, Socket> = new Map();
