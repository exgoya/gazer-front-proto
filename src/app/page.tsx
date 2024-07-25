import { ArrowDownIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

type Config = {
  members: Member[];
}
type Member = {
  group: string;
  name: string;
  host: string;
  port: number;
};

async function getData() : Promise<Config>{
  const res = await fetch('http://localhost:9999/root',{cache: 'no-store'});
  // console.log(res)
  return res.json();
}

export default async function Home() {
  const config = await getData();
  const members = config.members;
  
  // console.log(config.members);d
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    {/* member name list 를 get 한다 */}
    <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="bg-white rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium">
                  group
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  member
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  host
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  port
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">

            {members?.map((member) => (
                <tr
                  key={member.name}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.group}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.host}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.port}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <form >
                    <input id="cmd" name="cmd" type="string" placeholder="cmd" className="hidden" defaultValue="shutdown" />
                    <input id="name" name="name" type="string" placeholder="name" className="hidden" defaultValue={member.name} />

                    <div className="flex justify-end gap-3">
                      {/* <Link
                        href={`/${member.name}`}
                        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        <span className="hidden md:block">Shutdown</span>{' '}
                        <ArrowDownIcon className="h-5 md:ml-4" />
                      </Link> */}
                      <button type="submit" className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">shutdown</button>

                    </div>

                    </form>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>  
    </main>
  );
}
