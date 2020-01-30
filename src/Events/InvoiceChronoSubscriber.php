<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Entity\User;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    /**
     * @var Security
     */
    private $security;

    /**
     * @var InvoiceRepository
     */
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {

        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        // TODO: Implement getSubscribedEvents() method.
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event)
    {
        /** @var User $ourUser */
        $ourUser = $this->security->getUser();

        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Invoice && $method === "POST") {
            /** @var User $user */
            $user = $this->security->getUser();
            $nextChrono = $this->repository->findNextChrono($user);
            $result->setChrono($nextChrono);
            // dd($result);

            if (empty($result->getSentAt())) {
                $result->setSentAt(new \DateTime());
            }

        }
    }
}