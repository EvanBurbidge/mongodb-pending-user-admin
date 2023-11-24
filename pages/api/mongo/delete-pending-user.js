import { supabase } from "@/utils/supabase";
import { ConfirmUser, DeleteUser, FetchPendingUsers, LoginToAtlas } from "@/utils/MongoDBAtlas";
const {
  MONGODB_API_KEY,
  MONGODB_API_KEY_PRIVATE,
  GROUP_ID,
  APP_ID
} = process.env;


export default async function deletePendingUser(req, resp) {
  const { email } = req.body;
  if (!email) {
    return resp.status(400).json({ error: "Missing information" })
  }
  if (!MONGODB_API_KEY || !MONGODB_API_KEY_PRIVATE || !GROUP_ID || !APP_ID) {
    return resp.status(401).json({ invalidCredientals: true });
  }
  try {

    const token = await LoginToAtlas(MONGODB_API_KEY, MONGODB_API_KEY_PRIVATE);
    await DeleteUser(token, GROUP_ID, APP_ID, email);
    return resp.status(200).json({ success: true })
  } catch (e) {
    console.error(e);
    return resp.status(500).json({ e });
  }
}