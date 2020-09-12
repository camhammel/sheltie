import axios from "axios";

let testkey = "OC8uf6jFncZnJPKiEh8JT4o4UMVG6L6ZiLljcIcix2teTjP4im";
let testsecret = "bFj2tH6ky94XyZTzoZFmt7RFX77lPNZ1WsZh9nd5";

let prodkey = "nsXm6KGU9kjoE0RmMA6AKQ619QCPLaw476gllTP0zo7X2hn7s4";
let prodsecret = "hG21DtswYAgt8102n1JzfPtIHIRORqjHQYoYAQ6h";

export default axios.create({
  baseURL: "https://api.petfinder.com/v2/",
});

export function getId() {
  if (__DEV__) {
    return { key: testkey, secret: testsecret };
  } else {
    return { key: prodkey, secret: prodsecret };
  }
}
