'use server'
 
export async function checkPassword(lockId: number, crypt: string) {

    const crypts :  Record<number, string>=  {
        1: '1987892',
        2: '5678903',
        3: '1234567',
        4: '097654321'
    }

    if(!crypt || !lockId || !crypts[lockId]) return;

    if (crypts[lockId] === crypt) {
        // Validate the lock submission
    }

    // Code is wrong
}