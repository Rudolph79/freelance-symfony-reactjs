import React, { useState } from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import UsersAPI from "../services/usersAPI";

const RegisterPage = ({ history }) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
        // console.log(currentTarget);
    };

    // Gestion de la soumission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiErrors = {};
        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Les deux mots de passe ne sont pas identiques";
            setErrors(apiErrors);
            return;
        }
        try {
            await UsersAPI.register(user);
            setErrors({});
            // TODO : Flash success
            history.replace("/login");
        } catch (error) {
            console.log(error.response);
            const { violations } = error.response.data;

            if (violations) {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }

            // TODO : Flash error
        }

        console.log(user);
    };
    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" placeholder="Entrez votre prénom"
                       error={errors.firstName} value={user.firstName} onChange={handleChange} />

                <Field name="lastName" label="Nom" placeholder="Entrez votre nom"
                       error={errors.lastName} value={user.lastName} onChange={handleChange} />

                <Field name="email" label="Email" placeholder="Entrez votre adresse email"
                       error={errors.email} value={user.email} onChange={handleChange} />

                <Field name="password" label="Mot de passe" placeholder="Entrez un mot de passe sécurisé"
                       error={errors.password} value={user.password} onChange={handleChange}
                       type="password"
                />

                <Field name="passwordConfirm" label="Confirmation du mot de passe" placeholder="Confirmez votre mot de passe"
                       error={errors.passwordConfirm} value={user.passwordConfirm} onChange={handleChange}
                       type="password"
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Confirmation
                    </button>
                    <Link to="/login" className="btn btn-link">
                        J'ai déjà un compte
                    </Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;