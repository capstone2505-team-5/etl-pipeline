export interface RootSpan {
  id: string;
  traceId: string;
  startTime: string | null;      // or Date
  endTime: string | null;        // or Date
  input: string;
  output: string;
  projectName: string;
  spanName: string | null;
}

export interface GraphQLResponse {
  data?: {
    projects?: {
      edges?: Array<{
        node?: {
          name?: string;
          spans?: {
            edges?: Array<{
              node?: {
                context?: { spanId: string; traceId: string };
                input?: { value: string };
                output?: { value: string };
                startTime?: string;
                endTime?: string;
                name?: string;
                spanKind?: string;
              };
            }>;
          };
        };
      }>;
    };
  };
}

export interface ProjectEdge {
  node?: {
    name?: string;
    spans?: {
      edges?: SpanEdge[];
    };
  };
}

export interface SpanEdge {
  node?: {
    context?: {
      spanId: string;
      traceId: string;
    };
    input?: {
      value: string;
    };
    output?: {
      value: string;
    };
    startTime?: string;
    endTime?: string;
    name?: string;
    spanKind?: string;
  };
}