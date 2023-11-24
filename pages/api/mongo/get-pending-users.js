import { supabase } from "@/utils/supabase";
import { FetchPendingUsers, LoginToAtlas } from "@/utils/MongoDBAtlas";
const {
  MONGODB_API_KEY,
  MONGODB_API_KEY_PRIVATE,
  GROUP_ID,
  APP_ID
} = process.env;


export default async function getPendingUsers(req, resp) {
  if (!MONGODB_API_KEY || !MONGODB_API_KEY_PRIVATE || !GROUP_ID || !APP_ID) {
    return resp.status(401).json({ invalidCredientals: true });
  }
  try {
    let lastId = ''
    const totalUsers = await supabase.from('PendingUsers').select('id', { count: 'exact', head: true });
    const recordedUsers = await supabase.from('PendingUsers').select('*').range(totalUsers.count - 1, totalUsers.count);
    if (recordedUsers.data.length > 0) {
      lastId = recordedUsers.data[recordedUsers.data.length - 1].realmId
    }
    const token = await LoginToAtlas(MONGODB_API_KEY, MONGODB_API_KEY_PRIVATE);
    const users = await FetchPendingUsers(token, GROUP_ID, APP_ID, [], lastId);
    const formattedUsers = users.map((user) => ({
      email: user.login_ids[0].id,
      confirmed: user.login_ids[0].confirmed,
      realmId: user._id
    }))
    await supabase.from('PendingUsers').insert(formattedUsers);
    return resp.status(200).json({ success: true })
  } catch (e) {
    console.error(e);
    return resp.status(500).json({ e });
  }
}