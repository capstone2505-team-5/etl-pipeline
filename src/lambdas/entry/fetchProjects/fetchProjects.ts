import queryAPI from "../../../shared/queryAPI.js";
import formatProjects from "./formatProjects.js";

async function fetchProjects(phoenixKey: string): Promise<{ id: string }[]> {
  console.log('Fetching all projects');

  const query = `
    query GetAllProjects {
      projects {
        edges {
          node {
            createdAt
            name
            traceCount
            id
          }
        }
      }
    }
  `;

  const json = await queryAPI(query, phoenixKey)

  const projects = formatProjects(json);

  console.log(projects)

  if (json.errors) {
    console.error("Error fetching projects:", json.errors);
    throw new Error("Failed to fetch projects");
  }

  return projects;
}

export default fetchProjects