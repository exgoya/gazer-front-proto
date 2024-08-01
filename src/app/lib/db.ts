'use server';

import { z } from 'zod';
import { API_URL } from '../config/urls'; // 경로를 프로젝트에 맞게 조정
import { redirect } from 'next/navigation';

// 데이터 타입 정의
export type Config = {
  members: Member[];
  total_group_count: number;
  total_member_count: number;
};

export type Member = {
  group_name: string;
  member_name: string;
  member_host: string;
  member_port: number;
  status : string;
};

export type cmdResult = {
  member_name: string;
  cmd: string;
  result: string;
  current_status: string|null;
};

export type cmdState = {
  errors?: {
    name?: string[];
    cmd?: string[];
  };
  message?: string | null;
  result?: cmdResult | null;
};

// 서버에서 데이터 가져오기
export async function getData(): Promise<Config> {
  try {
    const res = await fetch(`${API_URL}/home`, { cache: 'no-store' });
    // const res = await fetch('http://localhost:9999/root', { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Failed to fetch configuration data');
    }

    return res.json();
  } catch (error) {
    console.log('Error fetching configuration data:', error);
    redirect('/');
    throw error;
  }
}
// 멤버 데이터 가져오기
export async function getMembers(): Promise<Member[]> {
  const config = await getData();
  return config.members;
}

// 명령어 유효성 검사 스키마 정의
const cmdSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  cmd: z.enum(['STARTUP', 'SHUTDOWN', 'JOIN','REBALANCE'], { invalid_type_error: 'Please select a valid command.' })
});

// 명령어 실행
export async function cmdMember(
  prevState: cmdState,
  formData: FormData
): Promise<cmdState> {
  const validatedFields = cmdSchema.safeParse({
    name: formData.get('name') as string,
    cmd: formData.get('cmd') as 'startup' | 'shutdown' | 'join'
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to run Cmd.',
    };
  }

  const { name, cmd } = validatedFields.data;

  try {
    const response = await fetch(`${API_URL}/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cmd }),
    });

    if (!response.ok) {
      throw new Error('Failed to run command');
    }

    const data = await response.json();
    return { message: null, errors: {}, result: data };

  } catch (error) {
    console.error(error);
    redirect('/');

    return { message: 'Failed to run command', errors: {} };
  }
}
