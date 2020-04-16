import React, {useState, useEffect} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersAPI from '../services/customersAPI';
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({ match, history }) => {
    const { id = "new" } = match.params;
    /* if (id !== "new") {
        console.log(+id);
    }*/
    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Récupération du Customer en fonction de l'identifiant
    const fetchCustomer = async (id) => {
        try {
            const { firstName, lastName, email, company } = await CustomersAPI.find(id);
            setCustomer({ firstName, lastName, email, company });
            setLoading(false);
        } catch (error) {
            toast.error("Le client n'a pas être chargé");
            history.replace("/customers");
        }
    };

    // Chargement du customer si besoin au chargement du composant ou au chargement de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        /* Elle doit extraire le name et la value à partir de currentTarget
        (qui représente le composant Field) */
        const { name, value } = currentTarget;
        /* reprendre toutes les données qu'il y a dans customer et juste
        remplacer (ou écraser) la valeur name par value */
        setCustomer({ ...customer, [name]: value });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        /* On reçoit un évènement event et on utilise oreventDefault
        pour éviter qu'il rafraîchisse la page */
        event.preventDefault();

        try {
            if (editing) {
                await CustomersAPI.update(id, customer);
                setErrors({});
                toast.success("Le client a bien été modifié");
            } else {
                await CustomersAPI.create(customer);
                setErrors({});
                toast.success("Le client a bien été créé");
                history.replace("/customers");
            }
            // setErrors({});
        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
                toast.error("Erreur(s) dans votre formulaire");
            }
        }
    };
    return (
        <>
            {(!editing && <h1>Création d'un client</h1>) || (
                <h1>Mise à jour d'un client</h1>
            )}
            {loading && <FormContentLoader />}
            {!loading && (
            <form onSubmit={handleSubmit}>
                <Field name="lastName" label="Nom de famille"
                       placeholder="Nom de famille du client" value={customer.lastName}
                       onChange={handleChange} error={errors.lastName}
                />
                <Field name="firstName" label="Prénom"
                       placeholder="Prénom du client" value={customer.firstName}
                       onChange={handleChange} error={errors.firstName}
                />
                <Field name="email" label="Email"
                       placeholder="Adresse email du client" value={customer.email}
                       onChange={handleChange} error={errors.email}
                />
                <Field name="company" label="Entreprise"
                       placeholder="Entreprise du client" value={customer.company}
                       onChange={handleChange} error={errors.company}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/customers" className="btn btn-link">
                        Retour à la liste
                    </Link>
                </div>
            </form>) }
        </>
    );
};

export default CustomerPage;