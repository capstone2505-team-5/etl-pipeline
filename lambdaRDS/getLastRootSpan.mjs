const getRootSpansFromDB = async (client) => {
  await client.connect();
  const result = await client.query('SELECT * FROM root_spans;');
  console.log(result);
  await client.end();
}

export default getRootSpansFromDB