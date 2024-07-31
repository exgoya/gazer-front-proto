'use client';

import { Member, cmdMember ,cmdState} from '@/app/lib/db'; // 경로가 올바른지 확인하세요.
import { useState } from 'react';

export default function Form({ member ,cmd}: { member: Member ,cmd: string}) {
  const [state, setState] = useState<cmdState>({
    message: null,
    errors: {}
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      // 폼 데이터 디스패치 및 상태 업데이트
      const result = await cmdMember(state, formData);
      setState(result); // `result` 타입이 `cmdState`와 일치해야 합니다.

      // 성공 시 리다이렉션 처리 (선택적)
      // window.location.href = '/dashboard';
    } catch (error) {
      console.error('폼 제출 오류:', error);
      setState({
        message: '폼 제출 중 오류가 발생했습니다.',
        errors: {}
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="name"
        className="hidden"
        defaultValue={member.MEMBER_NAME}
        aria-describedby="name-error"
      />
      <input
        id="cmd"
        name="cmd"
        type="text"
        placeholder="cmd"
        className="hidden"
        defaultValue={cmd}
        aria-describedby="cmd-error"
      />

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {cmd}
        </button>
      </div>

      <div id="name-error" aria-live="polite" aria-atomic="true">
        {state.errors?.name &&
          state.errors.name.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
      <div id="cmd-error" aria-live="polite" aria-atomic="true">
        {state.errors?.cmd &&
          state.errors.cmd.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
      {state.message && <p className="mt-2 text-sm text-red-500">{state.message}</p>}
    </form>
  );
}
