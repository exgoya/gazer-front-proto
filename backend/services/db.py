import asyncio
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select
from models import DBACluster, GVClusterMember
from database import session_manager
from utils import logger  # logger 가져오기

async def get_member_status(member):
    # await asyncio.sleep(3)
    try:
        session = session_manager.get_session(member.MEMBER_HOST, member.MEMBER_PORT)
        query = (
            select(DBACluster.MEMBER_NAME, GVClusterMember.STATUS)
            .join(DBACluster, GVClusterMember.MEMBER_ID == DBACluster.MEMBER_ID)
            .where(DBACluster.MEMBER_NAME == member.MEMBER_NAME)
        )
        rows = session.execute(query).fetchall()
        session.close()
        if rows:
            return rows[0].STATUS
    except SQLAlchemyError as e:
        logger.error(f"Database query error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
    return "UNKNOWN"