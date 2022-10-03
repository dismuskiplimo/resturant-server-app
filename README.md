# Capstone: Restaurant Reservation System

This is an app designed to aide restaurants in managing and seating reservations on location. The user can view the reservations for each day from the dashboard. From there, the user can seat, cancel, and edit reservations. Additionally, the user can manage the status of the tables from the dashboard as well by finishing a table when it is ready for new guests. On the search page, a user can look up reservations by partial phone numbers regardless of the date. When Seating a table, the user is required to select a table which is then verified for availability and capacity. Another option available to the user is to create additional reservations and tables in which all input is validated. 


---
## Link
[Live page](https://boterf-reservations-client.herokuapp.com/dashboard)


---
## Technologies
 
 * PostgreSQL
 * ElephantSQL
 * Knex
 * Node.js
 * Express
 * React
 * Javascript
 * Bootstrap
 * CSS
 * HTML
 */
---


## API Documentaion

| Verb   | URL                                      | Action	                                       |
| ------ | ---------------------------------------- | -----------                                     | 
| GET    | /reservations                            | list reservations                               |
| GET    | /reservations?date=XXXX-XX-XX            | list reservations for date                       |
| GET    | /reservations?mobile_number=XXX-XXX-XXXX | list reservations for phone number               |
| POST   | /reservations                            | create new reservation                           |
| GET    | /reservations/{reservationId}            | find reservation by Id                           |
| PUT    | /reservations/{reservationId}            | update reservation by Id                         |
| PUT    | /reservations/{reservationId}/status     | update status of reservation                     |
| GET    | /tables                                  | list tables                                     |
| POST   | /tables                                  | create new table                                 |
| PUT    | /tables/{tableId}/seat                   | updates status of table and reservation |
| DELETE | /tables/{tableId}/seat                   | updates status of table and reservation |


## Installation

1. Fork and clone this repository.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

If you have trouble getting the server to run, reach out for assistance.


### Screenshots

/dashboard

![dashboard](https://user-images.githubusercontent.com/85326605/150658794-398f20ea-d9f5-442b-be4e-a1a9854e5292.jpeg)

/reservations/new

![new reservation](https://user-images.githubusercontent.com/85326605/150658820-22a77cd0-1c25-4d59-b185-e710e3abc2f1.jpeg)

/reservations/{resId}/seat
![seat reservation](https://user-images.githubusercontent.com/85326605/150658864-5b229e40-02b6-4aea-8d8d-39e78b82cf40.jpeg)

After seating a resevation, the status of both the reservation and table update

![after seating reservation](https://user-images.githubusercontent.com/85326605/150658909-6cf3eb60-170c-49bf-9837-ca6903e45955.jpeg)

When finishing a reservation, the table status is set to free and the reservation is removed from the dashboard

![finishing reservation](https://user-images.githubusercontent.com/85326605/150658929-9cb657ce-791f-40ae-b14c-de475be335d7.jpeg)

![after finishing table](https://user-images.githubusercontent.com/85326605/150658946-063e9164-34b7-4510-aebf-502efcca675b.jpeg)

/search

![search for reservation](https://user-images.githubusercontent.com/85326605/150659036-960384b8-3ebc-45b3-bb78-0e805a3c1f11.jpeg)

/tables/new

![new table](https://user-images.githubusercontent.com/85326605/150659047-ecd4ee74-2bff-4564-93b7-1c411f1fac3e.jpeg)




