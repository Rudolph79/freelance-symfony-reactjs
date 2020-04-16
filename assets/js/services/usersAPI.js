import Axios from "axios";

function register(user) {
    return Axios.post("http://localhost:8000/api/users", user);
}
export default {
    register
};