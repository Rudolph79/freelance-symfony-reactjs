import Axios from 'axios';

function findAll() {
    return Axios
        .get("http://localhost:8000/api/invoices")
        .then(response => response.data["hydra:member"]);
}

function deleteInvoice(id) {
    return Axios
        .delete("http://localhost:8000/api/invoices/" + id);
}

function find(id) {
    return Axios.get("http://localhost:8000/api/invoices/" + id)
        .then(response => response.data);
}

function update(id, invoice) {
    Axios.put("http://localhost:8000/api/invoices/" +id,
        { ...invoice, customer: `/api/customers/${invoice.customer}` });
}

function create(invoice) {
    Axios.post("http://localhost:8000/api/invoices", {
        ...invoice, customer: `/api/customers/${invoice.customer}`
    });
}

export default {
    findAll,
    deleteInvoice,
    find,
    update,
    create
};