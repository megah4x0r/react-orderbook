export type UseGeneratorQueuePayload<T> = T[];

export type UseGeneratorQueueDispatch<T> = (
  payload: UseGeneratorQueuePayload<T>,
) => void;

export type GetSingleUpdateFunction<T> = () => Iterable<T | undefined>;

export interface UseGeneratorQueueReturn<T> {
  dispatchFromQ: UseGeneratorQueueDispatch<T>;
  consumeQ: GetSingleUpdateFunction<T>;
}
