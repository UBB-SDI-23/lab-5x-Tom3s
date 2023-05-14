import { Supplier } from "./entities";

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

function verifyUserDetails(user: UserDetails): void {
    function checkEmpty(obj: any): void {
        var emptyFields = [];
        if (obj.email === undefined || obj.email === null || obj.email === "") {
            emptyFields.push("email");
        }
        if (obj.birthday === undefined || obj.birthday === null || obj.birthday === "") {
            emptyFields.push("birthday");
        }
        if (obj.gender === undefined || obj.gender === null || obj.gender === "") {
            emptyFields.push("gender")
        }
        if (obj.nickname === undefined || obj.nickname === null || obj.nickname === "") {
            emptyFields.push("nickname");
        }
        if (obj.eyecolor === undefined || obj.eyecolor === null || obj.eyecolor === "") {
            emptyFields.push("eyecolor");
        }
        if (emptyFields.length > 0) {
            throw new Error("When updating user details, please specify: " + emptyFields.join(", "));
        }
    }

    function validateBirthday(birthday: string): void {
        const birthdayRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
        if (!birthdayRegex.test(birthday)) {
            throw new Error("Birthday must be in the format YYYY-MM-DD");
        }
    }

    function validateFields (obj: any) {
        Supplier.validateEmail(obj);
        validateBirthday(obj.birthday);
    }

    checkEmpty(user);
    validateFields(user);
}

interface Token {
    id: number;
    token: string;
    date: Date;
}

interface SessionDetails {
    userid: number;
    username: string;
    role: string;
    logindate: number;
}

export type { UserCredentials, UserDetails, Token, SessionDetails};
export { verifyUserDetails };