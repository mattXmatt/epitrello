export interface userDTO {
    id: number,
    name: string,
    surname: string,
    email: string,
    password?: string
}

export interface createUserDTO {
    name?: string,
    surname: string,
    email?: string,
    password?: string
}

export interface updateUserDTO {
    name?: string | undefined,
    surname?: string | undefined,
    email?: string | undefined,
    password?: string | undefined
}

export interface deleteUserDTO {
    id: number
}

export interface userResponseDTO {
    success: boolean,
    message?: string,
    result?: userDTO | userDTO[]
}
