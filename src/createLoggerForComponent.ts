import {Logger} from "winston";
import {Component} from "./Component";

const COMPONENT = Symbol('component');

const EMPTY_COMPONENT = new Component([]);

export function createLoggerForComponent(logger: Logger, component: string) {
    const currentComponent: Component = (logger as any)[COMPONENT] || EMPTY_COMPONENT;
    const newComponent = currentComponent.join(Component.parse(component));

    const newLogger = logger.child({
        component: newComponent.toString()
    });
    (newLogger as any)[COMPONENT] = newComponent;
    return newLogger;
}