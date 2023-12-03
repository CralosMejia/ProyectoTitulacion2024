import { injectable } from "inversify";

/**
 * Interface for the Observer, defining the update method that is called when the Observable's state changes.
 */
export interface Observer {
    update: (observable: Observable, data: any) => void;
}

/**
 * Observable class that maintains a list of observers and notifies them of changes.
 */
@injectable()
export class Observable {
    private observers: Observer[] = [];

    /**
     * Subscribes an observer to this observable.
     * 
     * @param observer - The observer to be subscribed.
     */
    subscribe(observer: Observer) {
        this.observers.push(observer);
    }

    /**
     * Unsubscribes an observer from this observable.
     * 
     * @param observer - The observer to be unsubscribed.
     */
    unsubscribe(observer: Observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    /**
     * Notifies all subscribed observers of a change.
     * 
     * @param data - The data to be passed to the observers' update method.
     */
    notify(data: any): void {
        for (const observer of this.observers) {
            observer.update(this, data);
        }
    }
}
