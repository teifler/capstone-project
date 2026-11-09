import { fn } from 'storybook/test';
import ApiErrorNotice from './ApiErrorNotice.jsx';
import { ApiError } from '../api/errors.js';

export default {
  title: 'Components/ApiErrorNotice',
  component: ApiErrorNotice,
  args: { what: 'the coin list', onRetry: fn() },
};

export const RateLimitedRetrying = {
  args: {
    error: new ApiError('rate-limit', 'HTTP 429', { status: 429 }),
    retryInSeconds: 30,
  },
};

export const Unreachable = {
  args: { error: new ApiError('unreachable', 'Network request failed') },
};

export const Timeout = {
  args: { error: new ApiError('timeout', 'Request timed out') },
};

export const Offline = {
  args: { error: new ApiError('offline', 'Browser is offline') },
};
