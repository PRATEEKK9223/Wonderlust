# Wonderlust

Wonderlust is an **Airbnb clone / rental-booking demo project** built with Node.js, Express, MongoDB, and EJS.  
It recreates core features like listing properties, viewing details, user sessions, and more.

------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 🛠️ Tech Stack

- **Node.js** & **Express** for backend  
- **MongoDB** for the database  
- **EJS** (Embedded JavaScript) for server-side templating  
- **HTML / CSS / JavaScript** for frontend  
- Additional utilities / middleware (check `package.json`)  

--------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 🚀 Features

- Browse property listings  
- Property detail pages  
- (Demo) user authentication / sessions  
- Responsive UI  
- Basic server routing, views, and data modeling  
- (Optional) utility / middleware features  

------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 📁 Project Structure

Wonderlust/
├── app.js
├── package.json
├── package-lock.json
├── routes/
│ └── … your route files
├── views/
│ └── … EJS templates (pages, partials)
├── public/
│ └── … static assets (CSS, images, JS)
├── models/
│ └── … MongoDB models / schemas
├── utils/
│ └── … helper functions
├── middlewares.js
└── README.md



- **app.js** — main server entry  
- **routes/** — route handlers (e.g. for pages, APIs)  
- **models/** — Mongoose schemas  
- **views/** — EJS templates for front end  
- **public/** — CSS, client JS, images, static files  
- **middlewares.js** / **utils/** — helper & middleware logic  

------------------------------------------------------------------------------------------------------------------------------------------------------------------

## ▶️ Getting Started (Local Setup)

1. **Clone the repo**  
   ```bash
   git clone https://github.com/PRATEEKK9223/Wonderlust.git
   cd Wonderlust2
   
2.  Install dependencies
    npm install
    
3.Set up environment variables
  MONGODB_URI = your_mongodb_connection_string
  SESSION_SECRET = a_secret_string
  PORT = 3000
  
4.Run the application
  npm start
  
Then open http://localhost:3000 in your browser.

