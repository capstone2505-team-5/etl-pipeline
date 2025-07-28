import queryAPI from "../../../shared/queryAPI.js";
import formatRootSpans from "./formatRootSpans.js";


const fetchRootSpans = async (api_key: string) => {
  try {
    console.log('Fetching root spans');
  
    const query = 
    `query RootSpans($startTime: DateTime!, $endTime: DateTime!) {
      projects {
        edges {
          node {
            name
            spans(
              rootSpansOnly: true
              timeRange: {start: $startTime, end: $endTime}
              first: 2000
            ) {
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

export default fetchRootSpans;