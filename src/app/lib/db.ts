'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
   
  export default async function getData() : Promise<Config>{
    const res = await fetch('http://192.168.0.120:8000/home',{cache: 'no-store'});
    
    //console.log(res)
    return res.json();
  }
  export async function getMembers(){
    const config = await getData()
    console.log(config.MEMBERS)
    const members = config.MEMBERS
    return members;
  }

  export async function shutdownMember(
    formData: FormData,
  ) {
    const name = formData.get('name')

    const response = await fetch(`http://192.168.0.120:8000/${name}`, {
      method: 'POST',
      body: formData,
    })
  
    revalidatePath(`/dashboard/${name}`);
    redirect(`/dashboard/${name}`);
  }