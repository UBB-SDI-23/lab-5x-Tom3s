interface UserCredentials {
    username: string;
    password: string;
}

interface UserDetails {
    userid: string;
    username: string;
    email: string;
    birthday: Date;
    gender: string;
    nickname: string;
    eyecolor: string;
    boxes?: number[];
    wrappers?: number[];
    suppliers?: number[];
    combos?: number[];
}

interface Token {
    id: number;
    token: string;
    date: Date;
}

export type { UserCredentials, UserDetails, Token };