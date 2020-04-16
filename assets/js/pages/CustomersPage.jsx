import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import customersAPI from "../services/customersAPI";
import { Link } from 'react-router-dom';
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Permet de récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les clients");
            // console.log(error.response);
        }
    };

    // Au chargement de la page on va chercher les Customers
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Gestion d'un client
    const handleDelete = async (id) => {
        const originalCustomers = [...customers];

        // 1. Approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        // 2. Approche pessimiste
        try {
            await customersAPI.delete(id);
            toast.success("Le client a bien été supprimé");
        } catch (error) {
            // console.log(error.response);
            setCustomers(originalCustomers);
            toast.error("La suppression n'a pas eu lieu");
        }
    }

    // Gestion du changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Gestion de la recherche
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    // Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    // D'où on part (start) pendant combien (itemsPerPage)
    // Pagination des données
    const paginatedCustomers = Pagination.getDate(filteredCustomers, currentPage, itemsPerPage);

    return <>
        <div className="mb-3 d-flex justify-content-between align-items-center">
            <h1>Liste des clients</h1>
            <Link to="/customers/new" className="btn btn-primary">
                Créer un client
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
                    <th>ID</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th />
                </tr>
            </thead>

            {!loading && (
            <tbody>
                {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <Link to={"/customers/" + customer.id}>{customer.firstName} {customer.lastName}</Link>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            <span className="badge badge-primary">{customer.invoices.length}</span>
                        </td>
                        <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                        <td>
                            <button onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0}
                                className="btn btn-sm btn-danger">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}

            </tbody>)}
        </table>
        {loading && (<TableLoader />)}

        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length} onPageChanged={handlePageChange} />
    </>;
}

export default CustomersPage;