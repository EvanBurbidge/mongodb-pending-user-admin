import axios from 'axios'
import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import { getAbsoluteUrl } from '@/utils/getAbsoluteUrl'
import debounce from 'lodash/debounce';
import { Table } from '@thewebuiguy/components/lib/Table';
import { Button } from '@thewebuiguy/components/lib/Button';
import { TableRow } from '@thewebuiguy/components/lib/TableRow';
import { TableCell } from '@thewebuiguy/components/lib/TableCell';
import { ButtonOutline } from '@thewebuiguy/components/lib/ButtonOutline';
import { TableHeader } from '@thewebuiguy/components/lib/TableHeader';
import { SearchInput } from '@thewebuiguy/components/lib/SearchInput';
import { OverlayLoader } from '@thewebuiguy/components/lib/OverlayLoader';
import { supabase } from '@/utils/supabase';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [filter, setFilter] = useState('')
  const [filteredData, setFilteredData] = useState([]);
  const [syncLoading, setSyncLoading] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase
      .from('PendingUsers')
      .select()
      .ilike('email', `%${filter}%`);
    setFilteredData(data);
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

  const handleSetFilter = debounce((e) => setFilter(e.target.value), 500);

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <main
      className={`flex min-h-screen flex-col ${inter.className}`}
    >
      <div className="bg-primary p-2 flex justify-between items-center">
        <div className="w-1/2">
          <SearchInput onChange={handleSetFilter} placeholder='search users' />
        </div>
        <Button onClick={syncLatestUsers} id="user-sync" classNames='border border-white'>
          Sync latest users
        </Button>
      </div>
      <div className="px-2 mt-2">
        {syncLoading && <OverlayLoader />}
        <Table
          tableHeader={
            <TableRow>
              <TableHeader title="email" />
              <TableHeader title="id" />
              <TableHeader title="confirmed" />
            </TableRow>
          }
          tableBody={
            <>

              {filteredData.length && filteredData.map(user => (
                <TableRow key={user._id}>
                  <TableCell title={user.email} />
                  <TableCell subtitle={user.realmId} />
                  <TableCell subtitle={user.confirmed || "false"} />
                </TableRow>
              ))}
            </>
          }
        />
      </div>

    </main>
  )
}
