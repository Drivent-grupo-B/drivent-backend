import { prisma } from "@/config";
import { Address, Enrollment } from "@prisma/client";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
      User: true
    }
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
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
    }
  });
  if (!enrollment) {
    const enrollmentCreated = await prisma.enrollment.create({     
      data: createdEnrollment,
    });  
    await prisma.address.create({      
      data: {
        ...address,
        Enrollment: { connect: { id: enrollmentCreated.id } },
      }   
    });
    return;
  }
  const enrollmentUpdate = prisma.enrollment.update({
    where: {
      userId,
    },    
    data: updatedEnrollment,
  });  
  const adressUpdate = prisma.address.update({
    where: {
      enrollmentId: enrollment.id,
    },    
    data: address,
  });
  return prisma.$transaction([enrollmentUpdate, adressUpdate]);
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
