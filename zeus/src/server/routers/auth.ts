import { COOKIE } from "@/library/constants";
import { mailer } from "@/library/mailer";
import prisma from "@/library/prisma";
import redis from "@/library/redis";
import { emailSchema, passwordSchema } from "@/library/schema";
import bcrypt from "bcrypt";
import { deleteCookie, setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { z } from "zod";
import { privateProcedure, procedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const { email, password } = opts.input;

        if (!emailSchema.safeParse(email).success) {
          return {
            status: 403,
            message: "USER_REGISTER",
            description: "email is invalid!",
            data: null,
          };
        }

        if (!passwordSchema.safeParse(password).success) {
          return {
            status: 403,
            message: "USER_REGISTER",
            description: "password length must be greater or equal to 8!",
            data: null,
          };
        }

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          return {
            status: 409,
            message: "USER_REGISTER",
            description: "user already exists!",
            data: null,
          };
        }

        const name = email.split("@")[0] + nanoid(5);

        user = await prisma.user.create({
          data: {
            name,
            email,
            password: await bcrypt.hash(password, 10),
            username: `${name[0].toUpperCase()}${name.slice(1)}`,
          },
          include: {
            avatar: true,
          },
        });

        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "7d",
          }
        );
        setCookie(COOKIE, token, {
          maxAge: 60 * 60 * 24 * 7,
          req: opts.ctx.req,
          res: opts.ctx.res,
        });

        return {
          status: 200,
          message: "USER_REGISTER",
          description: "user registered successfully!",
          data: user,
        };
      } catch {
        return {
          status: 500,
          message: "USER_REGISTER",
          description: "something wrong has happened, please try again!",
          data: null,
        };
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        emailOrName: z.string(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const { emailOrName, password } = opts.input;

        let user: any = await prisma.user.findUnique({
          where: {
            [emailOrName.includes("@") ? "email" : "name"]: emailOrName,
          } as any,
          include: {
            avatar: true,
          },
        });

        if (!user) {
          return {
            status: 404,
            message: "USER_LOGIN",
            description: "user not found!",
            data: null,
          };
        }

        if (!(await bcrypt.compare(password, user.password))) {
          return {
            status: 401,
            message: "USER_LOGIN",
            description: "wrong credentials!",
            data: null,
          };
        }

        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "7d",
          }
        );
        setCookie(COOKIE, token, {
          maxAge: 60 * 60 * 24 * 7,
          req: opts.ctx.req,
          res: opts.ctx.res,
        });

        return {
          status: 200,
          message: "USER_LOGIN",
          description: "user logged in successfully.",
          data: user,
        };
      } catch {
        return {
          status: 500,
          message: "USER_LOGIN",
          description: "something wrong has happened, please try again!",
          data: null,
        };
      }
    }),

  logout: privateProcedure.mutation((opts) => {
    try {
      deleteCookie(COOKIE, { req: opts.ctx.req, res: opts.ctx.res });

      return {
        status: 200,
        message: "USER_LOGOUT",
        description: "user logged out successfully!",
        data: null,
      };
    } catch {
      return {
        status: 500,
        message: "USER_LOGOUT",
        description: "something wrong has happened, please try again!",
        data: null,
      };
    }
  }),

  forgot: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: opts.input.email },
        });

        if (!user) {
          return {
            status: 404,
            message: "USER_FORGOT",
            description: "user not found!",
            data: null,
          };
        }

        const rid = nanoid(10);
        const url = `${process.env.NEXT_PUBLIC_ZEUS}/auth/reset-password/${rid}`;

        mailer.sendMail({
          from: process.env.MAILER_USER,
          to: opts.input.email,
          subject: "Reset Password",
          html: `
          <div>
            <h4>Hi ${user.username},</h4>
            <p>You have requested to reset your password. Click on ${url}, to reset your password.</p> 
            <p>Thanks</p>
          </div>
        `,
        });

        await redis.set(`forgot-${rid}`, user.id);

        return {
          status: 200,
          message: "USER_FORGOT",
          description: "email has been sent successfully!",
          data: null,
        };
      } catch {
        return {
          status: 500,
          message: "USER_FORGOT",
          description: "something wrong has happened, please try again!",
          data: null,
        };
      }
    }),

  reset: procedure
    .input(
      z.object({
        rid: z.string(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        if (!passwordSchema.safeParse(opts.input.password).success) {
          return {
            status: 403,
            message: "USER_RESET",
            description: "password length must be greater or equal to 8!",
            data: null,
          };
        }

        let uid: number = 0;

        if (opts.input.rid.split("-user").length === 2) {
          uid = parseInt(opts.input.rid.split("-user")[0]);
        } else {
          uid = parseInt((await redis.get(`forgot-${opts.input.rid}`)) || "0");
        }

        if (!uid) {
          return {
            status: 404,
            message: "USER_RESET",
            description:
              "Go to http://localhost:3000/forgot-password, to get an email and follow the instructions to reset your password.",
            data: null,
          };
        }

        await prisma.user.update({
          where: { id: uid },
          data: {
            password: await bcrypt.hash(opts.input.password, 10),
          },
        });

        await redis.del(`forgot-${opts.input.rid}`);

        return {
          status: 200,
          message: "USER_RESET",
          description: "password has been reset successfully!",
          data: null,
        };
      } catch {
        return {
          status: 500,
          message: "USER_RESET",
          description: "something wrong has happened, please try again!",
          data: null,
        };
      }
    }),
});
