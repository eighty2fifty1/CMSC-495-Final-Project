# Running the Application in PyCharm

Follow these steps within PyCharm to pull the latest changes from the `mike/building-backend-stuff` branch, set up your environment, and run the application.

## Step 1: Pull from GitHub

1. **Open PyCharm** and navigate to the GitHub project you've already checked out.

2. **Switch to the desired branch** by going to `VCS` > `Git` > `Branches`, then under `Remote Branches`, find `mike/building-backend-stuff`, right-click it, and choose `Checkout`.

3. **Update your local copy** of the branch by selecting `VCS` > `Update Project` or by using `VCS` > `Git` > `Pull`.

## Step 2: Set Up the Virtual Environment

1. **Open the PyCharm Terminal** (usually located at the bottom).

2. **Navigate to your project root directory**.

3. **Create the virtual environment** by running:
   ```bash
   python -m venv venv

Activate the virtual environment:
    
    'venv\Scripts\activate'

## Step 3: Install Dependencies in the Terminal
    'pip install -r requirements.txt'
## Step 4: Run the Application in the Terminal
    'python app.py'