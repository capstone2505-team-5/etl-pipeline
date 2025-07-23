How to get this working locally:

1. You need to download aws-sam-cli. Run commands:
brew tap aws/tap
brew install aws-sam-cli

2. You need to have docker installed and running, you can view if it's running in docker desktop.

3. Make the env.json in root directory w/ file structure like so:
{
 "FetchRootSpans": {
   "NODE_ENV":"development",
   "LOCALPGUSER":"user",
   "LOCALPGPASSWORD":"password",
   "LOCALPGDATABASE":"db",
   "LOCALPGHOST":"host.docker.internal",
   "LOCALPGPORT":"5432",
   "PHOENIX_API_KEY":"api_key",
   "PHOENIX_API_URL":"enpoint"
 }
}

4. Navigate to root directory and run:
npm run build
npm run dev

5. Use postman or curl to ensure it's working correctly:
curl http://localhost:8080/fetchRootSpans

How to deploy:

Still figuring the best way out....
For now you can zip and upload