const insertRootSpans = async (client, rootSpans) => {
  console.log('Inserting root spans into database');
  await client.query('BEGIN');
  try {
    for (const rootSpan of rootSpans) {
      await client.query(
        `INSERT INTO root_spans (id, trace_id, input, output, project_name, span_name, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [rootSpan.id, rootSpan.traceId, rootSpan.input, rootSpan.output, rootSpan.projectName,
        rootSpan.spanName, rootSpan.startTime, rootSpan.endTime]);
    }
    await client.query('COMMIT');
    console.log('Root span data successfully added');
  } catch (e) {
    console.log('Root span data addition failed.')
    await client.query('ROLLBACK');
    throw e;
  }
}

export default insertRootSpans