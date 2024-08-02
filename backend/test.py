import sys
from mDbHandle import *

# Example usage
if __name__ == '__main__':
    ver=sys.argv[1]
    # DSN=sys.argv[1]
    # ID=sys.argv[2]
    # PWD=sys.argv[3]
    if ver == "21c":
        gl_21c_Shutdown()
    elif ver == "24c":
        gl_24c_Shutdown()
    else :
        pass
