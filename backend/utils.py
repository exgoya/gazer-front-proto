import asyncssh
import asyncio
import logging
from config import CPUStat, MEMStat

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)
async def execute_remote_commands(host: str, user: str, password: str):
    """
    원격 서버에서 여러 명령어를 비동기적으로 실행하고 결과를 반환하는 함수
    """
    retries = 3  # 최대 재시도 횟수
    for attempt in range(retries):
        try:
            logger.debug(f"Attempting to connect to {host}:22 as {user}")
            async with asyncssh.connect(host, port=22, username=user, password=password) as conn:
                cpu_result = await conn.run('cat /proc/stat', check=True)
                memory_result = await conn.run('free -m', check=True)
                
                logger.debug(f"Successfully retrieved CPU times and memory usage from {host}:22")
                return convert_to_cpu_stat(parse_cpu_times(cpu_result.stdout)), parse_memory_usage(memory_result.stdout)
        except (asyncssh.Error, OSError) as e:
            logger.error(f"Connection error: {e}. Attempt {attempt + 1}/{retries}")
            if attempt < retries - 1:
                await asyncio.sleep(2)  # 재시도 대기 시간
                continue
            logger.error(f"Failed to connect to {host}:22 after {retries} attempts")
            return None, None

def parse_cpu_times(cpu_data: str):
    """
    /proc/stat에서 읽은 CPU 데이터에서 각 CPU 시간 정보를 추출하는 함수
    """
    lines = cpu_data.splitlines()
    cpu_line = lines[0]  # 첫 번째 줄에서 CPU 정보를 가져옴
    parts = cpu_line.split()
    
    # 'cpu' 이후의 항목이 CPU 시간 정보
    cpu_times = list(map(int, parts[1:]))
    
    if len(cpu_times) < 5:
        logger.error("Insufficient CPU time data")
        return None
    
    # 시간 정보를 세부적으로 추출
    user_time = cpu_times[0]
    nice_time = cpu_times[1]
    system_time = cpu_times[2]
    idle_time = cpu_times[3]
    iowait_time = cpu_times[4]
    # 전체 CPU 시간 계산
    total_time = user_time + nice_time + system_time + idle_time + iowait_time
    
    return user_time, system_time, idle_time, iowait_time, total_time

def convert_to_cpu_stat(cpu_times):
    """
    CPU 시간 정보를 받아 CPUStat 객체로 변환하는 함수
    
    :param cpu_times: CPU 시간 정보 (user_time, system_time, idle_time, iowait_time, total_time)
    :return: CPUStat 객체
    """
    if not cpu_times or len(cpu_times) < 5:
        # 유효한 CPU 시간 데이터가 없으면 기본값으로 CPUStat 반환
        return CPUStat(user=0, system=0, idle=0, iowait=0, total=0)
    
    user_time, system_time, idle_time, iowait_time, total_time = cpu_times
    
    # CPU 사용률 계산
    total_time_diff = total_time
    if total_time_diff == 0:
        return CPUStat(user=0, system=0, idle=0, iowait=0, total=0)
    
    user_percentage = round(100 * user_time / total_time_diff, 2)
    system_percentage = round(100 * system_time / total_time_diff, 2)
    idle_percentage = round(100 * idle_time / total_time_diff, 2)
    iowait_percentage = round(100 * iowait_time / total_time_diff, 2)
    
    return CPUStat(
        user=user_percentage,
        system=system_percentage,
        idle=idle_percentage,
        iowait=iowait_percentage,
        total=100  # 전체 사용률을 100으로 설정
    )
    
def parse_memory_usage(memory_data: str):
    """
    'free -m' 명령어의 출력에서 메모리 사용량을 파싱하는 함수
    """
    lines = memory_data.splitlines()
    if len(lines) < 2:
        logger.error("불충분한 메모리 사용량 데이터")
        return MEMStat(used_memory=0, free_memory=0, available_memory=0)
    
    # 메모리 사용량 정보가 있는 두 번째 줄을 분석
    mem_line = lines[1]
    parts = mem_line.split()
    
    used_memory = int(parts[2])  # 사용 중인 메모리 (MB)
    free_memory = int(parts[3])  # 자유 메모리 (MB)
    available_memory = int(parts[6])  # 사용 가능한 메모리 (MB)

    return MEMStat(
        used_memory=used_memory,
        free_memory=free_memory,
        available_memory=available_memory
    )