import axios from 'axios'
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { getAbsoluteUrl } from '@/utils/getAbsoluteUrl';
import { Table } from '@thewebuiguy/components/lib/Table';
import { Button } from '@thewebuiguy/components/lib/Button';
import { TableRow } from '@thewebuiguy/components/lib/TableRow';
import { TableCell } from '@thewebuiguy/components/lib/TableCell';

import { TableHeader } from '@thewebuiguy/components/lib/TableHeader';
import { SearchInput } from '@thewebuiguy/components/lib/SearchInput';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { OverlayLoader } from '@thewebuiguy/components/lib/OverlayLoader';





const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const user = useUser()
  const [filter, setFilter] = useState('');
  const supabaseClient = useSupabaseClient()
  const [filteredData, setFilteredData] = useState([]);
  const [syncLoading, setSyncLoading] = useState(false);

  const fetchData = async () => {
    const { data } = await supabaseClient
      .from('PendingUsers')
      .select()
      .ilike('email', `%${filter}%`);
    setFilteredData(data);
  }

  const getApps = () => {
    axios.post(getAbsoluteUrl('/api/mongo/get-apps'));
  }

  const syncLatestUsers = async () => {
    setSyncLoading(true);
    try {
      const resp = await axios.post(getAbsoluteUrl('/api/mongo/get-pending-users'));
      if (resp) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
    setSyncLoading(false);
  }
  const confirmUser = async (email, id) => {
    setSyncLoading(true);
    try {
      const resp = await axios.post(getAbsoluteUrl('/api/mongo/confirm-pending-user'), {
        email,
      });
      await supabaseClient.from('PendingUsers').update({ confirmed: resp.data.success }).eq('id', id);
      toast("User confirmed");
      if (resp) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
    setSyncLoading(false);
  }

  const resendConfirmation = async (email, id) => {
    setSyncLoading(true);
    try {
      const resp = await axios.post(getAbsoluteUrl('/api/mongo/send-confirmation'), {
        email,
      });
      toast("Confirmation email sent");
      if (resp) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
    setSyncLoading(false);
  }

  const removeUser = async (email, id) => {
    setSyncLoading(true);
    try {
      const resp = await axios.post(getAbsoluteUrl('/api/mongo/delete-pending-user'), {
        email,
      });
      await supabaseClient.from('PendingUsers').delete().eq('id', id);
      toast("User deleted");
      setFilter('');
      if (resp) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
    setSyncLoading(false);
  }

  const handleSetFilter = debounce((e) => setFilter(e.target.value), 500);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [filter, user]);

  if (!user)
    return (
      <main
        className={`flex min-h-screen justify-center items-center bg-primary flex-col ${inter.className}`}
      >
        <div className="bg-white rounded-md w-1/4 p-10 h-auto">
          <Auth
            redirectTo="http://localhost:3000/"
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={[]}
            showLinks={false}
            view="sign_in"
          />
        </div>
      </main>
    )

  return (
    <main
      className={`flex min-h-screen flex-col ${inter.className}`}
    >
      <div className="bg-primary p-2 flex justify-between items-center">
        <div className="w-1/2">
          <SearchInput onChange={handleSetFilter} placeholder='search users' />
        </div>
        <div>
          <Button onClick={syncLatestUsers} id="user-sync" classNames='border border-white'>
            Sync latest users
          </Button>
          <Button onClick={() => supabaseClient.auth.signOut()} id="user-sync" classNames='ml-2 hover:text-gray-200'>
            Sign out
          </Button>
        </div>
      </div>
      <div className="px-2 mt-2">
        {syncLoading && <OverlayLoader />}
        <Table
          tableHeader={
            <TableRow>
              <TableHeader title="email" />
              <TableHeader title="confirmed" />
              <TableHeader />
            </TableRow>
          }
          tableBody={filteredData.length > 0 && filteredData.map(user => (
            <TableRow key={user.id}>
              <TableCell title={user.email} subtitle={user.realmId} />
              <TableCell subtitle={user.confirmed || "false"} />
              <TableCell>
                <div className='flex justify-end'>
                  <Button
                    id={`confirm-${user.realmId}`}
                    onClick={() => confirmUser(user.email, user.id)}
                  >
                    Confirm
                  </Button>
                  <Button
                    type="error"
                    classNames='ml-2'
                    id={`delete-${user.realmId}`}
                    onClick={() => removeUser(user.email, user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        />
      </div>

    </main>
  )
}
