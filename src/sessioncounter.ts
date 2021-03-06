export class SessionCounter {
    private static sessionNum: number = 0

    public static Increment(): void {
        SessionCounter.sessionNum++
    }

    public static Decrement(): void {
        SessionCounter.sessionNum--
    }

    public static Get(): number {
        return SessionCounter.sessionNum
    }
}