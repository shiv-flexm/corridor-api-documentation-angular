export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const API_MODULES: any[] = [
  {
    id: 'users',
    name: 'Authentication & Security',
    tagline: 'Identity, profile & session primitives',
    endpoints: [
      {
        id: 'list-users',
        name: 'Authentication Method',
        method: 'POST',
        route: '{{Base URL}}/api/inward/authentication',
        description: `​This API is used to​​authenticate third-party clients​​and generate an​​access token​​that can be used​
​for making authorized requests to other protected endpoints within the FlexM system. The token is​
​issued using a​​Client ID and Client Secret​​.`,
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [],
        queryParams: [],
        responseBody: [
          { field: 'statusCode​', type: '​Integer​', description: '​Response status code' },
          { field: 'message​', type: 'string', description: 'Status message of the request' },
          { field: 'data​', type: '​Object​', description: 'Contains token details' },
          { field: 'access_token​', type: 'string', description: '​The JWT token to be included in the Authorization header of subsequent API calls​' },
          { field: 'token_type​', type: 'string', description: `The token type, usually "Bearer"` },
          { field: 'expires_in​', type: '​Integer​', description: 'Token validity duration in seconds (e.g., 3600 seconds = 1 hour)' },
        ],
        bodyParams: [
          { Parameters: 'clientId​', type: '​String​', IsMandatory: '​yes​', description: '​Unique client identifier assigned to the partner' },
          { Parameters: '​clientSecret​', type: 'string', IsMandatory: '​yes​', description: '​Unique identifier assigned to the business API client' },
        ],
        requestBody: {
          cleintId: 'db2e0456-d599-4553-be1f-730e5f2eb',
          clientSecret: 'ee0f131d-4d2e-43f9-900d-5cdec209',

        },
        successResponse: {
          statusCode: 200,
          message: 'Token generated successfully',
          data: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3LCJjbGllbnRJZCI6Ijk4ODdlNWQ0LWIwNTItNDBjOC1hMDk5LTAwOGM1ZjZkZmYzMyIsIm5hbWUiOiJGbGV4IEJpeiIsImlhdCI6MTc2OTE2MDg5MywiZXhwIjoxNzY5MTY0NDkzfQ.PdQjyR2aT3dKVlXXppPqr_iyLVQSvfwbyabTOy3BK-sk',
            token_type: 'Bearer',
            expires_in: 3600
          }
        },
        errorBody: [
          { field: 'statusCode​', type: '​Integer​', description: 'HTTP status code indicating unauthorized request' },
          { field: 'message​', type: 'string', description: 'Status message of the request' },
          { field: 'error​', type: 'string', description: 'Error type returned by the system' },
        ],
        errorResponse: {
          statusCode: 401,
          message: "Invalid client credentials",
          error: 'Unauthorized'
        },
        statusCodes: [
          { code: 200, label: 'OK', description: 'Request succeeded. The response body contains the paginated list.' },
          { code: 401, label: 'Unauthorized', description: 'Missing or invalid API key.' },
        ]
      },
    ]
  },
  {
    id: 'transactions',
    name: 'API List',
    tagline: 'Ledger-grade money movement',
    endpoints: [
      {
        id: 'list-transactions',
        name: 'Master Codes / Master Data List',
        method: 'GET',
        route: '/api/v1/transactions',
        description: `​This API is used to​​retrieve master/reference data​​from the system, such as Occupation types,​
T
​Industry categories, Country codes, etc., based on a provided master​​
id​
​. This allows clients to​
​dynamically populate dropdowns or static configuration values from the server rather than hardcoding​
​them into their application.`,
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
        bodyParams: [],
        responseBody: [],
        queryParams: [
          { name: 'status', type: 'string', required: false, description: 'One of `pending`, `posted`, `failed`, `refunded`.', example: 'posted' },
          { name: 'created_after', type: 'ISO-8601', required: false, description: 'Lower bound on created_at.', example: '2026-02-01T00:00:00Z' },
          { name: 'limit', type: 'integer', required: false, description: 'Max records. Default 25.', example: '25' }
        ],
        successResponse: {
          object: 'list',
          has_more: false,
          data: [
            { id: 'txn_1a', amount: 12400, currency: 'USD', status: 'posted', created_at: '2026-02-08T11:00:00Z' },
            { id: 'txn_1b', amount: 4800, currency: 'USD', status: 'pending', created_at: '2026-02-08T12:14:55Z' }
          ]
        },
        errorResponse: { error: { type: 'invalid_request_error', code: 'invalid_filter', message: 'Unknown status: archived.' } },
        statusCodes: [
          { code: 200, label: 'OK', description: 'Request succeeded.' },
          { code: 400, label: 'Bad Request', description: 'Invalid filter parameters.' }
        ]
      },
      {
        id: 'create-transaction',
        name: 'Create Transaction',
        method: 'POST',
        route: '/api/v1/transactions',
        description: 'Create an authorized transaction between two accounts. Amounts are always in the smallest currency unit (cents).',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [
          { name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' },
          { name: 'Idempotency-Key', type: 'string', required: false, description: 'Idempotent retry key.' }
        ],
        bodyParams: [],
        responseBody: [],
        queryParams: [],
        requestBody: {
          amount: 9900,
          currency: 'USD',
          source: 'acct_src_01',
          destination: 'acct_dst_02',
          memo: 'February retainer',
          metadata: { invoice: 'inv_2026_02' }
        },
        successResponse: {
          id: 'txn_2c', amount: 9900, currency: 'USD', status: 'posted', created_at: '2026-02-10T09:30:00Z', trace_id: 'trace_5d…'
        },
        errorBody: [],
        errorResponse: { error: { type: 'api_error', code: 'insufficient_funds', message: 'Source account has insufficient balance.' } },
        statusCodes: [
          { code: 201, label: 'Created', description: 'Transaction accepted and posted.' },
          { code: 402, label: 'Payment Required', description: 'Insufficient funds on the source account.' },
          { code: 422, label: 'Unprocessable Entity', description: 'Validation failed.' }
        ]
      },
      {
        id: 'refund-transaction',
        name: 'Refund Transaction',
        method: 'POST',
        route: '/api/v1/transactions/{id}/refund',
        description: 'Reverses a posted transaction. Partial refunds supported via the `amount` field.',
        requiresAuth: true,
        versions: ['v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
        bodyParams: [],
        responseBody: [],
        queryParams: [],
        requestBody: { amount: 4900, reason: 'customer_request' },
        successResponse: { id: 'rfd_9a', transaction: 'txn_2c', amount: 4900, status: 'posted' },
        errorBody: [],
        errorResponse: { error: { type: 'api_error', code: 'not_refundable', message: 'Transaction is not in a refundable state.' } },
        statusCodes: [
          { code: 201, label: 'Created', description: 'Refund issued.' },
          { code: 409, label: 'Conflict', description: 'Transaction already fully refunded.' }
        ]
      }
    ]
  },
];
