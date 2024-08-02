
import asyncio
from services.db import get_member_status
from config import MemberStat, CPUStat, MEMStat
from utils import execute_remote_commands

async def fetch_remote_stat(member):
    """
    원격 서버에서 CPU 및 메모리 통계를 비동기적으로 가져오는 함수
    """
    # 원격 서버에서 CPU 시간과 메모리 사용량을 가져옵니다.
    # await asyncio.sleep(3)
    cpu_times, memory_usage = await execute_remote_commands(member.MEMBER_HOST, member.USER, member.PASSWORD)
    
    if cpu_times is None:
        cpu_stat = CPUStat(user=0, system=0, idle=0, iowait=0, total=0)
    else:
        cpu_stat = cpu_times

    if memory_usage is None:
        memory_stat = MEMStat(used_memory=0, free_memory=0, available_memory=0)
    else:
        memory_stat = memory_usage
    return cpu_stat, memory_stat

async def collect_member_stat(member):
    """
    멤버의 상태를 비동기적으로 수집하는 함수
    """
    
    # 비동기적으로 작업 실행 및 결과 수집
    # cpu_stat, memory_stat = await fetch_remote_stat(member)
    # status = await get_member_status(member)
    
    fetch_stat_task = fetch_remote_stat(member)
    get_status_task = get_member_status(member)

    (cpu_stat, memory_stat),status  = await asyncio.gather(fetch_stat_task, get_status_task)
    # 두 비동기 작업을 동시에 기다림
    # MemberStat 객체 생성 및 반환
    return MemberStat(
        MEMBER_NAME=member.MEMBER_NAME,
        STATUS=status,
        CPU=cpu_stat,
        MEM=memory_stat
    )
