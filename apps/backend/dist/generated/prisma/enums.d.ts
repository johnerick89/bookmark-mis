export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly PENDING: "PENDING";
    readonly BLOCKED: "BLOCKED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
