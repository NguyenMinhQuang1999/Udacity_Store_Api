# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `'products/' [GET]`
- Show `'products/:id' [GET]`
- Create [token required] `'products/' [POST] `
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category) `'getProductByCategory' [GET]`
- Delete `'products/:id' [Delete]`

#### Users
- Index [token required] `'users/' [GET] `
- Show [token required] `'users/:id' [GET] `
- Create N[token required] `'users/' [POST] `
- Create N[token required] `'/users/authenticate' [POST] `
- Delete `'/users/:id' [DELETE]`

#### Orders
- Current Order by user (args: user id)[token required] `'order/orderByUser' [GET] `
- [OPTIONAL] Completed Orders by user (args: user id)[token required] `'orders/completedOrder' [PUT] `
- Index [token required] `'/orders' [GET] `
- Show [token required] `'/orders/:id' [GET] `
- Delete `'/orders/:id' [DELETE]`
- Create N[token required] `'orders' [POST] `

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

```
Table: Product (id:serial[primary key], name:varchar(255)[not null], price:numeric[not null], category:varchar(255))
```

#### User
- id
- firstName
- lastName
- password

```
Table: User (id:serial[primary key], firstName: varchar (255)[not null], lastName:varchar(255)[not null], userName:varchar(255)[not null],
password:varchar(255)[not null])
```

#### Orders
- id
- user_id
- status of order (active or complete)

```
Table: Orders (
id:serial[primary key], 
user_id:integer(foreign key to users table), status:varchar(255))
```

#### order_products
- order_id
- product_id
- quantity


```
Table: Orders (
    id:serial[primary key], product_id:integer(foreign key to products table), quantity:integer[default 1], user_id:integer(foreign key to users table))
```   



