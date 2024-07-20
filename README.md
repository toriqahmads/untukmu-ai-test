## Description

This is a project for technical test at Untukmu.AI.
Build with [Nest](https://github.com/nestjs/nest), [SQLite](https://www.sqlite.org) [TypeORM](https://typeorm.io)

## Installation

```bash
$ git clone https://github.com/toriqahmads/untukmu-ai-test
$ cd untukmu-ai-test
$ npm install
$ cp .env.example .env
```

Then configure with your own ENV

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## API Documentation
### HTTP REST API

You can visit http://localhost:${yourport}/api-docs for complete API Documentation (Swagger)

 1. Register
    - METHOD: `POST`
    - URL: `/v1/auth/register`
    - HEADER:
    ```
    Content-Type: application/json
    ```
    - BODY: 
    ```json
    {
      "username": "string",
      "password": "string",
      "referralCode": "string"
    }
    ```
    - RESPONSE:
    ```json
    {
      "code": 201,
      "success": true,
      "message": "success",
      "data": {
        "username": "string",
        "referralCode": "VTICER",
        "referrer": 2,
        "createdAt": "2024-07-20T12:09:29.000Z",
        "updatedAt": "2024-07-20T12:09:29.000Z",
        "deletedAt": null,
        "userId": 4,
        "earnings": 0
      }
    }
    ```
 2. Login
    - METHOD: `POST`
    - URL: `/v1/auth/login`
    - HEADER: 
    ```
    Content-Type: application/json
    ```
    - BODY:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
    - RESPONSE:
    ```json
    {
      "code": 201,
      "success": true,
      "message": "success",
      "data": {
        "user": {
          "createdAt": "2024-07-20T12:09:29.000Z",
          "updatedAt": "2024-07-20T12:09:29.000Z",
          "deletedAt": null,
          "userId": 4,
          "username": "string",
          "referralCode": "VTICER",
          "referrer": 2,
          "earnings": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoidW50dWttdSIsInJlZmVycmFsQ29kZSI6IlZUSUNFUiIsImlhdCI6MTcyMTQ3NzQzMCwiZXhwIjoxNzIxNDg5Nzc1fQ.ng1dy1NbOVLKALnGgACme3wZFUt4knUq_cEs9S7IW3Y",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoidW50dWttdSIsInJlZmVycmFsQ29kZSI6IlZUSUNFUiIsImlhdCI6MTcyMTQ3NzQzMCwiZXhwIjoxNzIxNDg0NjMwfQ.mWe8ZWhGZ14Fjgw3wJ0EanV_TJmCgtFrQfCCQK8tZLo"
      }
    }
    ```

  3. Get USERS
    - METHOD: `GET`
    - URL: `/v1/users`
    - HEADER: 
    ```
    Authorization: Bearer ${token}
    Content-Type: application/json
    ```
    - QUERY:
    ```
    page: number (optional)
    limit: number (optional)
    username: string (optional) username of user
    referralCode: string (optional) referralCode of user
    referredBy: string (optional) username of referrer
    referrerId: number(optional) userId of referrer
    ```
    - RESPONSE:
    ```json
    {
      "code": 200,
      "success": true,
      "message": "success",
      "data": {
        "list": [
          {
            "createdAt": "2024-07-20T06:30:23.000Z",
            "updatedAt": "2024-07-20T07:57:21.000Z",
            "deletedAt": null,
            "userId": 1,
            "username": "toriqahmads",
            "referralCode": "CXYK0A",
            "referrer": null,
            "earnings": 15000
          },
          {
            "createdAt": "2024-07-20T06:47:52.000Z",
            "updatedAt": "2024-07-20T07:57:21.000Z",
            "deletedAt": null,
            "userId": 2,
            "username": "toriq",
            "referralCode": "1LWDIK",
            "referrer": 1,
            "earnings": 40000
          },
          {
            "createdAt": "2024-07-20T07:51:55.000Z",
            "updatedAt": "2024-07-20T07:51:55.000Z",
            "deletedAt": null,
            "userId": 3,
            "username": "tor",
            "referralCode": "R1GQ8J",
            "referrer": 2,
            "earnings": 0
          },
          {
            "createdAt": "2024-07-20T12:09:29.000Z",
            "updatedAt": "2024-07-20T12:09:29.000Z",
            "deletedAt": null,
            "userId": 4,
            "username": "untukmu",
            "referralCode": "VTICER",
            "referrer": 2,
            "earnings": 0
          }
        ],
        "pagination": {
          "total_data": 4,
          "per_page": 25,
          "total_page": 1,
          "current_page": 1,
          "next_page": null,
          "prev_page": null
        }
      }
    }
    ```

  4. Get USER BY ID
    - METHOD: `GET`
    - URL: `/v1/users/${id}`
    - HEADER: 
    ```
    Authorization: Bearer ${token}
    Content-Type: application/json
    ```
    - PARAM:
    ```
    id: userId of user
    ```
    - RESPONSE:
    ```json
    {
      "code": 200,
      "success": true,
      "message": "success",
      "data": {
        "createdAt": "2024-07-20T06:30:23.000Z",
        "updatedAt": "2024-07-20T07:57:21.000Z",
        "deletedAt": null,
        "userId": 1,
        "username": "toriqahmads",
        "referralCode": "CXYK0A",
        "referrer": null,
        "earnings": 15000
      }
    }
    ```

  5. Get Referrals of USER by ID
    - METHOD: `GET`
    - URL: `/v1/users/${id}/referrals`
    - HEADER: 
    ```
    Authorization: Bearer ${token}
    Content-Type: application/json
    ```
     - PARAM:
    ```
    id: userId of user
    ```
    - RESPONSE:
    ```json
    {
      "code": 200,
      "success": true,
      "message": "success",
      "data": {
        "list": [
          {
            "createdAt": "2024-07-20T06:47:52.000Z",
            "updatedAt": "2024-07-20T07:57:21.000Z",
            "deletedAt": null,
            "userId": 2,
            "username": "toriq",
            "referralCode": "1LWDIK",
            "referrer": 1,
            "earnings": 40000
          }
        ],
        "pagination": {
          "total_data": 1,
          "per_page": 25,
          "total_page": 1,
          "current_page": 1,
          "next_page": null,
          "prev_page": null
        }
      }
    }
    ```
  
  6. Create Purchase
    - METHOD: `POST`
    - URL: `/v1/purchases`
    - HEADER: 
    ```
    Authorization: Bearer ${token}
    Content-Type: application/json
    ```
     - BODY:
    ```json
    {
      "amount": "number"
    }
    ```
    - RESPONSE:
    ```json
    {
      "code": 201,
      "success": true,
      "message": "success",
      "data": {
        "amount": 1000,
        "userId": 2,
        "createdAt": "2024-07-20T12:18:25.000Z",
        "updatedAt": "2024-07-20T12:18:25.000Z",
        "deletedAt": null,
        "purchaseId": 4
      }
    }
    ```

7. Get Purchases
    - METHOD: `GET`
    - URL: `/v1/purchases`
    - HEADER: 
    ```
    Authorization: Bearer ${token}
    Content-Type: application/json
    ```
    - QUERY:
    ```
    page: number (optional)
    limit: number (optional)
    userId: number(optional) userId of created purchase
    startRangeAmount: number(optional) start range of amount will filtered
    endRangeAmount: number(optional) end range of amount will filtered
    ```
    - RESPONSE:
    ```json
    {
     "code": 200,
     "success": true,
     "message": "success",
     "data": {
       "list": [
         {
           "createdAt": "2024-07-20T07:53:04.000Z",
           "updatedAt": "2024-07-20T07:53:04.000Z",
           "deletedAt": null,
           "purchaseId": 1,
           "amount": 100000,
           "userId": 3
         },
         {
           "createdAt": "2024-07-20T07:56:53.000Z",
           "updatedAt": "2024-07-20T07:56:53.000Z",
           "deletedAt": null,
           "purchaseId": 2,
           "amount": 100000,
           "userId": 3
         },
         {
           "createdAt": "2024-07-20T07:57:21.000Z",
           "updatedAt": "2024-07-20T07:57:21.000Z",
           "deletedAt": null,
           "purchaseId": 3,
           "amount": 200000,
           "userId": 3
         },
         {
           "createdAt": "2024-07-20T12:18:25.000Z",
           "updatedAt": "2024-07-20T12:18:25.000Z",
           "deletedAt": null,
           "purchaseId": 4,
           "amount": 1000,
           "userId": 2
         }
       ],
       "pagination": {
         "total_data": 4,
         "per_page": 25,
         "total_page": 1,
         "current_page": 1,
         "next_page": null,
         "prev_page": null
       }
     }
   }
    ```