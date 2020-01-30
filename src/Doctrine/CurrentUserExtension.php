<?php

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    /**
     * @var Security
     */
    private $security;
    /**
     * @var AuthorizationCheckerInterface
     */
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    private function andWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        // 1. Obtenir l'utilisateur connecté
        /** @var User $user */
        $user = $this->security->getUser();

        // 2. Si on demande des invoices ou des customers alors, agir sur la requête pour qu'elle tienne en compte
        // de l'utilisateur connecté
        if (($resourceClass === Invoice::class || $resourceClass === Customer::class) &&
            !$this->auth->isGranted('ROLE_ADMIN') && $user instanceof User) {
            $rootAlias = $queryBuilder->getRootAliases()[0];
            if ($resourceClass === Customer::class) {
                $queryBuilder->andWhere("$rootAlias.user = :user");
            } elseif ($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAlias.customer", "c")
                    ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);
            //dd($rootAlias);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder,
                                      QueryNameGeneratorInterface $queryNameGenerator,
                                      string $resourceClass,
                                      string $operationName = null)
    {
        // TODO: Implement applyToCollection() method.
        $this->andWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder,
                                QueryNameGeneratorInterface $queryNameGenerator,
                                string $resourceClass, array $identifiers,
                                string $operationName = null,
                                array $context = [])
    {
        // TODO: Implement applyToItem() method.
        $this->andWhere($queryBuilder, $resourceClass);
    }
}