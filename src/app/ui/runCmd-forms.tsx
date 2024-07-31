'use client';

import { Member, cmdMember, cmdState } from '@/app/lib/db'; // 경로가 올바른지 확인하세요
import { useState } from 'react';

interface FormProps {
  member: Member;
  cmds: string[];
}

export default function Form({ member, cmds }: FormProps) {
  const [state, setState] = useState<cmdState>({
    message: null,
    errors: {},
    // Initialize result only if it is part of cmdState
    result: {
      current_status: 'No status available', // Default status message
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, cmd: string) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const result = await cmdMember(state, formData);
      setState(result);
    } catch (error) {
      console.error('폼 제출 도중 오류 발생:', error);
      setState({
        message: '폼 제출 중 오류가 발생했습니다.',
        errors: {},
        // Ensure result is included if it's part of cmdState
        result: {
          current_status: 'No status available', // Keep the default status in case of error
        },
      });
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto">
      {cmds.map((cmd) => (
        <form key={cmd} onSubmit={(e) => handleSubmit(e, cmd)} className="flex-none w-40 flex flex-col items-center gap-2">
          <input
            id="name"
            name="name"
            type="text"
            className="hidden"
            defaultValue={member.MEMBER_NAME}
            aria-describedby="name-error"
          />
          <input
            id="cmd"
            name="cmd"
            type="text"
            className="hidden"
            defaultValue={cmd}
            aria-describedby="cmd-error"
          />

          <button
            type="submit"
            className={`w-full h-10 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 ${
              cmd === 'startup'
                ? 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-600'
                : cmd === 'shutdown'
                ? 'bg-red-600 hover:bg-red-500 focus:ring-red-600'
                : cmd === 'join'
                ? 'bg-green-600 hover:bg-green-500 focus:ring-green-600'
                : 'bg-gray-600 hover:bg-gray-500 focus:ring-gray-600'
            }`}
          >
            {cmd}
          </button>

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error: string) => (
              <p key={error} className="text-sm text-red-500">{error}</p>
            ))}
          </div>
          <div id="cmd-error" aria-live="polite" aria-atomic="true">
            {state.errors?.cmd?.map((error: string) => (
              <p key={error} className="text-sm text-red-500">{error}</p>
            ))}
          </div>
        </form>
      ))}

      {state.message && <p className="text-sm text-red-500">{state.message}</p>}
      <div id="status" aria-live="polite" aria-atomic="true">
        <p className="text-sm text-red-500">{state.result?.current_status || 'No status available'}</p>
      </div>
    </div>
  );
}
