type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

/**
 * DEMO CODE - For demonstration purposes only
 * This is just an example and not related to actual application
 */
async function doMath() {
  const value = Math.random();

  if (value > 0.5) throw new Error("Random number is greater than 0.5");

  return value;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function demo() {
  const { data: someData, error: someError } = await tryCatch(doMath());

  if (someError) return { error: "unable to process" };

  const { data: moreDate, error: moreError } = await tryCatch(doMath());

  if (moreError) return { error: "unable to process" };

  return someData + moreDate; // this two variables are guaranteed to be not null
}
