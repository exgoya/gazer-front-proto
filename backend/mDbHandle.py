import pygoldilocks
from glShutdown import *

# def connection():    
#     conn_str = 'HOST=192.168.0.119;PORT=44444;UID=sys;PWD=gliese as sysdba;'
#     conn = pygoldilocks.connect(conn_str)
#     result = gl_shutdown_abort(conn)
#     print(f'gl_shutdown_abort: {result}')

#     conn.close()

def gl_21c_Shutdown():
    conn_str = 'HOST=192.168.0.119;PORT=44444;UID=sys;PWD=gliese as sysdba;'
    conn = pygoldilocks.connect(conn_str)
    result = gl_shutdown_abort(conn)
    print(f'gl_shutdown_abort: {result}')

    conn.close()


def gl_24c_Shutdown():
    conn_str = 'HOST=192.168.0.79;PORT=11100;UID=sys;PWD=gliese as sysdba;'
    conn = pygoldilocks.connect(conn_str)
    result = gl_shutdown_abort(conn)
    print(f'gl_shutdown_abort: {result}')

    conn.close()