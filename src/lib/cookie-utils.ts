export const setCookie = (
    cName: string,
    value: string | boolean | number,
    exdays: number
) => {
    const encodedValue = encodeURIComponent(value.toString());

    const exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    const expires = exdays ? `; expires=${exdate.toUTCString()}` : "";

    const domain =
        document.domain === "localhost" ? "" : `; domain=.${document.domain}`;
    const path = "; path=/";

    document.cookie = `${cName}=${encodedValue}${expires}${path}${domain}`;
};

export const deleteCookie = (name: string) => {
    const date = new Date();
    date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
    const expires = "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    const domain =
        document.domain === "localhost" ? "" : `;domain=.${document.domain}`;
    const path = `;path=/${domain}`;
    document.cookie = `${name}=${expires};${domain}; ${path}`;
};

export const getCookie = (cName: string) => {
    if (document.cookie) {
        let i;
        let x;
        let y;
        const ARRcookies = document.cookie.split(";");
        // let returnValueEnc;
        let returnValueDec;
        for (i = 0; i < ARRcookies.length; i++) {
            const [x, y] = ARRcookies[i].split("=").map((s) => s.trim());
            if (x === cName) {
                returnValueDec = decodeURIComponent(y);
                return returnValueDec;
            }
        }
    }
    return undefined;
};

export const checkIfCookieEnabled = () => {
    const cName = "CWTestCookie";
    const testVal = "test";
    setCookie(cName, testVal, 1);

    const cVal = getCookie(cName);

    if (cVal !== testVal) {
        // i.e. cookie disabled
        return false;
    }

    deleteCookie("CWTestCookie");

    // i.e. cookie enabled
    return true;
};
