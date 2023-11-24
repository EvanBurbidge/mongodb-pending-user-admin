import axios from "axios"

export async function LoginToAtlas(apiKey, secretKey) {
  try {
    const { data } = await axios.post('https://realm.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login', {
      username: apiKey,
      apiKey: secretKey,
    })
    if (data) {
      return data.access_token;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function FetchPendingUsers(token, groupId, appId, users = [], after = '') {
  try {
    console.log(after);
    const { data } = await axios.get(`https://realm.mongodb.com/api/admin/v3.0/groups/${groupId}/apps/${appId}/user_registrations/pending_users?after=${after}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (data) {
      if (data.length < 50) {
        return data;
      } else {
        console.log('calling');
        return await FetchPendingUsers(token, groupId, appId, [...users, ...data], data[data.length - 1]._id)
      }
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function ConfirmUser(token, groupId, appId, email) {
  try {
    const { data } = await axios.get(`https://realm.mongodb.com/api/admin/v3.0/groups/${groupId}/apps/${appId}/user_registrations/user_registrations/by_email/${email}/confirm`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (data) {
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}