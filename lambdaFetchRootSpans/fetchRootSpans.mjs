import queryAPI from "./queryAPI.mjs";

const fetchRootSpans = async (api_key) => {
  try {
    console.log('Fetching root spans');
  
    const query = 
    `query RootSpans {
      projects (filter: {col: name, value: "recipe-chatbot-oneTrace"}) {
        edges {
          node {
            name
            spans(rootSpansOnly: true) {
              edges {
                node {
                  context {
                    spanId
                    traceId
                  }
                  input {
                    value
                  }
                  output {
                    value
                  }
                  startTime
                  endTime
                  name
                }
              }
            }
          }
        }
      }
    }`

    const data = await queryAPI(query, api_key);
    const formattedData = formatRootSpans(data);
    return formattedData;
  } catch (error) {
    console.error('Error in fetchRootSpans:', error);
  }
};

// This is the formatting for our rootSpans where we want the content from the last object in an array.
const formatRootSpans = (data) => {
  console.log('Formatting root spans')
  return data.data.projects.edges.flatMap((project) => {
    return project.node.spans.edges.map((span) => {
      
      return {
        id: span.node.context.spanId,
        traceId: span.node.context.traceId,
        startTime: span.node.startTime,
        endTime: span.node.endTime,
        input: span.node.input.value,
        output: span.node.output.value,
        projectName: project.node.name,
        spanName: span.node.name,
      };
    });
  });
};

export default fetchRootSpans;