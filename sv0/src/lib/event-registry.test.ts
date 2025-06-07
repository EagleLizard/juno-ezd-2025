
import { expect, describe, test, vi } from 'vitest';
import { EventRegistry } from './event-registry';

type EventTestMock = {
  val: string;
};

describe('EventRegistry tests', () => {
  test('calls registered function', () => {
    let evtReg = new EventRegistry();
    let mockCb = vi.fn();
    evtReg.register(mockCb);
    evtReg.fire();
    expect(mockCb).toHaveBeenCalled();
  });
  test('does not call deregistered function', () => {
    let evtReg = new EventRegistry();
    let mockCb = vi.fn();
    let deregCb = evtReg.register(mockCb);
    evtReg.fire();
    deregCb();
    evtReg.fire();
    expect(mockCb).toHaveBeenCalledTimes(1);
  });
  test('calls multiple registered functions', () => {
    let evtReg = new EventRegistry();
    let cb1Mock = vi.fn();
    let cb2Mock = vi.fn();
    evtReg.register(cb1Mock);
    evtReg.register(cb2Mock);
    evtReg.fire();
    expect(cb1Mock).toHaveBeenCalledTimes(1);
    expect(cb2Mock).toHaveBeenCalledTimes(1);
  });
  test('calls registered function with correct param', () => {
    let evtReg = new EventRegistry<EventTestMock>();
    let cbMock = vi.fn();
    let evtMock: EventTestMock = {
      val: 'test_evt_mock',
    };
    evtReg.register(cbMock);
    evtReg.fire(evtMock);
    expect(cbMock).toHaveBeenCalledWith(evtMock);
  });
});
