import authenticationService from "@/services/authentication-service";
import { init } from "@/app";
import { cleanDb } from "../helpers";
import { prisma } from "@/config";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("GitHub authentication verification on database", () => {
  it("should respond with user data and create a token", async () => {
    const userData = await authenticationService.checkUserExists("github_user");

    const foundUserData = await prisma.user.findFirst({
      where: {
        email: "github_user@github.com"
      }
    });

    const token = await prisma.session.findFirst({
      where: {
        userId: foundUserData.id,
      }
    });

    expect(userData).toEqual({
      user: {
        id: foundUserData.id,
        email: foundUserData.email,
        createdAt: foundUserData.createdAt.toISOString(),
        updatedAt: foundUserData.updatedAt.toISOString(),
      },
      token: token.token,
    });
  });

  it("should respond with user data with last token generated", async () => {
    let userData = await authenticationService.checkUserExists("github_user");
    userData = await authenticationService.checkUserExists("github_user");
    
    const foundUserData = await prisma.user.findFirst({
      where: {
        email: "github_user@github.com"
      }
    });

    const token = await prisma.session.findMany({
      where: {
        userId: foundUserData.id,
      }
    });

    expect(userData).toEqual({
      user: {
        id: foundUserData.id,
        email: foundUserData.email,
        createdAt: foundUserData.createdAt.toISOString(),
        updatedAt: foundUserData.updatedAt.toISOString(),
      },
      token: token[token.length - 1].token,
    });
  });
});
