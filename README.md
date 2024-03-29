# jobdash
Job search tracking and insights web app

# Stack
- Front-End
  - React app built with Next.js framework
  - TypeScript
  - TanStack Query
  - React Hook Forms
  - Material UI
- Back-End
  - Python with Flask framework
  - PostgreSQL database
  - Redis for session storage

# Context
This is a personal project that I have been working on in between employment. The purpose of this was to familiarize myself with other industry-standard technologies such as TypeScript, Next.js, Python, Flask, TanStack Query (fka React Query), React Hook Forms, Moment, and Material UI. While working at Meta, I used a very proprietary tech stack outside of React and GraphQL, so I took this chance to explore other languages, frameworks, and libraries. 

# Screenshots of current functionality
![The main page - job pipeline dashboard](https://github.com/nicole-nguyen1/jobdash/assets/26987953/d591ef26-a32b-4515-a39f-d44515bc80d5)

![Job details with timeline](https://github.com/nicole-nguyen1/jobdash/assets/26987953/a76c3a74-cd3d-428e-bf5b-7ec6ef6578c3)

# Current features
- Authentication flow: server-side HTTP-only cookie for session management, stored in Redis
- Job pipeline dashboard:
  - Add job listing (upon adding, the dashboard updates)
  - View each job listing
  - Archive or delete job listing when hovering over job card
- Job listing details
  - Saved info is prepopulated into fields
  - Edit job listing detail fields or cancel changes
  - Add, modify, or delete timeline events
 
# Future features
- Import job listing details by URL (using either free APIs or web scraping)
- Chrome extension to add to dashboard from job listing URL and auto-fill applications
- Job search metrics dashboard
- AI Resume Builder


