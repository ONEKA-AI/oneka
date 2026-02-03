# Virtual Environment (venv)

This folder contains the Python virtual environment for the ONEKA AI project.

## Purpose
- Isolates Python dependencies from the system Python.
- Ensures reproducible package versions for all team members.

## Setup
1. From the project root, create the virtual environment:  
   ```bash
   python3 -m venv venv
Activate the environment:

source venv/bin/activate   # Linux / Mac
# or
venv\Scripts\activate      # Windows
Install project dependencies:

pip install -r requirements.txt
