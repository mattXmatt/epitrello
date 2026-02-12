export interface userConnectionDTO {
    id: number,
    userId: number,
    provider: string,
    providerAccountId: string,
    accessToken?: string,
    refreshToken?: string,
    expiresAt?: Date,
    scope?: string,
    tokenType?: string
}

export interface createUserConnectionDTO {
    userId: number,
    provider: string,
    providerAccountId: string,
    accessToken?: string,
    refreshToken?: string,
    expiresAt?: Date,
    scope?: string,
    tokenType?: string
}

export interface updateUserConnectionDTO {
    accessToken?: string,
    refreshToken?: string,
    expiresAt?: Date,
    scope?: string,
    tokenType?: string
}

export interface userConnectionResponseDTO {
    success: boolean,
    message?: string,
    result?: userConnectionDTO | userConnectionDTO[]
}