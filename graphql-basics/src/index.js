import myLocation, { getGreeting, message, name } from './myModule'
import add, { substract } from './math'

console.log( message )
console.log( name )
console.log( myLocation )
console.log( getGreeting('tecla') )

console.log(add(1, 1))
console.log(substract(1, 1))