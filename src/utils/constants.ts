export const GENERATE_STRING = (length: number) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export const GENERATE_OTP_CODE = (length = 4) => {
    const chars = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return `B-${result}`;
}

export const GENERATE_RANDOM_PASSWORD = (length=14) => {
    var alphabet = [
        'abcdefghijklmnoqrstuvwxyz',
        'ABCDEFGHIJKLMNOQRSTUVWXYZ',
        '0123456789',
        '?<>!"£$%^&*()-+./'
    ];
      
    let password = '';
       
    for (var i = 0; i < length; i++) {
        var subset = alphabet[i%4];
        password += subset[Math.floor(Math.random() * subset.length)]
    }
    return password;
}

export const TODAYS_DATE = () => {
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}

export const TODAYS_DAY = () => {
    var today = new Date();
    var date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    var dateTime = date.toString();
    return dateTime;
}

export const CURRENCY_INFO = (country: string) => {
    switch (country) {
        case 'Nigeria': 
            return {'currency': 'ngn', 'min': 50}
        case 'UK':
            return {'currency': 'pounds', 'min': 5}
        default:
            return {'currency': 'pounds', 'min': 5}
    }
}

export const INVITE_STATUS = [
    "accept",
    "decline"
]

export const STRING_INJECT = (str: any, arr: any) => {
    if (typeof str !== 'string' || !(arr instanceof Array)) {
        return false;
    }
    return str.replace(/({\d})/g, function(i) {
        return arr[i.replace(/{/, '').replace(/}/, '')];
    });
}
