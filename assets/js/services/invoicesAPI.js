import Axios from 'axios';
import {INVOICES_API} from "../config";

function findAll() {
    return Axios
        .get(INVOICES_API)
        .then(response => response.data["hydra:member"]);
}

function deleteInvoice(id) {
    return Axios
        .delete(INVOICES_API + "/" + id);
}

function find(id) {
    return Axios.get(INVOICES_API + "/" + id)
        .then(response => response.data);
}

function update(id, invoice) {
    Axios.put(INVOICES_API + "/" + id,
        { ...invoice, customer: `/api/customers/${invoice.customer}` });
}

function create(invoice) {
    Axios.post(INVOICES_API, {
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