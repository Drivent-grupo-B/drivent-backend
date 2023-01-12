import { prisma } from "@/config";
import { Address, Enrollment } from "@prisma/client";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findById(enrollmentId: number) {
  return prisma.enrollment.findFirst({
    where: { id: enrollmentId }
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
  address: CreateAddressParams
) {
  const enrollmentUpsert = prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
  const enrollmentId = await enrollmentUpsert.then((enrollment) => enrollment.id);
  const adressUpsert = prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...address,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: address,
  });
  return prisma.$transaction([enrollmentUpsert, adressUpsert]);
}
  
export type CreateAddressParams = Omit<Address, "id" | "createdAt" | "updatedAt" | "enrollmentId">;
export type UpdateAddressParams = CreateAddressParams;
export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  findById,
};

export default enrollmentRepository;
