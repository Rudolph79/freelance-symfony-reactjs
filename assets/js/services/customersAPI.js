import Axios from 'axios';

function findAll() {
    return Axios
        .get("http://localhost:8000/api/customers")
        .then(response => response.data["hydra:member"]);
}

function deleteCustomer(id) {
    return Axios
        .delete("http://localhost:8000/api/customers/" + id);
}

export default {
    findAll,
    delete: deleteCustomer
};