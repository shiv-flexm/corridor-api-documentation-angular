export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HeaderParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface QueryParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface StatusCode {
  code: number;
  label: string;
  description: string;
}

export interface Endpoint {
  id: string;
  name: string;
  method: HttpMethod;
  route: string;
  description: string;
  requiresAuth: boolean;
  versions: string[];
  headers: HeaderParam[];
  queryParams: QueryParam[];
  requestBody?: Record<string, unknown>;
  successResponse: Record<string, unknown>;
  errorResponse: Record<string, unknown>;
  statusCodes: StatusCode[];
}

export interface ApiModule {
  id: string;
  name: string;
  tagline: string;
  endpoints: Endpoint[];
}

export const API_MODULES: ApiModule[] = [
  {
    id: 'users',
    name: 'Users',
    tagline: 'Identity, profile & session primitives',
    endpoints: [
      {
        id: 'list-users',
        name: 'List Users',
        method: 'GET',
        route: '/api/v1/users',
        description:
          'Returns a paginated list of users in your workspace. Supports filtering by role, status, and search query. Use cursor-based pagination for best performance on large datasets.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [
          { name: 'Authorization', type: 'string', required: true, description: 'Bearer token for the authenticated workspace.', example: 'Bearer sk_live_••••' },
          { name: 'X-Workspace-Id', type: 'string', required: false, description: 'Scope the request to a specific workspace.', example: 'ws_8f12…' }
        ],
        queryParams: [
          { name: 'limit', type: 'integer', required: false, description: 'Maximum number of records to return. Default 25, max 100.', example: '50' },
          { name: 'cursor', type: 'string', required: false, description: 'Opaque cursor returned by a previous call.', example: 'eyJpZCI6Im…' },
          { name: 'role', type: 'string', required: false, description: 'Filter by role. One of `admin`, `member`, `viewer`.', example: 'member' },
          { name: 'q', type: 'string', required: false, description: 'Fuzzy search against name and email.', example: 'ada' }
        ],
        successResponse: {
          object: 'list',
          has_more: true,
          next_cursor: 'eyJpZCI6InVzcl8yMjEifQ',
          data: [
            { id: 'usr_9f2c', email: 'ada@relay.dev', name: 'Ada Lovelace', role: 'admin', created_at: '2026-01-12T10:04:21Z' },
            { id: 'usr_9f2d', email: 'linus@relay.dev', name: 'Linus Tor', role: 'member', created_at: '2026-01-18T08:44:09Z' }
          ]
        },
        errorResponse: {
          error: {
            type: 'invalid_request_error',
            code: 'missing_authorization',
            message: 'No API key provided. Include a Bearer token in the Authorization header.',
            doc_url: 'https://relay.dev/docs/errors#missing_authorization'
          }
        },
        statusCodes: [
          { code: 200, label: 'OK', description: 'Request succeeded. The response body contains the paginated list.' },
          { code: 401, label: 'Unauthorized', description: 'Missing or invalid API key.' },
          { code: 429, label: 'Too Many Requests', description: 'Rate limit exceeded. Retry after the Retry-After header value.' }
        ]
      },
      {
        id: 'get-user',
        name: 'Retrieve User',
        method: 'GET',
        route: '/api/v1/users/{id}',
        description:
          'Retrieve the details of a single user by ID. Returns profile, role, workspace membership, and session state.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [
          { name: 'Authorization', type: 'string', required: true, description: 'Bearer token for the authenticated workspace.' }
        ],
        queryParams: [
          { name: 'expand', type: 'string[]', required: false, description: 'Optional relations to inline. e.g. `sessions`, `org`.', example: 'sessions' }
        ],
        successResponse: {
          id: 'usr_9f2c',
          email: 'ada@relay.dev',
          name: 'Ada Lovelace',
          role: 'admin',
          created_at: '2026-01-12T10:04:21Z',
          last_seen_at: '2026-02-08T14:09:12Z'
        },
        errorResponse: {
          error: { type: 'invalid_request_error', code: 'resource_missing', message: 'No such user: usr_9f2c' }
        },
        statusCodes: [
          { code: 200, label: 'OK', description: 'User found.' },
          { code: 404, label: 'Not Found', description: 'No user with the given ID.' }
        ]
      },
      {
        id: 'create-user',
        name: 'Create User',
        method: 'POST',
        route: '/api/v1/users',
        description:
          'Provision a new user in your workspace. Sends an invite email if `send_invite` is true. Emits the `user.created` event to subscribed webhooks.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [
          { name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' },
          { name: 'Idempotency-Key', type: 'string', required: false, description: 'Safely retry without creating duplicates.' }
        ],
        queryParams: [],
        requestBody: {
          email: 'grace@relay.dev',
          name: 'Grace Hopper',
          role: 'member',
          send_invite: true,
          metadata: { source: 'onboarding_flow' }
        },
        successResponse: {
          id: 'usr_a8b1', email: 'grace@relay.dev', name: 'Grace Hopper', role: 'member', created_at: '2026-02-10T09:11:02Z'
        },
        errorResponse: {
          error: { type: 'invalid_request_error', code: 'email_taken', message: 'A user with this email already exists.' }
        },
        statusCodes: [
          { code: 201, label: 'Created', description: 'User created successfully.' },
          { code: 409, label: 'Conflict', description: 'Email already in use.' },
          { code: 422, label: 'Unprocessable Entity', description: 'Validation failed.' }
        ]
      },
      {
        id: 'update-user',
        name: 'Update User',
        method: 'PATCH',
        route: '/api/v1/users/{id}',
        description: 'Partially update a user. Only the fields in the request body are modified.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
        queryParams: [],
        requestBody: { role: 'admin', metadata: { promoted_by: 'usr_9f2c' } },
        successResponse: { id: 'usr_a8b1', role: 'admin', updated_at: '2026-02-10T09:22:11Z' },
        errorResponse: { error: { type: 'invalid_request_error', code: 'resource_missing', message: 'No such user.' } },
        statusCodes: [
          { code: 200, label: 'OK', description: 'User updated.' },
          { code: 404, label: 'Not Found', description: 'User does not exist.' }
        ]
      },
      {
        id: 'delete-user',
        name: 'Delete User',
        method: 'DELETE',
        route: '/api/v1/users/{id}',
        description: 'Permanently remove a user and revoke all active sessions. This action is irreversible.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
        queryParams: [],
        successResponse: { id: 'usr_a8b1', deleted: true },
        errorResponse: { error: { type: 'invalid_request_error', code: 'resource_missing', message: 'No such user.' } },
        statusCodes: [
          { code: 200, label: 'OK', description: 'User deleted.' },
          { code: 403, label: 'Forbidden', description: 'The caller is not an admin.' }
        ]
      }
    ]
  },
  {
    id: 'transactions',
    name: 'Transactions',
    tagline: 'Ledger-grade money movement',
    endpoints: [
      {
        id: 'list-transactions',
        name: 'List Transactions',
        method: 'GET',
        route: '/api/v1/transactions',
        description: 'Return transactions ordered by `created_at` descending. Use `status` and date filters for reconciliation workflows.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
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
        queryParams: [],
        requestBody: { amount: 4900, reason: 'customer_request' },
        successResponse: { id: 'rfd_9a', transaction: 'txn_2c', amount: 4900, status: 'posted' },
        errorResponse: { error: { type: 'api_error', code: 'not_refundable', message: 'Transaction is not in a refundable state.' } },
        statusCodes: [
          { code: 201, label: 'Created', description: 'Refund issued.' },
          { code: 409, label: 'Conflict', description: 'Transaction already fully refunded.' }
        ]
      }
    ]
  },
  {
    id: 'auth',
    name: 'Auth',
    tagline: 'Tokens, sessions & OAuth',
    endpoints: [
      {
        id: 'login',
        name: 'Exchange Credentials',
        method: 'POST',
        route: '/api/v1/auth/login',
        description: 'Exchange email + password for a short-lived access token and a long-lived refresh token.',
        requiresAuth: false,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Content-Type', type: 'string', required: true, description: 'application/json' }],
        queryParams: [],
        requestBody: { email: 'ada@relay.dev', password: '••••••••' },
        successResponse: {
          access_token: 'eyJhbGciOi…',
          refresh_token: 'rf_d1e2f3…',
          expires_in: 3600,
          token_type: 'Bearer'
        },
        errorResponse: { error: { type: 'invalid_request_error', code: 'invalid_credentials', message: 'Email or password is incorrect.' } },
        statusCodes: [
          { code: 200, label: 'OK', description: 'Tokens issued.' },
          { code: 401, label: 'Unauthorized', description: 'Invalid credentials.' }
        ]
      },
      {
        id: 'refresh',
        name: 'Refresh Token',
        method: 'POST',
        route: '/api/v1/auth/refresh',
        description: 'Exchange a refresh token for a new access token. Refresh tokens are rotated on every call.',
        requiresAuth: false,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Content-Type', type: 'string', required: true, description: 'application/json' }],
        queryParams: [],
        requestBody: { refresh_token: 'rf_d1e2f3…' },
        successResponse: { access_token: 'eyJhbGciOi…', refresh_token: 'rf_g4h5i6…', expires_in: 3600 },
        errorResponse: { error: { type: 'invalid_request_error', code: 'invalid_refresh_token', message: 'Refresh token is expired or revoked.' } },
        statusCodes: [
          { code: 200, label: 'OK', description: 'New tokens issued.' },
          { code: 401, label: 'Unauthorized', description: 'Refresh token invalid.' }
        ]
      },
      {
        id: 'revoke',
        name: 'Revoke Session',
        method: 'DELETE',
        route: '/api/v1/auth/sessions/{id}',
        description: 'Revokes an active session. Subsequent requests using that token return 401.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
        queryParams: [],
        successResponse: { id: 'ses_0a', revoked: true },
        errorResponse: { error: { type: 'invalid_request_error', code: 'resource_missing', message: 'No such session.' } },
        statusCodes: [
          { code: 200, label: 'OK', description: 'Session revoked.' },
          { code: 404, label: 'Not Found', description: 'Session not found.' }
        ]
      }
    ]
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    tagline: 'Signed events for realtime sync',
    endpoints: [
      {
        id: 'list-webhooks',
        name: 'List Webhooks',
        method: 'GET',
        route: '/api/v1/webhooks',
        description: 'List the webhook endpoints registered for your workspace.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
        queryParams: [],
        successResponse: {
          object: 'list',
          data: [
            { id: 'whk_01', url: 'https://example.com/relay', events: ['user.created', 'transaction.posted'], status: 'active' }
          ]
        },
        errorResponse: { error: { type: 'invalid_request_error', code: 'missing_authorization', message: 'No API key provided.' } },
        statusCodes: [{ code: 200, label: 'OK', description: 'Request succeeded.' }]
      },
      {
        id: 'create-webhook',
        name: 'Register Webhook',
        method: 'POST',
        route: '/api/v1/webhooks',
        description: 'Register a new webhook endpoint. Events are delivered with a signed `Relay-Signature` header.',
        requiresAuth: true,
        versions: ['v1', 'v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
        queryParams: [],
        requestBody: {
          url: 'https://example.com/relay',
          events: ['user.created', 'transaction.posted', 'transaction.refunded'],
          description: 'Production sync endpoint'
        },
        successResponse: { id: 'whk_02', url: 'https://example.com/relay', secret: 'whsec_••••', status: 'active' },
        errorResponse: { error: { type: 'invalid_request_error', code: 'invalid_url', message: 'Webhook URL must use HTTPS.' } },
        statusCodes: [
          { code: 201, label: 'Created', description: 'Webhook registered.' },
          { code: 422, label: 'Unprocessable Entity', description: 'Validation failed.' }
        ]
      },
      {
        id: 'rotate-secret',
        name: 'Rotate Secret',
        method: 'PUT',
        route: '/api/v1/webhooks/{id}/secret',
        description: 'Rotate the signing secret for a webhook. The previous secret remains valid for 24 hours.',
        requiresAuth: true,
        versions: ['v2'],
        headers: [{ name: 'Authorization', type: 'string', required: true, description: 'Bearer token.' }],
        queryParams: [],
        successResponse: { id: 'whk_02', secret: 'whsec_new_••••', rotated_at: '2026-02-10T09:45:00Z' },
        errorResponse: { error: { type: 'invalid_request_error', code: 'resource_missing', message: 'No such webhook.' } },
        statusCodes: [
          { code: 200, label: 'OK', description: 'Secret rotated.' },
          { code: 404, label: 'Not Found', description: 'Webhook not found.' }
        ]
      }
    ]
  }
];
