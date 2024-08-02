from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DBACluster(Base):
    __tablename__ = 'DBA_CLUSTER'
    GROUP_ID = Column(Integer, primary_key=True, index=True)
    GROUP_NAME = Column(String, index=True)
    MEMBER_ID = Column(Integer)
    MEMBER_NAME = Column(String)
    MEMBER_HOST = Column(String)
    MEMBER_PORT = Column(Integer)
    MEMBER_POSITION = Column(Integer)

class GVClusterMember(Base):
    __tablename__ = 'GV$CLUSTER_MEMBER'
    MEMBER_ID = Column(Integer, primary_key=True, index=True)
    MEMBER_POSITION = Column(Integer)
    STATUS = Column(String)
    IS_GLOBAL_COORD = Column(Boolean)
    IS_GROUP_COORD = Column(Boolean)
