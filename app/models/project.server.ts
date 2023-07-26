import type { Desire, Project, User } from "@prisma/client";
import { prisma } from "~/db.server";

type CreateProject = {
  title: Project["title"];
  description: Project["description"];
  userId: User["id"];
  sortOrder: Project["sortOrder"];
  desireId: Desire["id"];
};

export const getProjects = async (userId: User["id"]) => {
  const result = await prisma.project.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });

  return result;
};

export const getProjectById = async (id: Project["id"], userId: User["id"]) => {
  const result = await prisma.project.findFirst({
    where: { id, userId },
  });
  return result;
};

export const createProject = async (project: CreateProject) => {
  const result = await prisma.project.create({
    data: {
      title: project.title,
      description: project.description,
      sortOrder: project.sortOrder,
      userId: project.userId,
      desireId: project.desireId,
    },
  });
  return result;
};

export const updateProjectsOrder = async (projects: Project[]) => {
  const updateSortOrder = projects.map((project) => {
    return prisma.project.update({
      where: { id: project.id },
      data: {
        sortOrder: project.sortOrder,
      },
    });
  });

  await Promise.all(updateSortOrder);
  return { updateSortOrder };
};

export const updateProjectDetails = async (project: Project) => {
  const result = await prisma.project.update({
    where: { id: project.id },
    data: {
      title: project.title,
      description: project.description,
      sortOrder: project.sortOrder,
      userId: project.userId,
      desireId: project.desireId,
    },
  });

  return result;
};
