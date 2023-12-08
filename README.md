# Nest auth app

## Usage

create .env in the project root with your variables (example is in .env.example)
install packages:

```bash
npm install --legacy-peer-deps
```

Run project:

```bash
npm run start:dev
```

## Usage with docker-compose

run containers:

```bash
docker-compose up -d
```

# How to curl

Sign up with your data

```bash
curl --location 'http://localhost:9111/sign-up' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "your_fake_mail@gmail.com",
    "firstName": "Jose",
    "lastName": "Diaz",
    "password": "ssAaaa283Xoo10d"
}'
```

Get the access token

```bash
curl --location 'http://localhost:9111/sign-in' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "your_fake_mail@gmail.com",
    "password": "ssAaaa283Xoo10d"
}'
```

Now you can access protected resources (user account data) with just received token

```bash
curl --location 'http://localhost:9111/me' \
--header 'Authorization: Bearer <your_access_token_here>'
```

Log out endpoint usage:

```bash
curl --location --request POST 'http://localhost:9111/sign-out' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_access_token_here>'
```
