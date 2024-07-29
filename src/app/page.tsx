'use client';
import Link from 'next/link';
import {
  LinkIcon
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';


export default async function Home() {
  const pathname = usePathname();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    {/* member name list 를 get 한다 */}

    <div className="text-left">
      <p>Welcome Goldilocks Dashboards</p>
      <Link
            key='dashboard'
            href='/dashboard'
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === '/dashboard',
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">Dashboard</p>
          </Link>
    </div>
    </main>
  );
}
