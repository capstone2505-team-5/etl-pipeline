export interface Project {
  id: string;
  name: string;
  createdAt: string;
  traceCount: number;
}

export interface GraphQLProjectResponse {
  data?: {
    projects?: {
      edges?: Array<{
        node?: {
          id?: string;
          name?: string;
          createdAt?: string;
          traceCount?: number;
          };
      }>;
    };
  };
}

export interface ProjectEdge {
  node?: {
    id?: string;
    name?: string;
    createdAt?: string;
    traceCount?: number;
  };
}