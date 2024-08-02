from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

class SessionManager:
    def __init__(self):
        self.engines = {}
        self.sessions = {}

    def get_engine(self, db_host: str, db_port: int):
        key = f"{db_host}:{db_port}"
        if key not in self.engines:
            DATABASE_URL = f"goldilocks://sys:gliese@{db_host}:{db_port}"
            self.engines[key] = create_engine(DATABASE_URL, echo=False)
        return self.engines[key]

    def get_session(self, db_host: str, db_port: int):
        engine = self.get_engine(db_host, db_port)
        Session = sessionmaker(bind=engine)
        return Session()

    def close_sessions(self):
        for session in self.sessions.values():
            session.close()
        self.sessions.clear()

session_manager = SessionManager()
