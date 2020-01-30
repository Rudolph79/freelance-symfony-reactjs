<?php

namespace App\Events;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event)
    {
        // 1. Récupérer l'utilisateur pour avoir son firstname et son lastname
        /** @var User $user */
        $user = $event->getUser();

        // 2. Enrichir les Data pour qu'elles contiennent ces données
        $data = $event->getData();
        $data['firstname'] = $user->getFirstname();
        $data['lastname'] = $user->getLastname();

        $event->setData($data);
    }
}