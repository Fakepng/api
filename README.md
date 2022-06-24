# Rolling jwt (version 0)

> Api with middleware and Rolling jwt

## Step 0: Create a new user once only

> https://bestapi.fakepng.com/create

body json

```json
{
	"username": "username" // your username here
}
```

result is

```json
{
	"token": "token" // your token here keep this token
}
```

## Step 1: Login with your name

> https://bestapi.fakepng.com/login

body json

```json
{
	"username": "username" // your username here
}
```

result is

```json
{
	"token": "token" // your token here keep this token
}
```

## Step 2: Using your token

> https://bestapi.fakepng.com/api

auth with bearer token

result is

```json
{
	"message": "welcome user",
	"token": "token" // your token here keep this token
}
```
