'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';


export type Config = {
    MEMBERS: Member[];
    TOTAL_GROUP_COUNT: number;
    TOTAL_MEMBER_COUNT: number;
  }
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
   
  export async function getData() : Promise<Config>{
    //const res = await fetch('http://192.168.0.120:8000/home',{cache: 'no-store'});
    const res = await fetch('http://localhost:9999/root',{cache: 'no-store'});
    
    return res.json();
  }
  export async function getMembers(){
    const config = await getData()
    console.log(config.MEMBERS)
    const members = config.MEMBERS
    return members;
  }


const cmdSchema = z.object({
  name: z.string(),
  cmd: z.enum(['startup', 'shutdown'], {
    invalid_type_error: 'Please select cmd.',
  })
});

  export type cmdState = {
    errors?: {
      name?: string[];
      cmd?: string[];
    };
    message?: string | null;
  };

  export async function cmdMember(
    prevState: cmdState,
    formData: FormData,
  ) {
    const validatedFields = cmdSchema.safeParse({
      name: formData.get('name'),
      cmd: formData.get('cmd')
    })
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to run Cmd.',
      };
    }
    const {name,cmd}= validatedFields.data;
  
    const response = await fetch(`http://192.168.0.120:8000/${name}`, {
      method: 'POST',
      body: formData,
    })
  
    revalidatePath(`/dashboard/${name}`);
    redirect(`/dashboard/${name}`);
  }