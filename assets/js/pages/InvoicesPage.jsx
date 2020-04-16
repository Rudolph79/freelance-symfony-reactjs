import React, { useEffect, useState }  from 'react';
import Pagination from "../components/Pagination";
import InvoicesAPI from '../services/invoicesAPI';
import moment from "moment";
import {Link} from "react-router-dom";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABEL = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
};

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;

    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        } catch (error) {
            console.log(error.response)
        }
    };

    // Charger les invoices au chargement du composant
    useEffect(() => {
        fetchInvoices();
    }, []);

    // Gestion du chargement de la page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Gestion de ma recherche
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    };
    
    // Gestion de la recherche
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        
        setInvoices(invoices.filter(invoice => invoice.id !== id))
        
        try {
            await InvoicesAPI.deleteInvoice(id);
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    };

    // Gestion du format de la date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // Gestion de la recherche
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase()) ||
            STATUS_LABEL[i.status].toLowerCase().includes(search.toLowerCase())
    );

    // Pagination des données
    const paginatedInvoices = Pagination.getDate(filteredInvoices, currentPage, itemsPerPage);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">
                    Créer une facture
                </Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search}
                       className="form-control" placeholder="Rechercher ..."
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                                {STATUS_LABEL[invoice.status]}
                            </span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                            <button className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(invoice.id)}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage}
                onPageChanged={handlePageChange} length={filteredInvoices.length}
            />
        </>
    );
};

export default InvoicesPage;
