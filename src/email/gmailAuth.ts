import fs from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");

export async function authorize() {
    // Load client credentials
    const credentials = JSON.parse(fs.readFileSync("credentials.json", "utf8"));
    const { client_secret, client_id, redirect_uris } = credentials.web;

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if token already exists
    if (fs.existsSync(TOKEN_PATH)) {
        oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")));
        return oAuth2Client;
    }

    // Generate consent URL
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline", // allows refresh token
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this URL:\n", authUrl);

    // Read code from console
    const code = await new Promise<string>((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question("Enter the code from that page here: ", (c) => {
            rl.close();
            resolve(c);
        });
    });

    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log("Token stored to", TOKEN_PATH);

    return oAuth2Client;
}

async function listLabels() {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });

    const res = await gmail.users.labels.list({ userId: "me" });
    console.log("Labels:", res.data.labels?.map(l => l.name));
}

listLabels().catch(console.error);