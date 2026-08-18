import { SERVICE_STATUSES } from "../kadesh/consts.js";

export const calculateServiceStatus = (korech) => {
    let status = SERVICE_STATUSES.CLEAR;
    if (korech.altar.content.trim().length) status = SERVICE_STATUSES.ACTIVE;
    else if (korech.altar.sides.east.trim().length) status = SERVICE_STATUSES.PENDING_CLEARANCE;
    return {
        serviceStatus: status,
        lastServiceAt: new Date().toISOString()
    }
};  