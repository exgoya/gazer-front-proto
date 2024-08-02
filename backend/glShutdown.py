import pygoldilocks

def gl_shutdown_abort(connection):
    cursor = None
    errFlag = 1

    try:
        cursor = connection.cursor()
        cursor.execute("ALTER SYSTEM CLOSE DATABASE ABORT")
        errFlag = 0

    except pygoldilocks.Error as ex:
        if errFlag == 1:
            print("Error at Shutdown")
        else:
            print(ex)

    finally:
        if cursor:
            cursor.close()
        else:
            pass

    if errFlag == 0:
        return "SUCCESS"
    else:
        return "FAILURE"
    
