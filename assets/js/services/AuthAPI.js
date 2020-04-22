import Axios from "axios";
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "../config";

// Déconnexion (Suppression du token du localStorage et sur Axios)
function logout() {
    window.localStorage.removeItem("authToken");
    delete Axios.defaults.headers["Authorization"];
}

// Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
function authenticate(credentials) {
    return Axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            /* On prévient Axios qu'on a maintenant un header par défaut sur toutes
            nos futures requêtes HTTP */
            setAxiosToken(token);

            return true;
        });
}

// Positionne le token JWT sur Axios
function setAxiosToken(token) {
    Axios.defaults.headers["Authorization"] = "Bearer " + token;
}

// Mis en place du token lors du chargement de l'application
function setUp() {
    // 1. Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);
            console.log("Connexion établie avec axios");
        }
    }
    // Donner le token a Axios
}

// Pour savoir si on est authentifié ou pas
function isAuthenticated() {
    // 1. Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setUp,
    isAuthenticated
}