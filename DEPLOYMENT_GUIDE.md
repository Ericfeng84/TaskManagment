# Personal Task Management Assistant - Deployment Guide

## Prerequisites

1. PostgreSQL database (for production)
2. Node.js and npm installed
3. Git repository with your code

## Environment Variables

### Server Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@host:port/database_name"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
CLIENT_URL="https://your-frontend-domain.com"
NODE_ENV="production"
```

### Client Environment Variables

Create a `.env` file in the client directory with the following variable:

```env
REACT_APP_API_URL="https://your-backend-domain.com/api"
```

## Database Setup

1. Create a PostgreSQL database for your application
2. Update the `DATABASE_URL` in your server `.env` file
3. Run database migrations:

```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

## Frontend Deployment (Vercel)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Sign up for a Vercel account at [vercel.com](https://vercel.com)

3. Click "New Project" and import your Git repository

4. Configure the project settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: client
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: client/build

5. Add environment variables:
   - `REACT_APP_API_URL`: Your backend API URL

6. Click "Deploy" to deploy your frontend

## Backend Deployment (Railway)

1. Sign up for a Railway account at [railway.app](https://railway.app)

2. Click "New Project" and select "Deploy from GitHub repo"

3. Choose your repository and configure the project settings:
   - **Root Directory**: server
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret
   - `JWT_EXPIRES_IN`: Token expiration time
   - `PORT`: 5000
   - `CLIENT_URL`: Your frontend URL
   - `NODE_ENV`: production

5. Add a PostgreSQL database service to your project

6. Run database migrations:
   - Go to your service settings
   - Click "Migrations" tab
   - Run the `npx prisma migrate deploy` command

7. Deploy your backend

## Alternative Backend Deployment Options

### Heroku

1. Install the Heroku CLI
2. Create a new Heroku app: `heroku create your-app-name`
3. Add a PostgreSQL addon: `heroku addons:create heroku-postgresql:hobby-dev`
4. Set environment variables: `heroku config:set JWT_SECRET=your-secret`
5. Deploy your code: `git push heroku main`

### DigitalOcean App Platform

1. Create a DigitalOcean account
2. Create a new App
3. Connect your Git repository
4. Configure the build and run settings
5. Add a PostgreSQL database
6. Set environment variables
7. Deploy your application

## Custom Domain Setup (Optional)

### Frontend (Vercel)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Backend (Railway)

1. Go to your project settings in Railway
2. Click "Networking"
3. Add your custom domain
4. Follow the DNS configuration instructions

## SSL/HTTPS

Both Vercel and Railway automatically provide SSL certificates for your applications, so your site will be served over HTTPS by default.

## Monitoring and Logs

### Vercel

- Go to your project dashboard
- Click "Logs" to view deployment and runtime logs
- Use "Analytics" to monitor performance

### Railway

- Go to your project dashboard
- Click "Logs" to view application logs
- Use "Metrics" to monitor resource usage

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify your DATABASE_URL is correct
   - Check if your database is running
   - Ensure your database user has the right permissions

2. **CORS Errors**
   - Make sure your CLIENT_URL is set correctly
   - Verify your CORS configuration in the backend

3. **Authentication Issues**
   - Check if your JWT_SECRET is set
   - Verify your JWT token is being sent correctly

4. **Build Failures**
   - Check your build logs for specific error messages
   - Ensure all dependencies are installed

### Getting Help

- Check the logs in your deployment platform
- Review the documentation for your specific platform
- Test your application locally before deploying

## Post-Deployment Checklist

- [ ] Verify the frontend is accessible
- [ ] Verify the backend API is accessible
- [ ] Test user registration and login
- [ ] Test project creation and management
- [ ] Test task creation and management
- [ ] Check for any console errors
- [ ] Verify all environment variables are set
- [ ] Set up monitoring and alerts
- [ ] Configure backups for your database

## Scaling Considerations

As your application grows, consider:

1. **Database Optimization**
   - Add indexes to frequently queried columns
   - Implement connection pooling
   - Consider read replicas for high traffic

2. **Backend Scaling**
   - Use a load balancer for multiple instances
   - Implement caching with Redis
   - Consider serverless functions for specific endpoints

3. **Frontend Optimization**
   - Implement code splitting
   - Optimize images and assets
   - Use a CDN for static assets

4. **Monitoring**
   - Set up application performance monitoring
   - Implement error tracking
   - Create alerts for critical issues