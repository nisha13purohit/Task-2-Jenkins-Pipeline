# Jenkins CI/CD Pipeline for a Node.js App

A simple CI/CD pipeline built with Jenkins and Docker. The pipeline is defined in a `Jenkinsfile` and automatically builds, tests, containerizes and deploys a Node.js application.

## Objective

Set up a basic Jenkins pipeline to automate building and deploying an application.

**Deliverable:** a `Jenkinsfile` that builds and deploys the app.

## Tools Used

- Jenkins
- Docker
- Node.js 18
- Git and GitHub

## Pipeline Stages

1. **Checkout**: pulls the latest code from the repository.
2. **Install & Test**: runs `npm install` and `npm test` inside a temporary `node:18-alpine` container.
3. **Build Docker Image**: builds the image and tags it with the build number and `latest`.
4. **Deploy**: stops and removes the old container, then starts the new one on port 3000.
5. **Verify**: checks that the app responds using `curl`; the build fails if it does not.

After every run, the pipeline reports success or failure and removes unused Docker images.

## Project Structure

```
.
├── Jenkinsfile      # Pipeline definition
├── Dockerfile       # Builds the application image
├── .dockerignore    # Files excluded from the image
├── package.json     # Dependencies and scripts
└── <app source files>
```

## Prerequisites

- Docker Desktop installed and running
- Git installed
- Ports 8080 (Jenkins) and 3000 (app) free

## Setup and Run

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

**2. Start Jenkins in Docker**

```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -u root jenkins/jenkins:lts
```

**3. Install the Docker CLI and curl inside Jenkins**

```bash
docker exec jenkins sh -c "apt-get update && apt-get install -y docker.io curl"
```

**4. Configure Jenkins**

1. Get the initial password with `docker logs jenkins`.
2. Open `http://localhost:8080` and paste the password.
3. Install the suggested plugins and create an admin user.
4. Install the **Docker Pipeline** plugin (Manage Jenkins > Plugins > Available plugins).

**5. Create the pipeline job**

1. New Item > enter a name > select **Pipeline** > OK.
2. Under Pipeline, set:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: your repository URL
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
3. Save, then click **Build Now**.

## Verify the Deployment

A successful build ends with `Finished: SUCCESS` in the Console Output. Then check:

```bash
docker ps
curl http://localhost:3000
```

Or open `http://localhost:3000` in a browser.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `docker: command not found` in the build log | Install the Docker CLI inside Jenkins (step 3) |
| `permission denied` on the Docker socket | Start Jenkins with `-u root` and the socket mount |
| Checkout fails | Check the repository URL and branch name |
| `port is already allocated` | Stop the container using the port, or change `APP_PORT` in the `Jenkinsfile` |
| Verify stage fails | Run `docker logs nodejs-demo-app` and check the app's port |

## Note

Mounting `/var/run/docker.sock` gives Jenkins control over the host's Docker engine. This is fine for learning, but not recommended for production.

## Author

Nisha Purohit