import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const getPhoenixKey = async (event) => {
  const secret_name = process.env.PHOENIX_API_KEY_SECRET_NAME;

  if (!secret_name) throw new Error("Missing PHOENIX_API_KEY_SECRET_NAME env variable");


  const client = new SecretsManagerClient({
    region: "us-west-2",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const secret = response.SecretString;
  return JSON.parse(secret)["PHOENIX_API_KEY"]
};

export default getPhoenixKey;