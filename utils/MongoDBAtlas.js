import axios from "axios"
import { supabase } from "./supabase";

const getHeaders = (token) => ({
  "Authorization": `Bearer ${token}`
})

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
        return await FetchPendingUsers(token, groupId, appId, [...users, ...data], data[data.length - 1]._id)
      }
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function GetAppIds(token, groupId) {
  try {
    const { data } = await axios.get(`https://realm.mongodb.com/api/admin/v3.0/groups/${groupId}/apps`, {
      headers: getHeaders(token)
    });
    return data;
  } catch (e) {
    console.error(e);
    return []
  }
}



export async function ConfirmUser(token, groupId, appId, email) {
  try {
    await axios.post(`https://realm.mongodb.com/api/admin/v3.0/groups/${groupId}/apps/${appId}/user_registrations/by_email/${email}/confirm`, {}, {
      headers: getHeaders(token)
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function DeleteUser(token, groupId, appId, email) {
  try {
    await axios.delete(`https://realm.mongodb.com/api/admin/v3.0/groups/${groupId}/apps/${appId}/user_registrations/by_email/${email}`, {}, { headers: { "Authorization": `Bearer ${token}` } });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}