import { Client } from "pg";
import { Project } from "../types/types";

const insertProjects = async (client: Client, projects: Project[]): Promise<void> => {
  if (projects.length === 0) {
    console.log('No projects to insert.');
    return;
  }
  
  console.log('Inserting projects into database');
  await client.query('BEGIN');

  try {
    const insertQuery = `
      INSERT INTO projects (
        id, name, created_at, root_span_count, updated_at
      )
      VALUES ${projects.map((_, i) => `(
        $${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5}
      )`).join(', ')}
      ON CONFLICT (id) DO UPDATE SET
        root_span_count = EXCLUDED.root_span_count,
        updated_at = EXCLUDED.updated_at
    `;

      // Flatten the project data into a single parameter array
  const params = projects.flatMap(project => [
    project.id,
    project.name,
    project.createdAt,
    project.rootSpanCount,
    project.updatedAt
  ]);

    await client.query(insertQuery, params);
    await client.query('COMMIT');
    console.log('Project data successfully added');
  } catch (e) {
    console.log('Project data addition failed.')
    await client.query('ROLLBACK');
    throw e;
  }
}

export default insertProjects