import activitiesRepository from "@/repositories/activities-repository";

async function listDays() {
  return await activitiesRepository.findMany();
}

const activitiesService = {
  listDays
};

export default activitiesService;
