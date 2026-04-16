<?php

declare(strict_types=1);

namespace App\Mercure;

use Symfony\Component\Mercure\Update;

/**
 * No-op Mercure publisher used by tests so that entity persistence does
 * not require a real Mercure hub to be reachable.
 */
final class NullPublisher
{
    public function __invoke(Update $update): string
    {
        return '';
    }
}
