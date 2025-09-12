export interface afkStatus {
    [index: string]: {
        minutes: number,
        start: Date,
        status: boolean,
        customMessage: string
    }
}

const afkStatus: afkStatus = {};
export default afkStatus;