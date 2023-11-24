import { GetAppIds, LoginToAtlas } from "@/utils/MongoDBAtlas";
const {
  MONGODB_API_KEY,
  MONGODB_API_KEY_PRIVATE,
  GROUP_ID,
  APP_ID
} = process.env;


export default async function getApps(req, resp) {
  if (!MONGODB_API_KEY || !MONGODB_API_KEY_PRIVATE || !GROUP_ID || !APP_ID) {
    return resp.status(401).json({ invalidCredientals: true });
  }
  try {
    const token = await LoginToAtlas(MONGODB_API_KEY, MONGODB_API_KEY_PRIVATE);
    const apps = await GetAppIds(token, GROUP_ID);
    return resp.status(200).json({ success: true, apps })
  } catch (e) {
    console.error(e);
    return resp.status(500).json({ e });
  }
}