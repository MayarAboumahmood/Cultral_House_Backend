
CREATE TABLE IF NOT EXISTS admins (

id SERIAL NOT NULL,
admin_name VARCHAR(20),
password VARCHAR(500),
is_super BOOLEAN,
CONSTRAINT admin_pkey PRIMARY KEY(id)

);


CREATE TABLE IF NOT EXISTS customers (

id SERIAL NOT NULL,
first_name VARCHAR(15),
last_name VARCHAR(15),
picture VARCHAR(200),
phone_number VARCHAR(15),
password VARCHAR(500),
birthdate DATE,
CONSTRAINT customer_pkey PRIMARY KEY(id)
);




CREATE TABLE IF NOT EXISTS workers (

id SERIAL NOT NULL,
first_name VARCHAR(15),
last_name VARCHAR(15),
phone_number VARCHAR(15),
email VARCHAR(30),
password VARCHAR(500),
CONSTRAINT worker_pkey PRIMARY KEY(id)
);



CREATE TABLE IF NOT EXISTS events (

id SERIAL NOT NULL,
title VARCHAR(50),
description VARCHAR(500),
tickets_price FLOAT,
available_places INT,
pand_name VARCHAR(30),
begin_date TIMESTAMP,
admin_id INT NOT NULL,
CONSTRAINT event_pkey PRIMARY KEY(id),
CONSTRAINT admin_fkey FOREIGN KEY(admin_id) REFERENCES admins(id)
);

CREATE TABLE IF NOT EXISTS  photos (

id SERIAL NOT NULL,
event_id INT NOT NULL,
picture VARCHAR(200),
CONSTRAINT photo_pkey PRIMARY KEY(id),
CONSTRAINT event_fkey FOREIGN KEY(event_id) REFERENCES events(id)
);



CREATE TABLE IF NOT EXISTS reservations (

id SERIAL NOT NULL,
attendance BOOLEAN,
number_of_places INT,
attendance_number INT,
table_number INT,
customer_name VARCHAR(30),
event_id INT NOT NULL,
customer_id INT NOT NULL,
worker_id INT NOT NULL,
CONSTRAINT reservation_pkey PRIMARY KEY(id),
CONSTRAINT event_fkey FOREIGN KEY(event_id) REFERENCES events(id),
CONSTRAINT customer_fkey FOREIGN KEY(customer_id) REFERENCES customers(id),
CONSTRAINT worker_fkey FOREIGN KEY(worker_id) REFERENCES workers(id)

);


CREATE TABLE IF NOT EXISTS reports (
id SERIAL NOT NULL,
title VARCHAR(20),
description VARCHAR(500),
CONSTRAINT reports_pkey PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS customers_reports(

id SERIAL NOT NULL,
customer_id INT NOT NULL,
report_id INT NOT NULL,
CONSTRAINT customer_report_pkey PRIMARY KEY(id),
CONSTRAINT customer_fkey FOREIGN KEY(customer_id) REFERENCES customers(id),
CONSTRAINT report_fkey FOREIGN KEY(report_id) REFERENCES reports(id)
);

CREATE TABLE IF NOT EXISTS artists(
id SERIAL NOT NULL,
artist_name VARCHAR(20),
description VARCHAR(200),
CONSTRAINT artist_pkey PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS artists_events(
id SERIAL NOT NULL,
artist_id INT NOT NULL,
event_id INT NOT NULL,
cost FLOAT,
CONSTRAINT artist_event_pkey PRIMARY KEY(id),
CONSTRAINT event_fkey FOREIGN KEY(event_id) REFERENCES events(id),
CONSTRAINT artist_fkey FOREIGN KEY(artist_id) REFERENCES artists(id)
);


CREATE TABLE IF NOT EXISTS events_workers(
id SERIAL NOT NULL,
worker_id INT NOT NULL,
event_id INT NOT NULL,
cost FLOAT,
CONSTRAINT event_worker_pkey PRIMARY KEY(id),
CONSTRAINT worker_fkey FOREIGN KEY(worker_id) REFERENCES workers(id),
CONSTRAINT event_fkey FOREIGN KEY(event_id) REFERENCES events(id)
);


CREATE TABLE IF NOT EXISTS orders(
id SERIAL NOT NULL,
event_worker_id INT NOT NULL,
reservation_id INT NOT NULL,
order_date TIMESTAMP,
CONSTRAINT order_pkey PRIMARY KEY(id),
CONSTRAINT event_worker_fkey FOREIGN KEY(event_worker_id) REFERENCES events_workers(id),
CONSTRAINT reservation_fkey FOREIGN KEY(reservation_id) REFERENCES reservations(id)
);


CREATE TABLE IF NOT EXISTS drinks (
id SERIAL NOT NULL,
title VARCHAR(50),
price FLOAT,
description VARCHAR(200),
quantity INT,
cost FLOAT,
CONSTRAINT drink_pkey PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS orders_drinks(
id SERIAL NOT NULL,
drink_id INT NOT NULL,
order_id INT NOT NULL,
quantity INT,
CONSTRAINT order_drink_pkey PRIMARY KEY(id),
CONSTRAINT drink_fkey FOREIGN KEY(drink_id) REFERENCES drinks(id),
CONSTRAINT order_fkey FOREIGN KEY(order_id) REFERENCES orders(id)
);