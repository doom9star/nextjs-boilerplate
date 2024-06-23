import cloudinary from "@/library/cloudinary";
import prisma from "@/library/prisma";
import { privateProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const userRouter = router({
  auth: privateProcedure.query(async (opts) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: opts.ctx.uid },
        include: {
          avatar: true,
        },
      });

      if (!user) {
        return {
          status: 404,
          message: "USER_AUTH",
          description: "user does not exist!",
          data: null,
        };
      }

      return {
        status: 200,
        message: "USER_AUTH",
        description: "user is authenticated!",
        data: user,
      };
    } catch {
      return {
        status: 500,
        message: "USER_AUTH",
        description: "something wrong has happened, please try again!",
        data: null,
      };
    }
  }),

  update: privateProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      try {
        if (
          await prisma.user.findFirst({
            where: { name: opts.input.name, id: { not: opts.ctx.uid } },
          })
        ) {
          return {
            status: 403,
            message: "USER_UPDATE",
            description: "name already exists!",
            data: null,
          };
        }

        const { avatar, ...others } = opts.input;

        let user = await prisma.user.findUnique({
          where: { id: opts.ctx.uid },
          include: {
            avatar: true,
          },
        });

        if (avatar) {
          if (avatar.startsWith("data:")) {
            if (user?.avatar) {
              await cloudinary.uploader.destroy(user.avatar.cid);
              await prisma.file.delete({ where: { id: user.avatar.id } });
            }

            const result = await cloudinary.uploader.upload(avatar);
            await prisma.file.create({
              data: {
                url: result.secure_url,
                cid: result.public_id,
                userId: opts.ctx.uid,
              },
            });
          }
        } else if (user?.avatar) {
          await cloudinary.uploader.destroy(user.avatar.cid);
          await prisma.file.delete({ where: { id: user.avatar.id } });
        }

        user = await prisma.user.update({
          where: { id: opts.ctx.uid },
          data: others,
          include: {
            avatar: true,
          },
        });

        return {
          status: 200,
          message: "USER_UPDATE",
          description: "user updated successfully!",
          data: user,
        };
      } catch {
        return {
          status: 500,
          message: "USER_UPDATE",
          description: "something wrong has happened, please try again!",
          data: null,
        };
      }
    }),

  detail: privateProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async (opts) => {
      try {
        const user = await prisma.user.findUnique({
          where: { name: opts.input.name },
          include: {
            avatar: true,
          },
        });

        if (!user) {
          return {
            status: 404,
            message: "USER_DETAIL",
            description: "user not found!",
            data: null,
          };
        }

        return {
          status: 200,
          message: "USER_DETAIL",
          description: "user retrieved successfully!",
          data: user,
        };
      } catch {
        return {
          status: 500,
          message: "USER_DETAIL",
          description: "something wrong has happened, please try again!",
          data: null,
        };
      }
    }),
});
