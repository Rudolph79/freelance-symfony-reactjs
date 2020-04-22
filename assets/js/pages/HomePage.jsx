import React from 'react';
import {Link} from "react-router-dom";

const HomePage = (props) => {
    return (
        <div className="jumbotron">
            <h1 className="display-3">Bonjour, les Freelances</h1>
            <p className="lead">
                Il s'agit d'une simple application pour les personnes en Freelances
                afin de gérer leurs facturations. En tant qu'utilisateur vous pouvez créer votre compte,
                créer des clients et leur attribuer à chacun une ou plusieurs factures.<br />
                Pour chacune de ces factures vous pouvez la mettre à un état: envoyée, annulée, payée.
            </p>
            <hr className="my-4" />
                <p>
                    <strong>NB</strong>: Cette application n'est pas professionnelle elle est mise en ligne
                    juste pour des tests. C'est une base de données de faible capacité.<br />
                    Merci
                </p>
                <p className="lead">
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Inscrivez-vous !
                    </Link>
                </p>
        </div>
    );
}

export default HomePage;