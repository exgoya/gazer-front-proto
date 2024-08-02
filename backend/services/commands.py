import asyncssh

async def gl_startup_conn(host: str, port: int):
    async with asyncssh.connect(host, port=port) as conn:
        result = await conn.run('start command', check=True)
        return result.stdout

# gl_shutdown_conn, gl_rebalance_conn, gl_join_conn 함수도 비슷하게 정의
