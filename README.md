# Mongodb Atlas Pending Users Manager

I started this project due to the lacking of search functionality within the mongodb atlas admin, too often was
I asked to help with a user confirmation only to have to click "load more" endlessy until I found that users email. So I built this, which will enable you to sync your pending users into a supabase db instance. 

## How to use

1. Fork this repo into your own github

2. Create a mongo db [api key](https://www.mongodb.com/docs/atlas/configure-api-access/);

3. If you have an atlas project already setup you will need to get your groupid and app id. You can get that information [here](https://www.mongodb.com/docs/atlas/app-services/admin/api/v3/#section/Project-and-Application-IDs) or from your projects url. 

4. Setup a supabase instance
  a. Create a table called PendingUsers
  b. Add the columns, email - Text, realmId - Text and confirmed - Boolean.
  c. Add a user to your supabase instance
  d. Copy your supabase url and public anon key into the .env file

5. Run `npm install` and then `npm run dev` to start the local server

6. Login to your project with the user you added to supabase.

7. Click "sync realm users" this may take a while on the first run depending on how many users you have. If it times out click it again.

8. Your users should now be loaded into your supabase instance and you can query this and run confirmations and deletions on users in your pending users list. 

**Note**: you should run the sync users from time to time to ensure you have the most up to date data.
 