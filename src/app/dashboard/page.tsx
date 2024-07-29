import Link from 'next/link';
import {getData, shutdownMember} from '../lib/db'
import { useFormState } from 'react-dom';
import { isNull } from 'util';

export default async function Page() {
  const config = await getData();
  const members = config.MEMBERS;
  
  // console.log(config.members);d
  const initialState = { message: null, errors: {} };
  const updateIssueWithId = shutdownMember(null);
  const [state, dispatch] = useFormState(updateIssueWithId, initialState);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    {/* member name list 를 get 한다 */}

    <div className="text-left">
      <p>Total Group Count : {config.TOTAL_GROUP_COUNT}</p>
      <p>Total Member Count : {config.TOTAL_MEMBER_COUNT}</p>
    </div>
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
                  key={member.GROUP_NAME}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.GROUP_NAME}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.MEMBER_NAME}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.MEMBER_HOST}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.MEMBER_PORT}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <form action={dispatch}>
                    <input id="cmd" name="cmd" type="string" placeholder="cmd" className="hidden" defaultValue="shutdown" />
                    <input id="name" name="name" type="string" placeholder="name" className="hidden" defaultValue={member.MEMBER_NAME} />

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
