
export function generateFriendCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'; //혼동되는 문자(O, 0, 1, I) 제외
    const codeLength = 8;
    let friendCode = '';

    for (let i = 0; i < codeLength; i++) {
        const randomindex = Math.floor(Math.random() * characters.length);
        friendCode += characters.charAt(randomindex);
    }

    return friendCode;
}