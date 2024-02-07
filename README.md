# A web Angular app.

## 1. Introduction
### Why?
I worked on this project during a mandatory internship at the end of my 1st year of Bachelor in Computer Science and Cursus Master en Ingénierie Informatique Systèmes et Réseaux (Master in Engineering in Computer Science, Systems and Networks) at the University of Strasbourg.

### Where?
I did the internship in a fintech company in the Republic of Moldova, called paynet (https://paynet.md/en). Their main app does all that Revolut does, but on top of that they facilitate a lot of banking operations by digitalizing paying one's bills like gas, electricity, water or tickets (speeding), and so much more in one single app. Why is this interesting? In Moldova not every business allows online payments. So, paynet acts as a digital bridge between the clients and the business.

### How long?
The internship was 1 month long.

## 2. The Angular web app
The app is called "pear". (Why? I went from "Apple" to another fruit).

### Goals at the beginning (I did some extras)
1. Create a user creation, log in and reset password views (with form validation, also allow the user to log out).
2. Create a Dashboard view.
3. Develop widgets for the Dashboard view.
4. Implement a CRUD supporting interface with a database:
   - load user specific widgets on user log in.
   - let the user modify, create, update, and delete widgets.
   - let the user modify his account data : mail, password, profile photo.
5. Set up correct Angular view routing (separate public/external access route and admin/internal route)
6. Familiarize with a version control system.
7. Learn / discover how to make calls to an API (REST API, endpoints)

### Tools
This was the first time I heard of "npm".
For the database I decided to use Firebase Cloud Firestore.
In the beginning the user password was stored in the database, but I ended up using Firebase Auth (more details later).
As this was my first year of bachelor, and I had never done a project of this size or used Angular before, my internship supervisor suggested that I start with a CoreUI template. Looking back, this was a right decision. To start from an empty Angular project would have been too long to manage to complete the goals we set in a month (since I was a total beginner).

### Communicating with the internship supervisor
Usually, I would discuss with my internship supervisor, every day, 30-45 minutes before the end of the day. We would check on the progress, and that allowed me to ask questions and sometimes for direction. I could still communicate with him during the day, as we were in the same room and he was at a desk right behind me ;).
