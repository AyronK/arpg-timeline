export const withTimeout = async <T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), timeout),
  );
  return Promise.race([promise, timeoutPromise]);
};

