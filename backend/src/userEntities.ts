interface UserCredentials {
    username: string;
    password: string;
}

interface UserDetails {
    username: string;
    email: string;
    birthday: Date;
    gender: string;
    nickname: string;
    eyecolor: string;
}

interface Token {
    id: number;
    token: string;
    date: Date;
}

export type { UserCredentials, UserDetails, Token };