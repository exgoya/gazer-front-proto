from fastapi import APIRouter, HTTPException
from config import config,CommandRequest
from services.db import get_member_status

from services.commands import gl_startup_conn
from services.stat import collect_member_stat
import asyncio
from utils import logger


router = APIRouter()

@router.get("/home")
async def get_dashboard():
    try:
        tasks = [collect_member_stat(member) for member in config.MEMBERS]
        member_stats = await asyncio.gather(*tasks)
        return member_stats
    except Exception as e:
        logger.error(f"Error fetching dashboard data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard data")

@router.get("/{member_name}")
async def get_member_status(member_name: str):
    for member_info in config.MEMBERS:
        if member_info.MEMBER_NAME == member_name:
            member_status = await get_member_status(member_name, member_info.MEMBER_HOST, member_info.MEMBER_PORT)
            return {
                "member_name": member_name,
                "current_status": member_status
            }
    raise HTTPException(status_code=404, detail="Member not found")

@router.post("/{member_name}")
async def execute_cmd(member_name: str, request: CommandRequest):
    cmd = request.cmd
    for member_info in config.MEMBERS:
        if member_info.MEMBER_NAME == member_name:
            if cmd == "STARTUP":
                result = await gl_startup_conn(member_info.MEMBER_HOST, member_info.MEMBER_PORT)
            elif cmd == "SHUTDOWN":
                result = await gl_shutdown_conn(member_info.MEMBER_HOST, member_info.MEMBER_PORT)
            elif cmd == "REBALANCE":
                result = await gl_rebalance_conn(member_info.MEMBER_HOST, member_info.MEMBER_PORT)
            elif cmd == "JOIN":
                result = await gl_join_conn(member_info.MEMBER_HOST, member_info.MEMBER_PORT)
            else:
                raise HTTPException(status_code=400, detail="Invalid command")

            current_status = await get_member_status(member_name, member_info.MEMBER_HOST, member_info.MEMBER_PORT) if result == "SUCCESS" else "INACTIVE"
            return {
                "member_name": member_name,
                "cmd": cmd,
                "result": result,
                "current_status": current_status
            }
    raise HTTPException(status_code=404, detail="Member not found")
