# FYI

Virtual Environment Name used: maVenv


## Render (for hosting) Tips:
- Make an account (use personal for now, not sure if we're going to keep Render as the main host for the future)
- Make a new project
- Link with Public Github Repo (link with the branch you want to test)
- In settings, make sure the main repo is: https://github.com/shriya77/Materna-app ; branch is: <the branch you want to deploy, should show up as an option>
- In settings, set root directory to "backend"
- In settings, set the build command (should be preceded by "backend") to be:
```bash
  python -m venv maVenv && pip install -r requirements.txt
  ```
- In settings, set the start command (should also be preceded by "backend") to be:
   ```bash
  python manage.py runserver 0.0.0.0:8000
  ```
- At this point, check if logs print out any errors, and if not, click the link at the top left under the github repo to go to the site.
