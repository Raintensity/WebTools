export const zPad = (n: number, l: number) => ([...Array(l)].join("0") + n).slice(-l);
