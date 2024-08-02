# run
python3 -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  

# run test
uvicorn main:app --reload --host=0.0.0.0

# Project Structure

```plaintext
.
├── README.md
├── api
│   ├── __init__.py
│   ├── routes.py
│   └── status.py
├── config.json
├── config.py
├── config_test.json
├── cpu_utils.py
├── database.py
├── glShutdown.py
├── mDbHandle.py
├── main.py
├── main_test\ copy.py
├── main_test.py
├── models.py
├── requirements.txt
├── services
│   ├── __init__.py
│   ├── commands.py
│   ├── cpu.py
│   ├── db.py
│   ├── memory.py
│   └── stat.py
├── test.py
└── utils.py
