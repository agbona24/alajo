# Authenticating requests

To authenticate requests, include an **`Authorization`** header with the value **`"Bearer {YOUR_BEARER_TOKEN}"`**.

All authenticated endpoints are marked with a `requires authentication` badge in the documentation below.

    To authenticate requests, include an **Authorization** header with your Bearer token:

    `Authorization: Bearer {YOUR_BEARER_TOKEN}`

    To get your token:
    1. Call the **POST /api/login** endpoint with your email/phone and password
    2. Copy the `token` from the response
    3. Use this token in the Authorization header for subsequent requests
