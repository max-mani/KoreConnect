# Deployment Guide for MERN Application

## Backend Deployment (Render)
1. The backend is configured to deploy on Render via the `render.yaml` file
2. Push your code to GitHub
3. Create a new Web Service on Render
4. Connect your GitHub repository
5. Render will automatically use the configuration in `render.yaml`
6. Add environment variables in Render dashboard (copy from your `.env` file)

## Frontend Deployment (Netlify)
1. Push your code to GitHub
2. Log in to Netlify (https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## Important Notes
- The frontend is configured to use the environment variable `VITE_API_URL` for API calls
- The Netlify configuration includes routing for SPA (Single Page Application)
- Make sure CORS is properly configured in the backend for your Netlify domain 