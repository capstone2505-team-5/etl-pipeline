const queryAPI = async (query, api_key) => {
  const body = { query };

  console.log(api_key)
  try {
    const response = await fetch(process.env.PHOENIX_API_URL+ '/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
    }

    return data;
  } catch (error) {
    console.error('Error in queryAPI:', error);
    throw error; // rethrow so the caller can handle it if needed
  }
};

export default queryAPI;