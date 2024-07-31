'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export type Config = {
  MEMBERS: Member[];
  TOTAL_GROUP_COUNT: number;
  TOTAL_MEMBER_COUNT: number;
};

export type Member = {
  GROUP_NAME: string;
  MEMBER_NAME: string;
  MEMBER_HOST: string;
  MEMBER_PORT: number;
};

export type ResultCmd = {
  GROUP_NAME: string;
  MEMBER_NAME: string;
  MEMBER_HOST: string;
  MEMBER_PORT: number;
};

export async function getData(): Promise<Config> {
  const res = await fetch('http://192.168.0.120:8000/home', { cache: 'no-store' });
  // const res = await fetch('http://localhost:9999/root', { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('Failed to fetch configuration data');
  }

  return res.json();
}

export async function getMembers() {
  const config = await getData();
  return config.MEMBERS;
}

const cmdSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  cmd: z.enum(['startup', 'shutdown','join'], { invalid_type_error: 'Please select a valid command.' })
});

export type cmdResult = {
  member_name : string
  cmd : string
  result : string
  current_status : string
}

export type cmdState = {
  errors?: {
    name?: string[];
    cmd?: string[];
  };
  message?: string | null;
  result? : cmdResult|null;
};

export async function cmdMember(
  prevState: cmdState,
  formData: FormData,
): Promise<cmdState> {
  const validatedFields = cmdSchema.safeParse({
    name: formData.get('name') as string,
    cmd: formData.get('cmd') as 'startup' | 'shutdown'
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to run Cmd.',
    };
  }
  const { name, cmd } = validatedFields.data;
  try {
    const response = await fetch(`http://192.168.0.120:8000/jsontest/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, cmd }),
    });
    const data = await response.json()
    if (!response.ok) {
      throw new Error('Failed to run command');
    }
    // 성공 시 반환 타입
    return { message: null, errors: {} , result : data};
  } catch (error) {
    console.error(error);
    return { message: 'Failed to run command' };
  }
  return { message: null, errors: {} , result : null};
}
