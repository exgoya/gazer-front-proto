import json
from pydantic import BaseModel
from typing import List, Literal

class Member(BaseModel):
    GROUP_NAME: str
    MEMBER_NAME: str
    MEMBER_HOST: str
    MEMBER_PORT: int
    USER: str
    PASSWORD: str

class CPUStat(BaseModel):
    user: float
    system: float
    idle: float
    iowait: float
    total: float

class MEMStat(BaseModel):
    used_memory: int
    free_memory: int
    available_memory: int

class MemberStat(BaseModel):
    MEMBER_NAME: str
    STATUS: str
    CPU: CPUStat
    MEM: MEMStat

class DBConfig(BaseModel):
    MEMBERS: List[Member]
    TOTAL_GROUP_COUNT: int
    TOTAL_MEMBER_COUNT: int
    

class CommandRequest(BaseModel):
    cmd: Literal["STARTUP", "SHUTDOWN", "REBALANCE", "JOIN"]

def load_config() -> DBConfig:
    file_path = 'config_test.json'
    with open(file_path, 'r') as file:
        json_data = json.load(file)
    return DBConfig(**json_data)

config = load_config()
