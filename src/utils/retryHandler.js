export async function withRetry(fn, options = {}) {
  const { maxRetries = 3, delay = 500, retryableErrors = ['LOCK_DEADLOCK', 'LOCK_WAIT_TIMEOUT'] } = options;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      const isRetryable = retryableErrors.some(code => error.code === code || error.message.includes(code));
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      console.warn(`[RetryHandler] Attempt ${attempt} failed. Retrying in ${delay}ms... (Error: ${error.code})`);
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}
