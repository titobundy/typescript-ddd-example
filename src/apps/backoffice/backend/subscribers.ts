import container from './dependency-injection';
import { Definition } from 'node-dependency-injection';
import { DomainEventSubscriber } from '../../../Contexts/Shared/domain/DomainEventSubscriber';
import { DomainEvent } from '../../../Contexts/Shared/domain/DomainEvent';
import { EventBus } from '../../../Contexts/Shared/domain/EventBus';
import { DomainEventMapping } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventMapping';
import Logger from '../../../Contexts/Shared/domain/Logger';

export async function registerSubscribers() {
  const eventBus = container.get('Shared.EventBus') as EventBus;
  const logger = container.get('Shared.Logger') as Logger;
  const subscriberDefinitions = container.findTaggedServiceIds('domainEventSubscriber') as Map<String, Definition>;
  const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];

  subscriberDefinitions.forEach((value: any, key: any) => subscribers.push(container.get(key)));
  const domainEventMapping = new DomainEventMapping(subscribers, logger);
  eventBus.setDomainEventMapping(domainEventMapping);
  eventBus.addSubscribers(subscribers);
  await eventBus.start();
}
