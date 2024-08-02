# cpu_utils.py

from pydantic import BaseModel

class CPUStat(BaseModel):
    used: float
    total: float

    class Config:
        # 소수점 이하 두 자리까지 표현하기 위한 설정
        anystr_strip_whitespace = True
        min_anystr_length = 1
        max_anystr_length = 255
        json_encoders = {
            float: lambda v: round(v, 2)
        }
