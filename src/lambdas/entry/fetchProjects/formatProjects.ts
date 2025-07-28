import { GraphQLProjectResponse, Project, ProjectEdge } from "../types/types";

const formatProjects = (data: GraphQLProjectResponse): Project[] => {
  try {
    // Parse json and format by project
    const allProjects = parseAndFormatProjects(data);

    // Filter out projects with any missing properties
    const filteredProjects = filterProjects(allProjects); 

    // console.log(`📈 Processed ${filteredProjects.length} valid root projects`);
    return filteredProjects;

  } catch (error) {
    console.error('Error in formatRootProjects:', error);
    return []; // Return empty array on any formatting error
  }
};

const parseAndFormatProjects = (data: GraphQLProjectResponse): (Project | null)[] => {
  if (!data?.data?.projects?.edges) {
    console.log('No projects data found');
    return [];
  }
  
  return data.data.projects.edges.flatMap((project: ProjectEdge) => {

    const projectName = project?.node?.name;
    if (!projectName) {
      console.warn('Project name missing, skipping');
      return [];
    }

    const projectId = project?.node?.id;
    if (!projectId) {
      console.warn('Project id missing, skipping');
      return [];
    }

    const projectTraceCount = project?.node?.traceCount;
    if (projectTraceCount === undefined || projectTraceCount === null) {
      console.warn('Project trace count missing, skipping');
      return [];
    }

    const projectCreatedAt = project?.node?.createdAt;
    if (!projectCreatedAt) {
      console.warn('Project created at missing, skipping');
      return [];
    }

    return {
      id: projectId,
      name: projectName,
      createdAt: projectCreatedAt,
      traceCount: projectTraceCount
    };
  });
}

const filterProjects = (projects: (Project | null)[]): Project[] => {
  return projects.filter((project): project is Project => {
    if (!project) return false;
    
    return !!(
      project.id &&
      project.name &&
      project.createdAt &&
      (project.traceCount !== undefined && project.traceCount !== null)
    );
  });
};
export default formatProjects