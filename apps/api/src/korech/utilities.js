// maybe move 
const STATUSES = {
    ACTIVE: "ACTIVE",
    CLEAR: "CLEAR", 
    PENDING_CLEARANCE: "PENDING-CLEARANCE"
};

export const calculateServiceStatus = (korech) => {
    let status = STATUSES.CLEAR;
    if (korech.altar.content.trim().length) status = STATUSES.ACTIVE;
    else if (korech.altar.sides.east.trim().length) status = STATUSES.PENDING_CLEARANCE; 
    return {
        serviceStatus: status,
        lastServiceAt: new Date().toISOString()
    }
};