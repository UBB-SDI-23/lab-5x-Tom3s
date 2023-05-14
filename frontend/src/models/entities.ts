export interface Box {
    _id: string;
    length: number; 
    width: number;
    height: number; 
    material: string; 
    color: string;
}

export interface Wrapper {
    _id: string;
    length: number;
    width: number;
    pattern: string;
    color: string;
    complementarycolor: string;
}

export interface Supplier {
    _id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    wrappers: string[];
}

export interface WrapperBoxCombo {
    _id: string;
    wrapperId: string;
    boxId: string;
    name: string;
    price: number;
}

export interface ToastDetails {
    message: string;
    type: string;
    duration: number;
}

export interface SessionDetails {
    userid: number;
    username: string;
    role: string;
    sessiontoken: string;
}

export function setLocalSessionDetails(sessionDetails: SessionDetails) {
    const userid = sessionDetails.userid;
    const username = sessionDetails.username;
    const role = sessionDetails.role;
    const sessiontoken = sessionDetails.sessiontoken;

    localStorage.setItem('userid', userid.toString());
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    localStorage.setItem('sessiontoken', sessiontoken);
}

export function destroyLocalSessionDetails() {
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('sessiontoken');
}