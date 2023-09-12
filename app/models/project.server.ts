import type { Desire, Project, User } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ProjectFromDB} from "~/types/projectTypes";

type CreateProject = {
  title: Project["title"];
  description: Project["description"];
  userId: User["id"];
  sortOrder: Project["sortOrder"];
  desireId: Desire["id"];
};

type UpdateProject = CreateProject & {
  id: Project["id"];
};

export const getProjects = async ( userId: User["id"] ): Promise<ProjectFromDB[]> => {
  try {
    const result = await prisma.project.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getProjectById = async (id: Project["id"], userId: User["id"]): Promise<ProjectFromDB | null> => {
  try {
    const result = await prisma.project.findFirst({
      where: { id, userId }
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const createProject = async (project: CreateProject) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

export const updateProjectsSortOrder = async (projects: Project[]) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

export const updateProjectDetails = async (project: UpdateProject) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

export const deleteProjectById = async (id: Project["id"]) => {
  try {
    const result = await prisma.project.delete({
      where: { id },
    });

    return result;
  } catch (error) {
    throw error;
  }
};
