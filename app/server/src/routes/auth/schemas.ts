export const registerSchema = {
    body: {
        type: 'object',
        required: ['name', 'surname', 'email', 'password'],
        properties: {
            name: { type: 'string' },
            surname: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
        },
    },
};

export const loginSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string' },
            password: { type: 'string' },
        },
    },
};

export const logoutSchema = {};

export const getMeSchema = {};