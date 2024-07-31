import { getData } from '../lib/db';
import Form from '@/app/ui/runCmd-forms';

export default async function Page() {
  const config = await getData();
  console.log(config);
  const members = config.MEMBERS;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* member name list 를 get 한다 */}
      <div className="flex">
        <table className="flex min-w-full text-gray-900 md:table">
          <thead className="bg-white rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium">Group</th>
              <th scope="col" className="px-3 py-5 font-medium">Member</th>
              <th scope="col" className="px-3 py-5 font-medium">Host</th>
              <th scope="col" className="px-3 py-5 font-medium">Port</th>
              <th scope="col" className="px-3 py-5 font-medium">Action</th>
              <th scope="col" className="relative py-3 pl-6 pr-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {members?.map((member) => (
              <tr
                key={member.MEMBER_NAME}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap px-3 py-3">{member.GROUP_NAME}</td>
                <td className="whitespace-nowrap px-3 py-3">{member.MEMBER_NAME}</td>
                <td className="whitespace-nowrap px-3 py-3">{member.MEMBER_HOST}</td>
                <td className="whitespace-nowrap px-3 py-3">{member.MEMBER_PORT}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <Form member={member} cmds={['startup', 'shutdown', 'join']} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex text-left">
        <p className="whitespace-nowrap py-3 pl-6 pr-3">Total Group Count: {config.TOTAL_GROUP_COUNT}</p>
        <p className="whitespace-nowrap py-3 pl-6 pr-3">Total Member Count: {config.TOTAL_MEMBER_COUNT}</p>
      </div>
    </main>
  );
}
