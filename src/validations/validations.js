let required = (properType) => {
    return v => v && v.length > 0 || `Debe ingresar un ${properType}`
}

let requiredObject = (properType)  => {
    return v => v && v !== null || `Debe ingresar un ${properType}`
}

let minLength = (properType,minLength) => {
    return v => v && v.length >= minLength || `${properType} debe tener al menos ${minLength}`
}

let maxLength = (properType,maxLength) => {
    return v => v && v.length <= maxLength || `${properType} debe ser menor que ${maxLength}`
}

let emailFormat = () => {
    // eslint-disable-next-line
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/ 

    return v => v && regex.test(v) || `Debe ingresar un email válido`;
}

let number = (properType) => {
    let regex =  /^[1-9]\d$/ 
    return v => v && regex.test(v) || `${properType} debe ser solo numerico`;
}

let cedula = (properType) => {
    let regex = /^[V|E|J|P][0-9]{5,9}$/ 
    return v => v && regex.test(v) || `${properType} incorrecta`
}

let urlFormat = () => {
    // eslint-disable-next-line
    let regex = /^(http|https)\:\/\/[a-z0-9\.-]+\.[a-z]{2,4}/gi;

    return v => v && regex.test(v) || `Debe ser una URL valida`;
}

let positivo = (properType) => {
    // eslint-disable-next-line
    let regex = /^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/;
    return v => v && regex.test(v) || `${properType} Debe ser mayor a cero`;
}


//incompleto, falta expresion regular para los 4 primeros numeros del telefono
/*let telefonoFormat = () => {
    let regex= aa;
    return v => v && regex.test(v) || `debe ser un telefono válido`;
}*/

export default{
    required,
    requiredObject,
    minLength,
    maxLength,
    emailFormat,
    urlFormat,
    number,
    cedula,
    positivo
}