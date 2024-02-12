## Introduction
### Why?
I worked on this project during a mandatory internship at the end of my 1st year of Bachelor in Computer Science and Cursus Master en Ingénierie Informatique Systèmes et Réseaux (Master in Engineering in Computer Science, Systems and Networks) at the University of Strasbourg.

Here you can check my presentation for my oral report after the internship : [Soutenance de stage.pdf](https://github.com/lucianmocan/my-first-Angular-app/files/14237628/Soutenance.de.stage.pdf)

### Disclaimer
I did this app when I didn't know much. To the end of the internship I started understanding more, and things became much easier... that's why some functions might definitely seem crazy. (for example the form validation, that I did, it works, but it should be done just a little bit different (making better use of html and classes)).
If you want to see the main dashboard, you'll have to register and confirm it by the email sent to your inbox. PLEASE do not use a personal password (even though Firebase Auth takes care of everything) or an email you're not comfortable disclosing.

### Where?
I did the internship in a fintech company in the Republic of Moldova, called paynet (https://paynet.md/en). Their main app does all that Revolut does, but on top of that they facilitate a lot of banking operations by digitalizing paying one's bills like gas, electricity, water or tickets (speeding), and so much more in one single app. Why is this interesting? In Moldova not every business allows online payments. So, paynet acts as a digital bridge between the clients and the business.

### How long?
The internship was 1 month long.

# The Angular web app
The app is called "pear". (Why? I went from "Apple" to another fruit).

## Description
This was my very first time working with Angular, or with any other framework in general. 

To make sure I have some kind of visible and interesting result at the end, my internship supervisor set out some goals I would have to accomplish.
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


At the start, I spent quite some time trying to understand how Angular works. I did complete the "Tour of Heroes" tutorial available on their website (https://angular.io/tutorial/tour-of-heroes).

#### 1. CoreUI template
  ##### Intro
   I started with an older version CoreUI template (https://github.com/coreui/coreui-free-bootstrap-admin-template). Using a template like this definitely helped me in moving faster towards accomplishing the objectives of the internship. The template wasn't perfect. There were some questionable decisions at times, like everything being in a single container (internal and external available views). However, this allowed me to understand that there are different ways to get to a certain result.
  ##### Views
   This template already had a login view, some error page views and the main dashboard view along with some other things (like chats and navigation, which weren't needed for my project) that I removed. When I say view, I mean just CSS and not working logic, like form validation, or routing, and so on...

#### 2. Firebase 
  ##### Firebase Cloud Firestore
  I had to choose between Cloud Firestore or Realtime Database. I read that Cloud Firestore was the newer implementation, so that's why I went for it. The documentation, at the time, was a little bit sparse, so I had to check some StackOverflow posts made by a Google developer working on Firebase. 
  ##### Firebase Auth
  I used Firebase Auth because, back then, I wasn't exactly sure how to store a user's password correctly... Using Firebase Auth also allowed for an easier implementation of user registration. Upon registering an user would receive an email asking them to confirm their registration. Resetting a forgotten password by sending an email was also done with Google Auth.

#### 3. APIs for widgets
  - For getting data about the stock market (for cryptocoins I used AlphaVantage's free API (https://www.alphavantage.co), for other tickers like AAPL - Polygon's API : https://www.polygon.io).
  - Lastly, I had some widget, displaying the last/latest match a favourite football team has played/will play, the score if the match has already been played, and other interesting data about the match. For this I set up requests to SPORT DATA API (https://sportdataapi.com), which has a free version that allows a certain amount of request per minute (which was enough for the goal of this project).

*EDIT*: Upon checking if the SPORT DATA API still works (2024), I found out the website's home page is still operational but none of the functionalities work... so my football widget is going to be broken, maybe until I find another API and the time to implement it). The same goes for AlphaVantage's API, that always returns "The 25 day limit has been surpassed, even with a new API key. So that's broken as well, needs to be fixed.

  
### Communicating with the internship supervisor
Usually, I would discuss with my internship supervisor, every day, 30-45 minutes before the end of the day. We would check on the progress, and that allowed me to ask questions and sometimes for direction. I could still communicate with him during the day, as we were in the same room and he was at a desk right behind me ;).


